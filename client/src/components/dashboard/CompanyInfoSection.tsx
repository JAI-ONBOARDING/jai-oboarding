import React from "react";
import { Building2, FileText, Mail, Phone, User } from "lucide-react";
import InputDisplay from "../shared/InputDisplay";

interface CompanyInfoSectionProps {
  company: {
    company: {
      nomeEmpresa: string;
      cnpj: string;
      emailContato: string;
      emailNotaFiscal: string;
      telefone: string;
      responsavelGeral: string;
    };
  };
}

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({ company }) => {
  return (
    <div
      className="rounded-2xl p-6 border border-orange-200 border-opacity-20"
      style={{
        background: "rgba(30, 30, 30, 0.6)",
        backdropFilter: "blur(10px)",
      }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Building2 className="w-6 h-6 mr-3 text-orange-400" />
        Informações da Empresa
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputDisplay
          label="Nome da Empresa"
          value={company.company.nomeEmpresa}
          icon={Building2}
        />
        <InputDisplay
          label="CNPJ"
          value={company.company.cnpj}
          icon={FileText}
        />
        <InputDisplay
          label="Email de Contato"
          value={company.company.emailContato}
          icon={Mail}
        />
        <InputDisplay
          label="Email para Nota Fiscal"
          value={company.company.emailNotaFiscal}
          icon={Mail}
        />
        <InputDisplay
          label="Telefone"
          value={company.company.telefone}
          icon={Phone}
        />
        <InputDisplay
          label="Responsável Geral"
          value={company.company.responsavelGeral}
          icon={User}
        />
      </div>
    </div>
  );
};

export default CompanyInfoSection;
