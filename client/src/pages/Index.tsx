import React from "react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "@/store/store";
import { submitOnboardingData } from "@/store/onboardingSlice";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { validateEmail } from "@/utils/formatEmail";
import { useFileManagement } from "@/hooks/useFileManagement";
import {
  setCompany,
  setFinanceiro,
  setOperacao,
  setContratoAceito,
  setIntegracaoTipo,
  setOutroSistema,
  setOutroSistemaObservacoes,
  setEvo,
  setContracts,
  setWhatsapp,
  setWhatsappLogoEmpresa,
  setRobot,
  updateExtendedFaq,
  setOutroSistemaArquivos,
} from "@/store/onboardingSlice";

// Componentes
import {
  CompanyInfoSection,
  ContractSection,
  SideNavigation,
  IntegrationSection,
  WhatsAppSection,
  RobotSection,
  FaqSection,
  FinalSection,
  OnboardingHeader,
} from "../components/index";

import { buildApiUrl } from "../config/api";

// Configuração do menu de navegação
const menu = [
  { id: "empresa", label: "Empresa" },
  { id: "contratos", label: "Contratos" },
  { id: "integracao", label: "Integração" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "robo", label: "Robô" },
  { id: "faq", label: "FAQ" },
];

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const state = useSelector((root: RootState) => root.onboarding);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [active, setActive] = useState<string>(menu[0].id);
  const [emailErrors, setEmailErrors] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    arquivosPorCampo,
    handleFilesChange,
    loadExistingFiles,
    uploadFilesDirectly,
  } = useFileManagement();

  // Função para limpar erros de validação quando o usuário interage com os campos
  const clearValidationErrors = () => {
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  /**
   * Configura o observer de interseção para navegação automática
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive((entry.target as HTMLElement).id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    menu.forEach((m) => {
      const el = sectionRefs.current[m.id];
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  /**
   * Carrega dados existentes da empresa e arquivos associados
   */
  useEffect(() => {
    const loadExistingData = async () => {
      if (!user || !token) return;

      try {
        const response = await fetch(buildApiUrl("users/my-company"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.company) {
            // Preenche o estado com dados existentes
            dispatch(setCompany(data.company.company || {}));
            dispatch(setFinanceiro(data.company.responsavelFinanceiro || {}));
            dispatch(setOperacao(data.company.responsavelOperacao || {}));
            dispatch(setContratoAceito(data.company.contratoAceito || false));
            dispatch(setIntegracaoTipo(data.company.integracaoTipo || "NAO"));
            dispatch(setOutroSistema(data.company.outroSistema || ""));
            dispatch(
              setOutroSistemaObservacoes(
                data.company.outroSistemaObservacoes || ""
              )
            );

            if (data.company.evo) {
              dispatch(setEvo(data.company.evo));
            }

            if (data.company.contracts) {
              dispatch(setContracts(data.company.contracts));
            }

            if (data.company.whatsapp) {
              dispatch(setWhatsapp(data.company.whatsapp));
            }

            if (data.company.robot) {
              dispatch(setRobot(data.company.robot));
            }

            if (data.company.extendedFaq) {
              dispatch(updateExtendedFaq(data.company.extendedFaq));
            }

            // Carrega arquivos existentes
            const arquivosOrganizados = await loadExistingFiles(
              data.company._id
            );

            // Sincroniza com o estado Redux para arquivos especiais
            if (
              arquivosOrganizados["logo"] &&
              arquivosOrganizados["logo"].length > 0
            ) {
              const logoFile = arquivosOrganizados["logo"][0];
              dispatch(
                setWhatsappLogoEmpresa({
                  name: logoFile.name,
                  size: logoFile.size,
                  type: logoFile.type,
                })
              );
            }

            if (
              arquivosOrganizados["sistema"] &&
              arquivosOrganizados["sistema"].length > 0
            ) {
              const sistemaArquivos = arquivosOrganizados["sistema"].map(
                (file) => ({
                  name: file.name,
                  size: file.size,
                  type: file.type,
                })
              );
              dispatch(setOutroSistemaArquivos(sistemaArquivos));
            }

            toast({
              title: "Dados carregados",
              description:
                "Seus dados existentes foram carregados automaticamente",
            });
          }
        } else if (response.status === 404) {
          const errorData = await response.json();

          // Se a empresa não foi encontrada, mostrar mensagem informativa
          if (errorData.suggestion) {
            toast({
              title: "Nova empresa",
              description: errorData.suggestion,
            });
          }
        }
      } catch (error) {}
    };

    loadExistingData();
  }, [user, token, dispatch]);

  // Limpar erros de validação quando o usuário interage com os campos
  useEffect(() => {
    const handleUserInteraction = () => {
      clearValidationErrors();
    };

    // Adicionar listeners para interações do usuário
    const inputs = document.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.addEventListener("input", handleUserInteraction);
      input.addEventListener("change", handleUserInteraction);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("input", handleUserInteraction);
        input.removeEventListener("change", handleUserInteraction);
      });
    };
  }, [validationErrors]);

  // Mapeamento de chaves de erro para IDs de input
  const keyToIdMap: Record<string, string> = {
    company_contato: "emailContato",
    company_fiscal: "emailNotaFiscal",
    financeiro_email: "emailFinanceiro",
    operacao_email: "emailOperacao",
  };

  /**
   * Submete os dados do onboarding
   * Valida emails, envia dados e arquivos, e redireciona para dashboard
   */
  const submit = async () => {
    try {
      // Validação de emails
      const emailsToValidate = [
        { value: state.company.emailContato, key: "company_contato" },
        { value: state.company.emailNotaFiscal, key: "company_fiscal" },
        { value: state.responsavelFinanceiro.email, key: "financeiro_email" },
        { value: state.responsavelOperacao.email, key: "operacao_email" },
      ];

      const emailErrors: Record<string, boolean> = {};
      let hasEmailErrors = false;
      let firstErrorKey: string | null = null;

      emailsToValidate.forEach(({ value, key }) => {
        if (value && !validateEmail(value)) {
          emailErrors[key] = true;
          hasEmailErrors = true;
          if (!firstErrorKey) firstErrorKey = key;
        }
      });

      if (hasEmailErrors) {
        setEmailErrors(emailErrors);
        toast({
          title: "Emails inválidos",
          description: "Por favor, corrija os emails com formato inválido.",
          variant: "destructive",
        });

        const element = document.getElementById(keyToIdMap[firstErrorKey!]);
        element?.focus();
        return;
      }

      // Cria versão serializável do estado
      const serializableState = {
        ...state,
        outroSistemaArquivos: state.outroSistemaArquivos || [],
        whatsapp: {
          ...state.whatsapp,
          logoEmpresa: state.whatsapp?.logoEmpresa || undefined,
        },
      };

      // Envia dados JSON
      const result = await dispatch(
        submitOnboardingData(serializableState)
      ).unwrap();

      // Upload de arquivos se necessário
      if (
        result.id &&
        Object.keys(arquivosPorCampo).some(
          (campo) => arquivosPorCampo[campo]?.length > 0
        )
      ) {
        try {
          await uploadFilesDirectly(result.id);
        } catch (uploadError) {}
      }

      // Verifica se foi atualização ou criação
      const isUpdate = result.message && result.message.includes("atualizada");

      toast({
        title: isUpdate ? "Dados atualizados" : "Configuração enviada",
        description: isUpdate
          ? "Seus dados foram atualizados com sucesso. Redirecionando para o dashboard..."
          : "Recebemos seus dados com sucesso. Redirecionando para o dashboard...",
      });

      // Redireciona para dashboard após sucesso
      navigate("/dashboard");
    } catch (error) {
      let errorMessage = "Erro ao enviar dados";
      let errorTitle = "Envio não concluído";
      let errorDetails: string[] = [];

      if (error instanceof Error) {
        // Verifica se é erro de validação personalizada
        if (error.message.includes("Campos obrigatórios não preenchidos")) {
          errorTitle = "Erro";

          // Extrai os detalhes de validação da mensagem
          const lines = error.message.split("\n");
          const detailsStartIndex = lines.findIndex((line) =>
            line.includes("•")
          );

          if (detailsStartIndex !== -1) {
            errorDetails = lines
              .slice(detailsStartIndex)
              .filter((line) => line.trim().startsWith("•"))
              .map((line) => line.trim().substring(2)); // Remove o "• " do início
            errorMessage = "Preencha os campos obrigatórios: ";
          } else {
            errorMessage = "Campos obrigatórios não preenchidos";
          }
        }
        // Erro de validação do MongoDB
        else if (error.message.includes("Company validation failed")) {
          errorTitle = "Erro de validação";
          errorMessage =
            "Ocorreu um erro de validação. Por favor, tente novamente.";
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = String(error) || "Erro ao enviar dados";
      }

      // Atualizar os erros de validação para exibição visual
      setValidationErrors(errorDetails);

      // Montar mensagem completa incluindo os detalhes
      let fullMessage = errorMessage;
      if (errorDetails.length > 0) {
        fullMessage += errorDetails.join(", ");
      }

      toast({
        title: errorTitle,
        description: fullMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Onboarding JAI — Integração e Configuração</title>
        <meta
          name="description"
          content="Onboarding JAI: integre seu sistema, configure contratos e WhatsApp, personalize o robô e envie suas informações."
        />
        <link
          rel="canonical"
          href={typeof window !== "undefined" ? window.location.href : ""}
        />
      </Helmet>

      <OnboardingHeader userName={user.nome} />

      <main className="min-h-screen">
        <section id="empresa" ref={(el) => (sectionRefs.current.empresa = el)}>
          <CompanyInfoSection
            emailErrors={emailErrors}
            setEmailErrors={setEmailErrors}
            validationErrors={validationErrors}
          />
        </section>

        <section
          id="contratos"
          ref={(el) => (sectionRefs.current.contratos = el)}
        >
          <ContractSection validationErrors={validationErrors} />
        </section>

        <section
          id="integracao"
          ref={(el) => (sectionRefs.current.integracao = el)}
        >
          <IntegrationSection
            arquivosPorCampo={arquivosPorCampo}
            handleFilesChange={handleFilesChange}
            validationErrors={validationErrors}
          />
        </section>

        <section
          id="whatsapp"
          ref={(el) => (sectionRefs.current.whatsapp = el)}
        >
          <WhatsAppSection
            arquivosPorCampo={arquivosPorCampo}
            handleFilesChange={handleFilesChange}
          />
        </section>

        <section id="robo" ref={(el) => (sectionRefs.current.robo = el)}>
          <RobotSection />
        </section>

        <section id="faq" ref={(el) => (sectionRefs.current.faq = el)}>
          <FaqSection
            arquivosPorCampo={arquivosPorCampo}
            handleFilesChange={handleFilesChange}
          />
        </section>

        <FinalSection onSubmit={submit} />

        <SideNavigation active={active} sectionRefs={sectionRefs} />
      </main>
    </>
  );
}
