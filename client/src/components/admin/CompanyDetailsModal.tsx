import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  Settings,
  MessageCircle,
  Calendar,
  Clock,
  HelpCircle,
  Key,
  Link,
  List,
  AlertCircle,
  Trash2,
  X,
  Download,
  Image,
} from "lucide-react";
import InputDisplay from "../shared/InputDisplay";
import FileItem from "./FileItem";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface CompanyDetailsModalProps {
  company: any;
  files: any[];
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onCompanyDeleted?: () => void;
}

import { buildApiUrl } from "../../config/api";

const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({
  company,
  files,
  isOpen,
  onClose,
  token,
  onCompanyDeleted,
}) => {
  const [downloadError, setDownloadError] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Buscar arquivos do backend quando o modal abrir
  React.useEffect(() => {
    if (isOpen && company?._id) {
      // Os arquivos já são carregados pelo Dashboard
    }
  }, [isOpen, company?._id]);

  if (!isOpen || !company) return null;

  const c = company?.company || company || {};

  const handleDownloadError = (error: string) => {
    setDownloadError(error);
    setDownloadError("");
  };

  // Função para obter informações da integração
  const getIntegrationInfo = () => {
    const tipo = company?.integracaoTipo;
    switch (tipo) {
      case "EVO":
        return {
          title: "Integração com Sistema EVO",
          description:
            "Sistema integrado para gestão completa de academias e centros de treinamento.",
          icon: Settings,
          color: "text-blue-400",
        };
      case "OUTRO":
        return {
          title: "Integração com Outro Sistema",
          icon: FileText,
          color: "text-purple-400",
        };
      case "NAO":
      case "Não Utilizo":
        return {
          title: "Sem Integração",
          description:
            "A empresa optou por não utilizar integração com sistema de gestão externo.",
          icon: AlertCircle,
          color: "text-gray-400",
        };
      default:
        return {
          title: "Tipo de Integração",
          description: "Configuração de integração não especificada.",
          icon: Settings,
          color: "text-orange-400",
        };
    }
  };

  const integrationInfo = getIntegrationInfo();
  const IconComponent = integrationInfo.icon;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div
          className="rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          style={{
            background: "rgba(139, 69, 19, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-white flex items-center">
                <Building2 className="w-8 h-8 mr-3 text-orange-400" />
                Dados da Empresa
              </h3>
              <button
                onClick={onClose}
                className="text-orange-200 hover:text-white text-3xl bg-orange-500 bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center hover:bg-opacity-40 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {downloadError && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-xl text-red-200 text-sm">
                {downloadError}
              </div>
            )}

            <div className="space-y-8">
              {/* Informações Gerais */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(30, 30, 30, 0.4)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Building2 className="w-6 h-6 mr-3 text-orange-400" />
                  Informações Gerais
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputDisplay
                    label="Nome da Empresa"
                    value={c.nomeEmpresa}
                    icon={Building2}
                  />
                  <InputDisplay label="CNPJ" value={c.cnpj} icon={FileText} />
                  <InputDisplay
                    label="Email de Contato"
                    value={c.emailContato}
                    icon={Mail}
                  />
                  <InputDisplay
                    label="Email para Nota Fiscal"
                    value={c.emailNotaFiscal}
                    icon={Mail}
                  />
                  <InputDisplay
                    label="Telefone"
                    value={c.telefone}
                    icon={Phone}
                  />
                  <InputDisplay
                    label="Responsável Geral"
                    value={c.responsavelGeral}
                    icon={User}
                  />
                </div>
              </div>

              {/* Responsável Financeiro */}
              {company?.responsavelFinanceiro && (
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(30, 30, 30, 0.4)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <User className="w-6 h-6 mr-3 text-orange-400" />
                    Responsável Financeiro
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputDisplay
                      label="Nome"
                      value={company.responsavelFinanceiro?.nome}
                      icon={User}
                    />
                    <InputDisplay
                      label="Email"
                      value={company.responsavelFinanceiro?.email}
                      icon={Mail}
                    />
                    <InputDisplay
                      label="Telefone"
                      value={company.responsavelFinanceiro?.telefone}
                      icon={Phone}
                    />
                  </div>
                </div>
              )}

              {/* Responsável pela Operação */}
              {company?.responsavelOperacao && (
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(30, 30, 30, 0.4)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Settings className="w-6 h-6 mr-3 text-orange-400" />
                    Responsável pela Operação
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputDisplay
                      label="Nome"
                      value={company.responsavelOperacao?.nome}
                      icon={User}
                    />
                    <InputDisplay
                      label="Email"
                      value={company.responsavelOperacao?.email}
                      icon={Mail}
                    />
                    <InputDisplay
                      label="Telefone"
                      value={company.responsavelOperacao?.telefone}
                      icon={Phone}
                    />
                  </div>
                  <p className="text-orange-200 text-sm mt-4 p-3 bg-orange-500 bg-opacity-10 rounded-lg">
                    Esta pessoa será o ponto de contato para dúvidas sobre
                    processos e operação do sistema JAI
                  </p>
                </div>
              )}

              {/* Integração */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(30, 30, 30, 0.4)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <IconComponent
                    className={`w-6 h-6 mr-3 ${integrationInfo.color}`}
                  />
                  Integração com Sistema de Gestão
                </h4>

                <div className="mb-6 p-4 rounded-xl bg-orange-500 bg-opacity-10 border border-orange-500 border-opacity-20">
                  <div className="flex items-center space-x-3">
                    <IconComponent
                      className={`w-5 h-5 ${integrationInfo.color} flex-shrink-0`}
                    />
                    <div>
                      <h5 className="text-white font-semibold">
                        {integrationInfo.title}
                      </h5>
                      {integrationInfo.description && (
                        <p className="text-orange-200 text-sm mt-1">
                          {integrationInfo.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <InputDisplay
                    label="Tipo de Integração"
                    value={company?.integracaoTipo || "Não especificado"}
                    icon={Settings}
                  />
                  {(company?.integracaoTipo === "OUTRO" ||
                    company?.integracaoTipo === "Outro") && (
                    <InputDisplay
                      label="Sistema Utilizado"
                      value={
                        company?.outroSistema || "Sistema não especificado"
                      }
                      icon={FileText}
                    />
                  )}
                </div>

                {/* Informações Adicionais para Outro Sistema */}
                {(company?.integracaoTipo === "OUTRO" ||
                  company?.integracaoTipo === "Outro") && (
                  <>
                    {company?.outroSistemaObservacoes && (
                      <div className="mb-6">
                        <h5 className="text-xl font-semibold text-white mb-4 flex items-center border-b border-purple-500 border-opacity-20 pb-2">
                          <FileText className="w-5 h-5 mr-2 text-purple-400" />
                          Observações Adicionais
                        </h5>
                        <InputDisplay
                          label="Detalhes do Sistema"
                          value={company.outroSistemaObservacoes}
                          icon={FileText}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Configurações EVO */}
                {company?.integracaoTipo === "EVO" && company?.evo && (
                  <>
                    <div className="mb-6">
                      <h5 className="text-xl font-semibold text-white mb-4 flex items-center border-b border-orange-500 border-opacity-20 pb-2">
                        <Settings className="w-5 h-5 mr-2 text-blue-400" />
                        Configurações do Sistema EVO
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputDisplay
                          label="Link do Sistema"
                          value={company.evo.linkSistema}
                          icon={Link}
                        />
                        <InputDisplay
                          label="Token de Acesso"
                          value={company.evo.token}
                          icon={Key}
                          sensitive={true}
                        />
                        <InputDisplay
                          label="Login Usuário JAI"
                          value={company.evo.loginUsuarioJai}
                          icon={User}
                        />
                        <InputDisplay
                          label="Senha Usuário JAI"
                          value={company.evo.senhaUsuarioJai}
                          icon={Key}
                          sensitive={true}
                        />
                      </div>
                    </div>

                    {/* Contratos EVO */}
                    {company.contracts?.contratosEvo &&
                      company.contracts.contratosEvo.length > 0 && (
                        <div className="mb-6">
                          <h5 className="text-xl font-semibold text-white mb-4 flex items-center border-b border-orange-500 border-opacity-20 pb-2">
                            <List className="w-5 h-5 mr-2 text-green-400" />
                            Contratos EVO Configurados
                            <span className="ml-2 bg-green-500 bg-opacity-20 text-green-200 px-2 py-1 rounded-full text-sm">
                              {company.contracts.contratosEvo.length}
                            </span>
                          </h5>

                          <InputDisplay
                            label="Lista de Contratos"
                            value={company.contracts.contratosEvo}
                            icon={List}
                            isList={true}
                          />
                        </div>
                      )}
                  </>
                )}

                {/* Status da Configuração */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-orange-500 bg-opacity-10 to-orange-600 bg-opacity-10 border border-orange-500 border-opacity-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium">
                        Status da Integração
                      </span>
                    </div>
                    <span className="text-orange-300 text-sm font-semibold bg-orange-500 bg-opacity-20 px-3 py-1 rounded-full">
                      {company?.integracaoTipo === "NAO" ||
                      company?.integracaoTipo === "Não Utilizo"
                        ? "Não Configurado"
                        : "Configurado"}
                    </span>
                  </div>
                  {company?.integracaoTipo !== "NAO" &&
                    company?.integracaoTipo !== "Não Utilizo" && (
                      <p className="text-orange-200 text-xs mt-2">
                        Todas as configurações necessárias foram fornecidas para
                        a integração funcionar corretamente.
                      </p>
                    )}
                </div>
              </div>

              {/* WhatsApp */}
              {company?.whatsapp && (
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(30, 30, 30, 0.4)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <MessageCircle className="w-6 h-6 mr-3 text-orange-400" />
                    Configuração WhatsApp
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputDisplay
                      label="Número"
                      value={company.whatsapp.numero}
                      icon={Phone}
                    />
                    <InputDisplay
                      label="Data Preferida"
                      value={company.whatsapp.dataPreferida}
                      icon={Calendar}
                    />
                    <InputDisplay
                      label="Horário Preferido"
                      value={company.whatsapp.horarioPreferido}
                      icon={Clock}
                    />
                  </div>
                  {company.whatsapp.observacoes && (
                    <div className="mt-6">
                      <InputDisplay
                        label="Observações"
                        value={company.whatsapp.observacoes}
                        icon={FileText}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Robô Configurações */}
              {company?.robot && (
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(30, 30, 30, 0.4)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Settings className="w-6 h-6 mr-3 text-orange-400" />
                    Configuração do Robô
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputDisplay
                      label="Nome do Robô"
                      value={company.robot.nome}
                      icon={User}
                    />
                    <InputDisplay
                      label="Características"
                      value={
                        Array.isArray(company.robot.caracteristicas)
                          ? company.robot.caracteristicas.join(", ")
                          : company.robot.caracteristicas
                      }
                      icon={FileText}
                    />
                    <InputDisplay
                      label="Personalidade"
                      value={
                        Array.isArray(company.robot.personalidade)
                          ? company.robot.personalidade.join(", ")
                          : company.robot.personalidade
                      }
                      icon={FileText}
                    />
                    <InputDisplay
                      label="Tons"
                      value={
                        Array.isArray(company.robot.tons)
                          ? company.robot.tons.join(", ")
                          : company.robot.tons
                      }
                      icon={FileText}
                    />
                  </div>
                </div>
              )}

              {/* FAQ Detalhado */}
              {company?.extendedFaq && (
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(30, 30, 30, 0.4)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <HelpCircle className="w-6 h-6 mr-3 text-green-400" />
                    FAQ Detalhado
                    <span className="ml-2 bg-green-500 bg-opacity-20 text-green-200 px-2 py-1 rounded-full text-sm">
                      Completo
                    </span>
                  </h4>

                  {/* Convênios e Planos */}
                  <div className="mb-8">
                    <h5 className="text-xl font-semibold text-white mb-4 flex items-center border-b border-green-500 border-opacity-20 pb-2">
                      <FileText className="w-5 h-5 mr-2 text-green-400" />
                      Convênios e Planos
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputDisplay
                        label="Planos e Convênios Aceitos"
                        value={company.extendedFaq.conveniosPlanos}
                        icon={FileText}
                      />
                      <InputDisplay
                        label="Convênios Inclusos"
                        value={company.extendedFaq.conveniosInclusos}
                        icon={FileText}
                      />
                      <InputDisplay
                        label="Planos com Diárias"
                        value={company.extendedFaq.planosDiarias}
                        icon={FileText}
                      />
                      <InputDisplay
                        label="Planos Aquáticos"
                        value={company.extendedFaq.planosAquaticos}
                        icon={FileText}
                      />
                    </div>
                  </div>

                  {/* Infraestrutura */}
                  <div className="mb-8">
                    <h5 className="text-xl font-semibold text-white mb-4 flex items-center border-b border-blue-500 border-opacity-20 pb-2">
                      <Building2 className="w-5 h-5 mr-2 text-blue-400" />
                      Infraestrutura e Acesso
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputDisplay
                        label="Espaço Kids"
                        value={company.extendedFaq.espacoKids}
                        icon={User}
                      />
                      <InputDisplay
                        label="Menores de Idade"
                        value={company.extendedFaq.menoresIdade}
                        icon={User}
                      />
                      <InputDisplay
                        label="Estacionamento"
                        value={company.extendedFaq.estacionamento}
                        icon={Building2}
                      />
                      <InputDisplay
                        label="Objetos Perdidos"
                        value={company.extendedFaq.objetosPerdidos}
                        icon={FileText}
                      />
                      <InputDisplay
                        label="Lista de Equipamentos"
                        value={company.extendedFaq.equipamentosLista}
                        icon={List}
                      />
                    </div>
                  </div>

                  {/* Serviços e Modalidades */}
                  <div className="mb-8">
                    <h5 className="text-xl font-semibold text-white mb-4 flex items-center border-b border-purple-500 border-opacity-20 pb-2">
                      <Settings className="w-5 h-5 mr-2 text-purple-400" />
                      Serviços e Modalidades
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputDisplay
                        label="Personal Trainer"
                        value={company.extendedFaq.personalTrainer}
                        icon={User}
                      />
                      <InputDisplay
                        label="Modalidades Extras"
                        value={company.extendedFaq.modalidadesExtras}
                        icon={List}
                      />
                      <InputDisplay
                        label="Grade e Descrição"
                        value={company.extendedFaq.gradeDescricao}
                        icon={FileText}
                      />
                      <InputDisplay
                        label="Política de Acompanhante"
                        value={company.extendedFaq.politicaAcompanhante}
                        icon={User}
                      />
                      <InputDisplay
                        label="Agendamento via App"
                        value={company.extendedFaq.agendamentoApp}
                        icon={Settings}
                      />
                    </div>
                  </div>

                  {/* Pagamentos e Cobrança */}
                  <div className="mb-8">
                    <h5 className="text-xl font-semibold text-white mb-4 flex items-center border-b border-yellow-500 border-opacity-20 pb-2">
                      <FileText className="w-5 h-5 mr-2 text-yellow-400" />
                      Pagamentos e Cobrança
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputDisplay
                        label="Formas de Pagamento"
                        value={company.extendedFaq.formasPagamento}
                        icon={FileText}
                      />
                      <InputDisplay
                        label="Chave PIX"
                        value={company.extendedFaq.chavePix}
                        icon={Key}
                      />
                      <InputDisplay
                        label="Parcelamento"
                        value={company.extendedFaq.parcelamento}
                        icon={FileText}
                      />
                      <InputDisplay
                        label="Confirmação PIX"
                        value={company.extendedFaq.confirmacaoPix}
                        icon={FileText}
                      />
                    </div>
                  </div>

                  {/* Políticas e Processos */}
                  <div className="mb-8">
                    <h5 className="text-xl font-semibold text-white mb-4 flex items-center border-b border-red-500 border-opacity-20 pb-2">
                      <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                      Políticas e Processos
                    </h5>
                    <div className="grid grid-cols-1 gap-6">
                      <InputDisplay
                        label="Processo de Cancelamento"
                        value={company.extendedFaq.cancelamentoProcesso}
                        icon={X}
                      />
                      <InputDisplay
                        label="Perguntas Específicas"
                        value={company.extendedFaq.perguntasEspecificas}
                        icon={HelpCircle}
                      />
                    </div>
                  </div>

                  {/* Resumo do FAQ */}
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500 bg-opacity-10 to-blue-500 bg-opacity-10 border border-green-500 border-opacity-20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-medium">
                          Status do FAQ
                        </span>
                      </div>
                      <span className="text-green-300 text-sm font-semibold bg-green-500 bg-opacity-20 px-3 py-1 rounded-full">
                        FAQ Completo Configurado
                      </span>
                    </div>
                    <p className="text-green-200 text-xs mt-2">
                      Todas as informações detalhadas foram fornecidas para o
                      atendimento automatizado.
                    </p>
                  </div>
                </div>
              )}

              {/* Arquivos */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(30, 30, 30, 0.4)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-orange-400" />
                  Arquivos Anexados
                  <span className="ml-2 bg-orange-500 bg-opacity-20 text-orange-200 px-3 py-1 rounded-full text-sm">
                    {files?.length || 0}
                  </span>
                </h4>

                {/* Arquivos do FAQ */}
                {files &&
                  files.filter(
                    (f) =>
                      f.section &&
                      [
                        "conveniosPlanos",
                        "estacionamento",
                        "objetosPerdidos",
                      ].includes(f.section)
                  ).length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-white mb-4 flex items-center border-b border-orange-500 border-opacity-20 pb-2">
                        <FileText className="w-5 h-5 mr-2 text-orange-400" />
                        Arquivos do FAQ
                        <span className="ml-2 bg-orange-500 bg-opacity-20 text-orange-200 px-2 py-1 rounded-full text-sm">
                          {
                            files.filter(
                              (f) =>
                                f.section &&
                                [
                                  "conveniosPlanos",
                                  "estacionamento",
                                  "objetosPerdidos",
                                ].includes(f.section)
                            ).length
                          }
                        </span>
                      </h5>
                      <div className="grid grid-cols-1 gap-4">
                        {files
                          .filter(
                            (f) =>
                              f.section &&
                              [
                                "conveniosPlanos",
                                "estacionamento",
                                "objetosPerdidos",
                              ].includes(f.section)
                          )
                          .map((file, index) => (
                            <div key={index} className="relative">
                              <FileItem
                                file={file}
                                companyId={company._id}
                                token={token}
                                onDownloadError={handleDownloadError}
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

                {/* Arquivos do Sistema */}
                {files &&
                  files.filter((f) => f.section === "sistema").length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-white mb-4 flex items-center border-b border-purple-500 border-opacity-20 pb-2">
                        <FileText className="w-5 h-5 mr-2 text-purple-400" />
                        Arquivos do Sistema de Gestão
                        <span className="ml-2 bg-purple-500 bg-opacity-20 text-purple-200 px-2 py-1 rounded-full text-sm">
                          {files.filter((f) => f.section === "sistema").length}
                        </span>
                      </h5>
                      <div className="grid grid-cols-1 gap-4">
                        {files
                          .filter((f) => f.section === "sistema")
                          .map((file, index) => (
                            <div key={index} className="relative">
                              <FileItem
                                file={file}
                                companyId={company._id}
                                token={token}
                                onDownloadError={handleDownloadError}
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

                {/* Logos da Empresa */}
                {files &&
                  files.filter((f) => f.section === "logo").length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-white mb-4 flex items-center border-b border-blue-500 border-opacity-20 pb-2">
                        <Image className="w-5 h-5 mr-2 text-blue-400" />
                        Logos da Empresa
                        <span className="ml-2 bg-blue-500 bg-opacity-20 text-blue-200 px-2 py-1 rounded-full text-sm">
                          {files.filter((f) => f.section === "logo").length}
                        </span>
                      </h5>
                      <div className="grid grid-cols-1 gap-4">
                        {files
                          .filter((f) => f.section === "logo")
                          .map((file, index) => (
                            <div key={index} className="relative">
                              <FileItem
                                file={file}
                                companyId={company._id}
                                token={token}
                                onDownloadError={handleDownloadError}
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

                {/* Mensagem quando não há arquivos */}
                {(!files || files.length === 0) && (
                  <div className="text-orange-200 text-center py-12 bg-orange-500 bg-opacity-5 rounded-xl border-2 border-dashed border-orange-500 border-opacity-20 mb-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-orange-300 opacity-50" />
                    <p className="text-lg">Nenhum arquivo anexado</p>
                  </div>
                )}

                {/* Botão Deletar Dados */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3"
                  >
                    <Trash2 className="w-6 h-6" />
                    <span>Deletar Todos os Dados da Empresa</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        companyName={c.nomeEmpresa || "Empresa sem nome"}
        onConfirm={() => {
          setIsDeleting(true);
          fetch(buildApiUrl(`companies/${company._id}`), {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (response.ok) {
                setDeleteModalOpen(false);
                onClose();
                if (onCompanyDeleted) onCompanyDeleted();
                navigate("/admin");
              } else {
                throw new Error("Erro ao deletar empresa");
              }
            })
            .catch((error) => {
              alert("Erro de conexão ao deletar empresa");
            })
            .finally(() => setIsDeleting(false));
        }}
        onCancel={() => setDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default CompanyDetailsModal;
