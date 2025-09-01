import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { buildApiUrl } from "../config/api";

/**
 * Hook customizado para gerenciamento de arquivos
 * Gerencia upload, remoção e organização de arquivos por seção
 */
export const useFileManagement = () => {
  const { token } = useAuth();
  const [arquivosPorCampo, setArquivosPorCampo] = useState<
    Record<string, File[]>
  >({});

  /**
   * Gerencia mudanças nos arquivos anexados
   * Remove arquivos existentes do servidor quando são deletados localmente
   */
  const handleFilesChange = (campo: string, files: File[]) => {
    const arquivosAnteriores = arquivosPorCampo[campo] || [];
    const arquivosRemovidos = arquivosAnteriores.filter(
      (arquivoAnterior) =>
        (arquivoAnterior as any).isExistingFile &&
        !files.some(
          (arquivoNovo) =>
            (arquivoNovo as any).uploadedFile?.filename ===
            (arquivoAnterior as any).uploadedFile?.filename
        )
    );

    // Remove arquivos existentes do servidor quando deletados
    if (arquivosRemovidos.length > 0) {
      arquivosRemovidos.forEach(async (arquivo) => {
        const fileInfo = (arquivo as any).uploadedFile;
        if (fileInfo?.filename) {
          try {
            const response = await fetch(
              buildApiUrl(`companies/files/${fileInfo.filename}`),
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              console.error(`Erro ao remover arquivo ${fileInfo.filename}`);
            }
          } catch (error) {
            console.error(
              `Erro ao remover arquivo ${fileInfo.filename}:`,
              error
            );
          }
        }
      });
    }

    setArquivosPorCampo((prev) => ({
      ...prev,
      [campo]: files,
    }));
  };

  /**
   * Carrega arquivos existentes do servidor
   */
  const loadExistingFiles = async (companyId: string) => {
    try {
      const response = await fetch(
        buildApiUrl("users/my-company/files"),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const filesData = await response.json();
        const arquivosOrganizados: Record<string, File[]> = {};

        if (filesData.files && filesData.files.length > 0) {
          filesData.files.forEach((fileInfo: any) => {
            const section = fileInfo.section || "geral";

            // Cria objeto File simulado para compatibilidade
            const file = new File(
              [""],
              fileInfo.originalName || fileInfo.filename,
              { type: fileInfo.contentType || "application/octet-stream" }
            );

            // Adiciona metadados ao arquivo
            (file as any).uploadedFile = fileInfo;
            (file as any).isExistingFile = true;

            if (!arquivosOrganizados[section]) {
              arquivosOrganizados[section] = [];
            }

            // Verifica duplicação antes de adicionar
            const arquivoJaExiste = arquivosOrganizados[section].some(
              (existingFile) =>
                existingFile.name === file.name ||
                (existingFile as any).uploadedFile?.filename ===
                  (file as any).uploadedFile?.filename
            );

            if (!arquivoJaExiste) {
              arquivosOrganizados[section].push(file);
            }
          });
        }

        setArquivosPorCampo(arquivosOrganizados);
        return arquivosOrganizados;
      }
    } catch (error) {
      console.error("Erro ao carregar arquivos:", error);
    }

    return {};
  };

  /**
   * Realiza upload de arquivos diretamente para o servidor
   * Filtra apenas arquivos novos para evitar duplicação
   */
  const uploadFilesDirectly = async (onboardingId: string) => {
    try {
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      // Envia arquivos por seção
      for (const [campo, arquivos] of Object.entries(arquivosPorCampo)) {
        if (arquivos.length === 0) continue;

        // Filtra apenas arquivos novos
        const arquivosNovos = arquivos.filter(
          (arquivo) => !(arquivo as any).isExistingFile
        );

        if (arquivosNovos.length === 0) continue;

        // Verifica duplicação de nomes
        const nomesArquivos = arquivosNovos.map((file) => file.name);
        const nomesUnicos = [...new Set(nomesArquivos)];

        if (nomesArquivos.length !== nomesUnicos.length) {
          // Remove duplicatas
          const arquivosUnicos = arquivosNovos.filter(
            (file, index) => nomesArquivos.indexOf(file.name) === index
          );
          arquivosNovos.length = 0;
          arquivosUnicos.forEach((file) => arquivosNovos.push(file));
        }

        const formData = new FormData();

        arquivosNovos.forEach((file) => {
          formData.append(campo, file, file.name);
        });

        const res = await fetch(
          buildApiUrl(`companies/${onboardingId}/files`),
          {
            method: "POST",
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!res.ok) {
          let errorMessage = `Falha ao enviar arquivos da seção ${campo}`;
          try {
            const error = await res.json();
            errorMessage = error.error || error.message || errorMessage;
          } catch {}

          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Erro ao enviar arquivos:", error);
      throw error;
    }
  };

  return {
    arquivosPorCampo,
    handleFilesChange,
    loadExistingFiles,
    uploadFilesDirectly,
  };
};
