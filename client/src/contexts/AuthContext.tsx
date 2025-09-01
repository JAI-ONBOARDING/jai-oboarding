import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { buildApiUrl } from "../config/api";

interface User {
  id: string;
  email: string;
  nome: string;
  empresa: string;
  cnpj: string;
  role: string;
  companyId?: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

interface RegisterData {
  email: string;
  password: string;
  nome: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API_BASE removido - agora usando buildApiUrl

  // Verificar se há token salvo no localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

  

      const response = await fetch(buildApiUrl("users/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      

      if (!response.ok) {
        throw new Error(data.error || "Erro no login");
      }



      setToken(data.token);
      setUser(data.user);

      // Persistência do token no localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));


    } catch (error) {
      console.error("Erro no login:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);



      const url = buildApiUrl("users/register");
      console.log("Tentando registrar em:", url);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      
      console.log("Status da resposta:", response.status);
      console.log("Headers da resposta:", response.headers);

      

      const data = await response.json();
      

      if (!response.ok) {
        console.error("Erro na resposta:", data);
        throw new Error(data.error || "Erro no registro");
      }

      
      setToken(data.token);
      setUser(data.user);

      // Persistência dos dados no localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      
    } catch (error) {
      console.error("Erro no registro:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
