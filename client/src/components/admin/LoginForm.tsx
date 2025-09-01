import React, { useState } from "react";
import CustomInput from "../shared/CustomInput";
import jaiLogo from "../../assets/JAI.png";

interface LoginFormProps {
  onLogin: (token: string, admin: any) => void;
}

import { buildApiUrl } from "../../config/api";

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email e senha são obrigatórios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(buildApiUrl("auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLogin(data.token, data.admin);
      } else {
        setError(data.error || data.message || "Erro no login");
      }
    } catch (error) {
      
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
      }}
    >
      <div
        className="rounded-3xl p-10 w-full max-w-md shadow-2xl"
        style={{
          background: "rgba(139, 69, 19, 0.85)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <img
              src={jaiLogo}
              alt="JAI Logo"
              className="h-20 w-20 object-contain rounded-full"
              style={{
                objectFit: "contain",
                borderRadius: "50%",
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Painel Administrativo
          </h1>
          <p className="text-orange-100 text-lg">Entre com suas credenciais</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="admin@empresa.com"
            required
            onKeyDown={handleKeyPress}
          />

          <CustomInput
            label="Senha"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
            required
            onKeyDown={handleKeyPress}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
