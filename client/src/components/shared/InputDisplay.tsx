import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputDisplayProps {
  label: string;
  value: string | string[];
  icon?: React.ComponentType<{ className?: string }>;
  sensitive?: boolean;
  isList?: boolean;
}

const InputDisplay: React.FC<InputDisplayProps> = ({
  label,
  value,
  icon: Icon,
  sensitive = false,
  isList = false,
}) => {
  const [showSensitive, setShowSensitive] = useState(false);

  const renderValue = () => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return <span className="text-orange-300 italic">Não informado</span>;
    }

    if (isList && Array.isArray(value)) {
      return (
        <div className="space-y-2 w-full">
          {value.map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0 mt-2"></span>
              <span className="break-words flex-1 whitespace-pre-wrap leading-relaxed hyphens-auto">
                {item}
              </span>
            </div>
          ))}
        </div>
      );
    }

    if (sensitive && !showSensitive) {
      return (
        <span className="text-orange-200">
          {"•".repeat(Math.min(String(value).length, 12))}
        </span>
      );
    }

    return (
      <span className="break-words w-full inline-block whitespace-pre-wrap leading-relaxed hyphens-auto overflow-wrap-anywhere">
        {String(value)}
      </span>
    );
  };

  return (
    <div className="w-full min-w-0">
      <label className="block text-orange-200 text-sm font-medium mb-2 flex items-center break-words">
        {Icon && (
          <Icon className="w-4 h-4 mr-2 text-orange-400 flex-shrink-0" />
        )}
        <span className="break-words">{label}</span>
      </label>
      <div
        className={`
        p-4 rounded-xl text-white w-full min-h-[3rem] h-auto overflow-visible
        flex gap-3 justify-between
        ${sensitive ? "items-center" : "items-start"}
      `}
        style={{
          background: "rgba(30, 30, 30, 0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex-1 min-w-0 max-w-full overflow-visible">
          {renderValue()}
        </div>
        {sensitive && value && (
          <button
            onClick={() => setShowSensitive(!showSensitive)}
            className="text-orange-400 hover:text-orange-300 transition-colors flex-shrink-0 self-start mt-1"
            title={showSensitive ? "Ocultar" : "Mostrar"}
          >
            {showSensitive ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputDisplay;
