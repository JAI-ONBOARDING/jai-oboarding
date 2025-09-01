import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const { user, token, isLoading } = useAuth();

  // Se ainda está carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se precisa de autenticação e não está logado, redirecionar para login
  if (requireAuth && (!user || !token)) {
    return <Navigate to="/login" replace />;
  }

  // Se não precisa de autenticação e está logado, redirecionar para dashboard
  if (!requireAuth && user && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
