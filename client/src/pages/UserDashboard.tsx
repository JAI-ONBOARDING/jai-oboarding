import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { Building2 } from "lucide-react";
import {
  DashboardHeader,
  CompanyInfoSection,
  ResponsiblesSection,
  IntegrationSection,
  WhatsAppSection,
  RobotSection,
  FaqSection,
  FilesSection,
} from "../components/dashboard";

import { buildApiUrl } from "../config/api";

interface Company {
  _id: string;
  company: {
    nomeEmpresa: string;
    cnpj: string;
    emailContato: string;
    emailNotaFiscal: string;
    telefone: string;
    responsavelGeral: string;
  };
  responsavelFinanceiro: {
    nome: string;
    email: string;
    telefone: string;
  };
  responsavelOperacao: {
    nome: string;
    email: string;
    telefone: string;
  };
  integracaoTipo: string;
  outroSistema?: string;
  outroSistemaObservacoes?: string;
  evo?: any;
  contracts?: any;
  whatsapp?: any;
  robot?: any;
  extendedFaq?: any;
}

interface File {
  filename: string;
  originalName: string;
  size: number;
  contentType: string;
  uploadDate: string;
  section: string;
  downloadUrl: string;
}

export default function UserDashboard() {
  const { user, token, logout } = useAuth();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      loadUserData();
    }
  }, [user, token]);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Carregamento dos dados da empresa
              const companyResponse = await fetch(buildApiUrl("users/my-company"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (companyResponse.ok) {
        const companyData = await companyResponse.json();

        setCompany(companyData.company);
      } else {
        const errorData = await companyResponse.json();
        console.error("Detalhes do erro:", errorData);

        // Se a empresa não foi encontrada, mostrar mensagem específica
        if (companyResponse.status === 404) {
          toast({
            title: "Empresa não encontrada",
            description:
              errorData.error || "Sua empresa não foi encontrada no sistema.",
            variant: "destructive",
          });
        }
      }

      // Carregamento dos arquivos

              const filesResponse = await fetch(buildApiUrl("users/my-company/files"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (filesResponse.ok) {
        const filesData = await filesResponse.json();

        setFiles(filesData.files || []);
      } else {
        console.error("Erro ao carregar arquivos:", filesResponse.status);
        try {
          const errorData = await filesResponse.json();
        } catch (e) {}
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-orange-200" />
          <h2 className="text-2xl font-bold mb-4">
            Nenhuma empresa encontrada
          </h2>
          <p className="text-orange-100 mb-6">
            Parece que você ainda não completou o processo de onboarding.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            Ir para Onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Meu Painel - JAI Onboarding</title>
        <meta
          name="description"
          content="Visualize seus dados e configurações"
        />
      </Helmet>

      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
        }}
      >
        <DashboardHeader
          user={user}
          onRefresh={loadUserData}
          onLogout={handleLogout}
        />

        {/* Conteúdo Principal */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-8">
            <CompanyInfoSection company={company} />

            <ResponsiblesSection company={company} />

            <IntegrationSection company={company} />

            <WhatsAppSection company={company} />

            <RobotSection company={company} />

            <FaqSection company={company} />

            <FilesSection
              files={files}
              companyId={company._id}
              token={token || ""}
              onDownloadError={(error: unknown) => {
                toast({
                  title: "Erro no download",
                  description:
                    error instanceof Error ? error.message : String(error),
                  variant: "destructive",
                });
              }}
            />

            {/* Botão para Onboarding */}
            <div className="text-center">
              <button
                onClick={() => navigate("/onboarding")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Atualizar Dados
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
