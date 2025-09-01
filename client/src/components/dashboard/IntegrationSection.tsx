import React, { useState } from "react";
import {
  Settings,
  AlertCircle,
  FileText,
  Key,
  Link,
  User,
  List,
  Eye,
  EyeOff,
} from "lucide-react";
import InputDisplay from "../shared/InputDisplay";

interface IntegrationSectionProps {
  company: {
    integracaoTipo: string;
    outroSistema?: string;
    outroSistemaObservacoes?: string;
    evo?: any;
    contracts?: any;
  };
}

const IntegrationSection: React.FC<IntegrationSectionProps> = ({ company }) => {
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  return (
    <>
      {/* Integração */}
      {(company.integracaoTipo === "OUTRO" ||
        company.integracaoTipo === "EVO") && (
        <div
          className="rounded-2xl p-6 border border-orange-200 border-opacity-20"
          style={{
            background: "rgba(30, 30, 30, 0.6)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-purple-400" />
            Integração com Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputDisplay
              label="Tipo de Integração"
              value={company.integracaoTipo}
              icon={Settings}
            />
            {company.integracaoTipo === "OUTRO" && company.outroSistema && (
              <InputDisplay
                label="Sistema Utilizado"
                value={company.outroSistema}
                icon={FileText}
              />
            )}
          </div>

          {company.integracaoTipo === "OUTRO" &&
            company.outroSistemaObservacoes && (
              <div className="mt-4">
                <InputDisplay
                  label="Observações"
                  value={company.outroSistemaObservacoes}
                  icon={FileText}
                />
              </div>
            )}
        </div>
      )}

      {/* Sem Integração */}
      {(company.integracaoTipo === "NAO" ||
        company.integracaoTipo === "Não Utilizo") && (
        <div
          className="rounded-2xl p-6 border border-orange-200 border-opacity-20"
          style={{
            background: "rgba(30, 30, 30, 0.6)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 mr-3 text-orange-400" />
            Configuração de Integração
          </h3>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <InputDisplay
              label="Tipo de Integração"
              value={company.integracaoTipo}
              icon={Settings}
            />
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold text-lg">
                  Status da Integração
                </span>
              </div>
              <span className="text-orange-300 text-sm font-bold bg-orange-500/30 px-4 py-2 rounded-full border border-orange-400/50">
                Não utiliza sistema de gestão externo
              </span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0 mt-2"></div>
              <p className="text-orange-200 text-base leading-relaxed">
                A empresa optou por não utilizar integração com sistema de
                gestão externo. O JAI funcionará de forma independente,
                gerenciando todos os dados internamente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Configurações EVO */}
      {company.integracaoTipo === "EVO" && company.evo && (
        <div
          className="rounded-2xl p-6 border border-orange-200 border-opacity-20"
          style={{
            background: "rgba(30, 30, 30, 0.6)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-400" />
            Configurações EVO
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputDisplay
              label="Link do Sistema"
              value={company.evo.linkSistema}
              icon={Link}
            />
            <div className="relative">
              <InputDisplay
                label="Token de Acesso"
                value={
                  showSensitiveData ? company.evo.token : "••••••••••••••••"
                }
                icon={Key}
              />
              <button
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-300"
              >
                {showSensitiveData ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <InputDisplay
              label="Login Usuário JAI"
              value={company.evo.loginUsuarioJai}
              icon={User}
            />
            <div className="relative">
              <InputDisplay
                label="Senha Usuário JAI"
                value={
                  showSensitiveData
                    ? company.evo.senhaUsuarioJai
                    : "••••••••••••••••"
                }
                icon={Key}
              />
              <button
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-300"
              >
                {showSensitiveData ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Contratos EVO */}
          {company.contracts?.contratosEvo &&
            company.contracts.contratosEvo.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <List className="w-5 h-5 mr-2 text-orange-400" />
                  Contratos EVO Configurados
                  <span className="ml-2 bg-orange-500 bg-opacity-20 text-orange-200 px-2 py-1 rounded-full text-sm">
                    {company.contracts.contratosEvo.length}
                  </span>
                </h4>

                <InputDisplay
                  label="Lista de Contratos"
                  value={company.contracts.contratosEvo}
                  icon={List}
                  isList={true}
                />
              </div>
            )}
        </div>
      )}
    </>
  );
};

export default IntegrationSection;
