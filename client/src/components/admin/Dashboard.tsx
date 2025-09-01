import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, RefreshCw } from "lucide-react";
import Header from "./Header";
import CompanyCard from "./CompanyCard";
import CompanyDetailsModal from "./CompanyDetailsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface DashboardProps {
  token: string;
  admin: any;
  onLogout: () => void;
}

import { buildApiUrl } from "../../config/api";

const Dashboard: React.FC<DashboardProps> = ({ token, admin, onLogout }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyFiles, setCompanyFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl("companies"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompanies(Array.isArray(data.companies) ? data.companies : []);
      } else if (response.status === 401) {
        onLogout();
      } else {

        setCompanies([]);
      }
    } catch (error) {
      
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyFiles = async (companyId: string) => {
    try {
      // Buscar arquivos de todas as seções
      const responses = await Promise.all([
        // Buscar arquivos de campos específicos do FAQ
        fetch(
          buildApiUrl(`companies/${companyId}/files?section=conveniosPlanos`),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(
          buildApiUrl(`companies/${companyId}/files?section=estacionamento`),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(
          buildApiUrl(`companies/${companyId}/files?section=objetosPerdidos`),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(buildApiUrl(`companies/${companyId}/files?section=logo`), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(buildApiUrl(`companies/${companyId}/files?section=sistema`), {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const filesBySection: Record<string, any[]> = {};

      // Processar respostas do FAQ
      const faqSections = [
        "conveniosPlanos",
        "estacionamento",
        "objetosPerdidos",
      ];

      for (let i = 0; i < 3; i++) {
        const response = responses[i];
        if (response.ok) {
          const data = await response.json();
          if (data.files && data.files.length > 0) {
            filesBySection.faq = [...(filesBySection.faq || []), ...data.files];
          }
        }
      }

      // Processar logo
      if (responses[3].ok) {
        const logoData = await responses[3].json();
        if (logoData.files && logoData.files.length > 0) {
          filesBySection.logo = logoData.files;
        }
      }

      // Processar sistema
      if (responses[4].ok) {
        const sistemaData = await responses[4].json();
        if (sistemaData.files && sistemaData.files.length > 0) {
          filesBySection.sistema = sistemaData.files;
        }
      }

      // Combinar todos os arquivos para compatibilidade com o código existente
      const allFiles = [
        ...(filesBySection.faq || []),
        ...(filesBySection.logo || []),
        ...(filesBySection.sistema || []),
      ];

      setCompanyFiles(allFiles);

      // Salvar arquivos por seção para uso no modal
      (window as any).filesBySection = filesBySection;
    } catch (error) {
      
      setCompanyFiles([]);
    }
  };

  const handleCompanyClick = async (company: any) => {
    if (!company || !company._id) return;

    setSelectedCompany(company);
    setModalOpen(true);
    await loadCompanyFiles(company._id);
  };

  const handleDeleteClick = (company: any) => {
    setCompanyToDelete(company);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;

    setIsDeleting(true);
    try {
              const response = await fetch(
          buildApiUrl(`companies/${companyToDelete._id}`),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        if (selectedCompany?._id === companyToDelete._id) {
          setSelectedCompany(null);
          setModalOpen(false);
        }

        setCompanyToDelete(null);
        setDeleteModalOpen(false);

        await loadCompanies();

        // Redireciona para página inicial após deletar
        navigate("/admin");
      } else {
        const data = await response.json();
        alert(`Erro ao deletar empresa: ${data.error || "Erro desconhecido"}`);
      }
    } catch (error) {
      
      alert("Erro de conexão ao deletar empresa");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCompanyDeleted = () => {
    loadCompanies();
    setModalOpen(false);
    setSelectedCompany(null);
  };

  useEffect(() => {
    loadCompanies();
  }, [token]);

  return (
    <div className="min-h-screen bg-orange-500">
      <Header admin={admin} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-bold text-white">
              Empresas Cadastradas
            </h2>
            <button
              onClick={loadCompanies}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
              <span>{loading ? "Carregando..." : "Atualizar"}</span>
            </button>
          </div>

          {loading ? (
            <div className="text-white text-center py-16 text-xl">
              <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              Carregando empresas...
            </div>
          ) : companies.length === 0 ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center text-white max-w-md mx-auto p-6">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-orange-200" />
                <h2 className="text-2xl font-bold mb-4">
                  Nenhuma empresa cadastrada
                </h2>
                <p className="text-orange-100 mb-6">
                  Ainda não há empresas registradas no sistema.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <CompanyCard
                  key={company._id || Math.random()}
                  company={company}
                  onClick={handleCompanyClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Detalhes da Empresa */}
      <CompanyDetailsModal
        company={selectedCompany}
        files={companyFiles}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        token={token}
        onCompanyDeleted={handleCompanyDeleted}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        companyName={
          companyToDelete?.company?.nomeEmpresa ||
          companyToDelete?.nomeEmpresa ||
          "Empresa sem nome"
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCompanyToDelete(null);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
