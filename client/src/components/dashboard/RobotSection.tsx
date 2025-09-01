import React from "react";
import { Settings, User, FileText } from "lucide-react";
import InputDisplay from "../shared/InputDisplay";

interface RobotSectionProps {
  company: {
    robot?: {
      nome?: string;
      caracteristicas?: string[];
      personalidade?: string[];
      tons?: string[];
    };
  };
}

const RobotSection: React.FC<RobotSectionProps> = ({ company }) => {
  if (!company.robot) return null;

  return (
    <div
      className="rounded-2xl p-6 border border-orange-200 border-opacity-20"
      style={{
        background: "rgba(30, 30, 30, 0.6)",
        backdropFilter: "blur(10px)",
      }}
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2 text-purple-400" />
        Configuração do Robô
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputDisplay
          label="Nome do Robô"
          value={company.robot.nome || ""}
          icon={User}
        />
        <InputDisplay
          label="Características"
          value={
            Array.isArray(company.robot.caracteristicas)
              ? company.robot.caracteristicas.join(", ")
              : company.robot.caracteristicas || ""
          }
          icon={FileText}
        />
        <InputDisplay
          label="Personalidade"
          value={
            Array.isArray(company.robot.personalidade)
              ? company.robot.personalidade.join(", ")
              : company.robot.personalidade || ""
          }
          icon={FileText}
        />
        <InputDisplay
          label="Tons"
          value={
            Array.isArray(company.robot.tons)
              ? company.robot.tons.join(", ")
              : company.robot.tons || ""
          }
          icon={FileText}
        />
      </div>
    </div>
  );
};

export default RobotSection;
