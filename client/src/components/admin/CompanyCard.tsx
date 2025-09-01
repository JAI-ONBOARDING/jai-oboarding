import React from "react";
import { Eye, Trash2 } from "lucide-react";

interface CompanyCardProps {
  company: any;
  onClick: (company: any) => void;
  onDelete?: (company: any) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onClick,
  onDelete,
}) => {
  const companyData = company?.company || company || {};

  return (
    <div
      className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 w-full"
      style={{
        background: "rgba(139, 69, 19, 0.9)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div
        className="cursor-pointer hover:scale-[1.02] transition-all duration-300"
        onClick={() => onClick(company)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-2 break-words whitespace-pre-wrap">
              {companyData.nomeEmpresa || "Nome não informado"}
            </h3>
            <p className="text-orange-200 text-lg mb-1 break-words whitespace-pre-wrap">
              {companyData.cnpj || "CNPJ não informado"}
            </p>
            <p className="text-orange-100 break-words whitespace-pre-wrap">
              {companyData.emailContato || "Email não informado"}
            </p>
          </div>
          <div className="text-orange-400 bg-orange-500 bg-opacity-20 p-3 rounded-full flex-shrink-0">
            <Eye className="w-6 h-6" />
          </div>
        </div>
      </div>

      {onDelete && (
        <div className="flex justify-center mt-4 pt-4 border-t border-orange-500 border-opacity-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(company);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Deletar</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
