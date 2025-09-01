import React from "react";
import { Building2, LogOut, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  user: any;
  onRefresh: () => void;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onRefresh,
  onLogout,
}) => {
  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo e informações da empresa */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-white whitespace-nowrap">
                Meu Painel JAI
              </h1>
              <p className="text-orange-200 text-xs sm:text-sm truncate">
                {user?.empresa} • {user?.nome}
              </p>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onRefresh}
              className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Atualizar</span>
            </button>

            <button
              onClick={onLogout}
              className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
