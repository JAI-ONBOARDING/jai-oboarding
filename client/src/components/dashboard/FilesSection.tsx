import React from "react";
import { FileText } from "lucide-react";
import FileItem from "../admin/FileItem";

interface File {
  filename: string;
  originalName: string;
  size: number;
  contentType: string;
  uploadDate: string;
  section: string;
  downloadUrl: string;
}

interface FilesSectionProps {
  files: File[];
  companyId: string;
  token: string;
  onDownloadError: (error: unknown) => void;
}

const FilesSection: React.FC<FilesSectionProps> = ({
  files,
  companyId,
  token,
  onDownloadError,
}) => {
  if (files.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 border border-orange-200 border-opacity-20"
        style={{
          background: "rgba(30, 30, 30, 0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-orange-400" />
          Arquivos Anexados
        </h3>
        <div className="text-center text-orange-200">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Nenhum arquivo anexado ainda</p>
          <p className="text-sm opacity-75">
            Os arquivos aparecerão aqui após serem enviados no onboarding
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 border border-orange-200 border-opacity-20"
      style={{
        background: "rgba(30, 30, 30, 0.6)",
        backdropFilter: "blur(10px)",
      }}
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-orange-400" />
        Arquivos Anexados ({files.length})
      </h3>

      {/* Arquivos por seção */}
      {files.filter(
        (f) =>
          f.section &&
          [
            "conveniosPlanos",
            "estacionamento",
            "objetosPerdidos",
            "conveniosInclusos",
            "menoresIdade",
            "cancelamentoProcesso",
            "planosDiarias",
            "planosAquaticos",
            "personalTrainer",
            "modalidadesExtras",
            "gradeDescricao",
            "politicaAcompanhante",
            "agendamentoApp",
            "equipamentosLista",
            "chavePix",
            "parcelamento",
            "confirmacaoPix",
            "perguntasEspecificas",
            "formasPagamento",
            "espacoKids",
          ].includes(f.section)
      ).length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">
            Arquivos do FAQ
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {files
              .filter(
                (f) =>
                  f.section &&
                  [
                    "conveniosPlanos",
                    "estacionamento",
                    "objetosPerdidos",
                    "conveniosInclusos",
                    "menoresIdade",
                    "cancelamentoProcesso",
                    "planosDiarias",
                    "planosAquaticos",
                    "personalTrainer",
                    "modalidadesExtras",
                    "gradeDescricao",
                    "politicaAcompanhante",
                    "agendamentoApp",
                    "equipamentosLista",
                    "chavePix",
                    "parcelamento",
                    "confirmacaoPix",
                    "perguntasEspecificas",
                    "formasPagamento",
                    "espacoKids",
                  ].includes(f.section)
              )
              .map((file, index) => (
                <div key={index} className="relative">
                  <FileItem
                    file={file}
                    companyId={companyId}
                    token={token}
                    onDownloadError={onDownloadError}
                  />
                  <div className="absolute -top-2 -left-2">
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      FAQ
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {files.filter((f) => f.section === "sistema").length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">
            Arquivos do Sistema
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {files
              .filter((f) => f.section === "sistema")
              .map((file, index) => (
                <div key={index} className="relative">
                  <FileItem
                    file={file}
                    companyId={companyId}
                    token={token}
                    onDownloadError={onDownloadError}
                  />
                  <div className="absolute -top-2 -left-2">
                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      SISTEMA
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {files.filter((f) => f.section === "logo").length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">
            Logos da Empresa
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {files
              .filter((f) => f.section === "logo")
              .map((file, index) => (
                <div key={index} className="relative">
                  <FileItem
                    file={file}
                    companyId={companyId}
                    token={token}
                    onDownloadError={onDownloadError}
                  />
                  <div className="absolute -top-2 -left-2">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      LOGO
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesSection;
