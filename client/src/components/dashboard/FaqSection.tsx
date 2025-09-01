import React from "react";
import { HelpCircle, FileText, User, Building2 } from "lucide-react";
import InputDisplay from "../shared/InputDisplay";

interface FaqSectionProps {
  company: {
    extendedFaq?: {
      conveniosPlanos?: string;
      conveniosInclusos?: string;
      espacoKids?: string;
      menoresIdade?: string;
      estacionamento?: string;
      objetosPerdidos?: string;
      cancelamentoProcesso?: string;
      planosDiarias?: string;
      planosAquaticos?: string;
      personalTrainer?: string;
      modalidadesExtras?: string;
      gradeDescricao?: string;
      politicaAcompanhante?: string;
      agendamentoApp?: string;
      equipamentosLista?: string;
      formasPagamento?: string;
      chavePix?: string;
      parcelamento?: string;
      confirmacaoPix?: string;
      perguntasEspecificas?: string;
    };
  };
}

const FaqSection: React.FC<FaqSectionProps> = ({ company }) => {
  if (!company.extendedFaq) return null;

  return (
    <div
      className="rounded-2xl p-6 border border-orange-200 border-opacity-20"
      style={{
        background: "rgba(30, 30, 30, 0.6)",
        backdropFilter: "blur(10px)",
      }}
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <HelpCircle className="w-5 h-5 mr-2 text-orange-400" />
        FAQ Configurado
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputDisplay
          label="Convênios e Planos"
          value={company.extendedFaq.conveniosPlanos || ""}
          icon={FileText}
        />
        <InputDisplay
          label="O que está incluso em cada convênio"
          value={company.extendedFaq.conveniosInclusos || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Espaço Kids"
          value={company.extendedFaq.espacoKids || ""}
          icon={User}
        />
        <InputDisplay
          label="Aceita menores de idade"
          value={company.extendedFaq.menoresIdade || ""}
          icon={User}
        />
        <InputDisplay
          label="Estacionamento"
          value={company.extendedFaq.estacionamento || ""}
          icon={Building2}
        />
        <InputDisplay
          label="Objetos perdidos"
          value={company.extendedFaq.objetosPerdidos || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Processo de Cancelamento"
          value={company.extendedFaq.cancelamentoProcesso || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Diárias disponíveis e valores"
          value={company.extendedFaq.planosDiarias || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Planos aquáticos"
          value={company.extendedFaq.planosAquaticos || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Personal Trainer"
          value={company.extendedFaq.personalTrainer || ""}
          icon={User}
        />
        <InputDisplay
          label="Modalidades extras"
          value={company.extendedFaq.modalidadesExtras || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Grade com descrição"
          value={company.extendedFaq.gradeDescricao || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Política de acompanhante"
          value={company.extendedFaq.politicaAcompanhante || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Agendamento pelo app"
          value={company.extendedFaq.agendamentoApp || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Equipamentos disponíveis"
          value={company.extendedFaq.equipamentosLista || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Formas de Pagamento"
          value={company.extendedFaq.formasPagamento || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Chave Pix"
          value={company.extendedFaq.chavePix || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Parcelamento"
          value={company.extendedFaq.parcelamento || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Confirmação do Pix"
          value={company.extendedFaq.confirmacaoPix || ""}
          icon={FileText}
        />
        <InputDisplay
          label="Perguntas Específicas"
          value={company.extendedFaq.perguntasEspecificas || ""}
          icon={FileText}
        />
      </div>
    </div>
  );
};

export default FaqSection;
