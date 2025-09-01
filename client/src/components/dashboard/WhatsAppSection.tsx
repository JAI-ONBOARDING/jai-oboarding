import React from "react";
import { MessageCircle, Calendar, Clock, FileText } from "lucide-react";
import InputDisplay from "../shared/InputDisplay";

interface WhatsAppSectionProps {
  company: {
    whatsapp?: {
      numero?: string;
      dataPreferida?: string;
      horarioPreferido?: string;
      observacoes?: string;
    };
  };
}

const WhatsAppSection: React.FC<WhatsAppSectionProps> = ({ company }) => {
  if (!company.whatsapp) return null;

  return (
    <div
      className="rounded-2xl p-6 border border-orange-200 border-opacity-20"
      style={{
        background: "rgba(30, 30, 30, 0.6)",
        backdropFilter: "blur(10px)",
      }}
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <MessageCircle className="w-5 h-5 mr-2 text-green-400" />
        Configuração WhatsApp
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputDisplay
          label="Número"
          value={company.whatsapp.numero || ""}
          icon={MessageCircle}
        />
        <InputDisplay
          label="Data Preferida"
          value={company.whatsapp.dataPreferida || ""}
          icon={Calendar}
        />
        <InputDisplay
          label="Horário Preferido"
          value={company.whatsapp.horarioPreferido || ""}
          icon={Clock}
        />
      </div>
      {company.whatsapp.observacoes && (
        <div className="mt-4">
          <InputDisplay
            label="Observações"
            value={company.whatsapp.observacoes}
            icon={FileText}
          />
        </div>
      )}
    </div>
  );
};

export default WhatsAppSection;
