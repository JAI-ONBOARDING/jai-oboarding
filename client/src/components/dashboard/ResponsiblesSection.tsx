import React from "react";
import { User, Mail, Phone, Settings } from "lucide-react";
import InputDisplay from "../shared/InputDisplay";

interface ResponsiblesSectionProps {
  company: {
    responsavelFinanceiro: {
      nome: string;
      email: string;
      telefone: string;
    };
    responsavelOperacao: {
      nome: string;
      email: string;
      telefone: string;
    };
  };
}

const ResponsiblesSection: React.FC<ResponsiblesSectionProps> = ({
  company,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Responsável Financeiro */}
      <div
        className="rounded-2xl p-6 border border-orange-200 border-opacity-20"
        style={{
          background: "rgba(30, 30, 30, 0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-green-400" />
          Responsável Financeiro
        </h3>
        <div className="space-y-4">
          <InputDisplay
            label="Nome"
            value={company.responsavelFinanceiro.nome}
            icon={User}
          />
          <InputDisplay
            label="Email"
            value={company.responsavelFinanceiro.email}
            icon={Mail}
          />
          <InputDisplay
            label="Telefone"
            value={company.responsavelFinanceiro.telefone}
            icon={Phone}
          />
        </div>
      </div>

      {/* Responsável pela Operação */}
      <div
        className="rounded-2xl p-6 border border-orange-200 border-opacity-20"
        style={{
          background: "rgba(30, 30, 30, 0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-400" />
          Responsável pela Operação
        </h3>
        <div className="space-y-4">
          <InputDisplay
            label="Nome"
            value={company.responsavelOperacao.nome}
            icon={User}
          />
          <InputDisplay
            label="Email"
            value={company.responsavelOperacao.email}
            icon={Mail}
          />
          <InputDisplay
            label="Telefone"
            value={company.responsavelOperacao.telefone}
            icon={Phone}
          />
        </div>
      </div>
    </div>
  );
};

export default ResponsiblesSection;
