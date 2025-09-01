import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { LogOut } from "lucide-react";
import JAI from "../../assets/favicon.ico";

interface OnboardingHeaderProps {
  userName: string;
}

/**
 * Header do processo de onboarding
 * Exibe logo, título e botão de navegação para o dashboard
 */
const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ userName }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <div className="container flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={JAI}
            alt="Logo JAI"
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-hero-gradient flex-shrink-0"
          />
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            Onboarding JAI
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden sm:inline text-sm text-muted-foreground">
            Olá, {userName}
          </span>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-orange-600 text-white px-2 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-700 transition-colors text-xs sm:text-sm font-medium"
          >
            <span className="hidden sm:inline">Meu Painel</span>
            <span className="sm:hidden">Painel</span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-orange-600 text-white px-2 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-700 transition-colors text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default OnboardingHeader;
