import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Building2,
  User,
  FileText,
} from "lucide-react";
import jaiLogo from "../assets/JAI.png";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nome: "",
  });
  const [errors, setErrors] = useState({
    password: "",
  });

  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Função para validar senha
  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação da senha apenas no registro
    if (!isLogin) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setErrors({ password: passwordError });
        return;
      }
    }

    // Limpa erros se não houver problemas
    setErrors({ password: "" });

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
        });
        navigate("/dashboard");
      } else {
        await register(formData);
        toast({
          title: "Conta criada com sucesso!",
          description: "Agora você pode fazer login.",
        });
        setIsLogin(true);
        setFormData({ email: "", password: "", nome: "" });
        setErrors({ password: "" });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validação em tempo real para senha (apenas no registro)
    if (name === "password" && !isLogin) {
      const passwordError = validatePassword(value);
      setErrors({
        ...errors,
        password: passwordError,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? "Login" : "Registro"} - JAI Onboarding</title>
        <meta
          name="description"
          content={
            isLogin ? "Faça login na sua conta JAI" : "Crie sua conta JAI"
          }
        />
      </Helmet>

      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
        }}
      >
        <div className="max-w-md w-full space-y-8">
          {/* Logo e Título */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center mb-4">
              <img
                src={jaiLogo}
                alt="JAI Logo"
                className="h-16 w-16 object-contain rounded-full"
                style={{
                  objectFit: "contain",
                  borderRadius: "50%",
                }}
              />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
            </h2>
            <p className="mt-2 text-orange-100">
              {isLogin
                ? "Faça login para acessar seu painel"
                : "Comece sua jornada com o JAI"}
            </p>
          </div>

          {/* Formulário */}
          <div
            className="rounded-3xl p-8 shadow-2xl"
            style={{
              background: "rgba(139, 69, 19, 0.85)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Nome (apenas no registro) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-300" />
                    <input
                      name="nome"
                      type="text"
                      required
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      style={{
                        background: "rgba(30, 30, 30, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-300" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    style={{
                      background: "rgba(30, 30, 30, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-300" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      !isLogin && errors.password
                        ? "focus:ring-red-400 border-red-400"
                        : "focus:ring-orange-400"
                    }`}
                    style={{
                      background: "rgba(30, 30, 30, 0.6)",
                      border:
                        !isLogin && errors.password
                          ? "1px solid rgba(239, 68, 68, 0.8)"
                          : "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-300 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {/* Mensagem de erro da senha */}
                {!isLogin && errors.password && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Botão de Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isLogin ? "Entrando..." : "Criando conta..."}
                  </div>
                ) : isLogin ? (
                  "Entrar"
                ) : (
                  "Criar Conta"
                )}
              </button>
            </form>

            {/* Alternar entre Login e Registro */}
            <div className="mt-6 text-center">
              <p className="text-orange-200">
                {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ email: "", password: "", nome: "" });
                    setErrors({ password: "" });
                  }}
                  className="ml-2 text-white font-semibold hover:text-orange-200 transition-colors"
                >
                  {isLogin ? "Registre-se" : "Faça login"}
                </button>
              </p>
            </div>
          </div>

          {/* Link para Admin */}
          <div className="text-center">
            <Link
              to="/admin"
              className="text-orange-200 hover:text-white text-sm transition-colors"
            >
              Acesso Administrativo
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
