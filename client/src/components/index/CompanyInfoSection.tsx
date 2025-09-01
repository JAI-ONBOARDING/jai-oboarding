import React from "react";
import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  setCompany,
  setFinanceiro,
  setOperacao,
} from "@/store/onboardingSlice";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatEmail, validateEmail } from "@/utils/formatEmail";
import { formatPhone } from "@/utils/formatPhone";

interface CompanyInfoSectionProps {
  emailErrors: Record<string, boolean>;
  setEmailErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  validationErrors?: string[];
  errors?: {
    responsavelGeral?: string;
    financeiroEmail?: string;
    financeiroTelefone?: string;
    operacaoNome?: string;
    operacaoEmail?: string;
    operacaoTelefone?: string;
  };
  setErrors?: (errors: any) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
  emailErrors,
  setEmailErrors,
  validationErrors = [],
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.onboarding);

  // Função para verificar se um campo tem erro de validação
  const hasFieldError = (fieldName: string): boolean => {
    return validationErrors.some((error) =>
      error.toLowerCase().includes(fieldName.toLowerCase())
    );
  };

  // Handlers para campos formatados
  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    dispatch(setCompany({ cnpj: formatted }));
  };

  const handlePhoneChange = (field: string, value: string) => {
    const formatted = formatPhone(value);

    if (field === "company") {
      dispatch(setCompany({ telefone: formatted }));
    } else if (field === "financeiro") {
      dispatch(setFinanceiro({ telefone: formatted }));
    } else if (field === "operacao") {
      dispatch(setOperacao({ telefone: formatted }));
    }
  };

  const handleEmailChange = (
    field: string,
    value: string,
    emailField: string
  ) => {
    // Aplica formatação antes de atualizar
    const formatted = formatEmail(value);

    // Atualizar o valor no estado via Redux
    if (field === "company") {
      if (emailField === "contato") {
        dispatch(setCompany({ emailContato: formatted }));
      } else if (emailField === "fiscal") {
        dispatch(setCompany({ emailNotaFiscal: formatted }));
      }
    } else if (field === "financeiro") {
      dispatch(setFinanceiro({ email: formatted }));
    } else if (field === "operacao") {
      dispatch(setOperacao({ email: formatted }));
    }

    // Limpar erro se o campo estiver vazio ou válido
    const fieldKey = `${field}_${emailField}`;
    if (formatted === "" || validateEmail(formatted)) {
      setEmailErrors((prev) => ({ ...prev, [fieldKey]: false }));
    } else {
      setEmailErrors((prev) => ({ ...prev, [fieldKey]: true }));
    }
  };

  return (
    <section className="bg-hero-gradient py-10">
      <div className="container">
        <h1 className="sr-only">Onboarding JAI</h1>
        <article className="glass-panel rounded-3xl p-6 md:p-10">
          <header className="flex items-center gap-3 text-primary-foreground mb-4">
            <Building className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">Dados da Sua Empresa</h2>
          </header>

          {/* Informações Gerais */}
          <section className="mb-8">
            <h3 className="text-base font-medium mb-4 text-primary-foreground/90">
              Informações Gerais
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="nomeEmpresa"
                  className="text-primary-foreground/80"
                >
                  Nome da Empresa *
                </Label>
                <Input
                  id="nomeEmpresa"
                  placeholder="Digite o nome da sua empresa"
                  value={state.company.nomeEmpresa}
                  onChange={(e) =>
                    dispatch(setCompany({ nomeEmpresa: e.target.value }))
                  }
                  className={
                    hasFieldError("nome da empresa")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {hasFieldError("nome da empresa") && (
                  <p className="text-xs text-red-500 mt-1">
                    Nome da empresa é obrigatório
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="cnpj" className="text-primary-foreground/80">
                  CNPJ *
                </Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={state.company.cnpj}
                  onChange={handleCNPJChange}
                  maxLength={18}
                  className={
                    hasFieldError("cnpj")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {hasFieldError("cnpj") && (
                  <p className="text-xs text-red-500 mt-1">
                    CNPJ é obrigatório
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="emailContato"
                  className="text-primary-foreground/80"
                >
                  Email de Contato *
                </Label>
                <Input
                  id="emailContato"
                  type="email"
                  placeholder="contato@empresa.com"
                  value={state.company.emailContato}
                  onChange={(e) =>
                    handleEmailChange("company", e.target.value, "contato")
                  }
                  className={
                    emailErrors.company_contato ||
                    hasFieldError("email de contato")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {emailErrors.company_contato && (
                  <p className="text-xs text-red-500 mt-1">
                    Formato de email inválido
                  </p>
                )}
                {hasFieldError("email de contato") &&
                  !emailErrors.company_contato && (
                    <p className="text-xs text-red-500 mt-1">
                      Email de contato é obrigatório
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="emailNf" className="text-primary-foreground/80">
                  Email para Nota Fiscal *
                </Label>
                <Input
                  id="emailNotaFiscal"
                  type="email"
                  placeholder="fiscal@empresa.com"
                  value={state.company.emailNotaFiscal}
                  onChange={(e) =>
                    handleEmailChange("company", e.target.value, "fiscal")
                  }
                  className={
                    emailErrors.company_fiscal ||
                    hasFieldError("email para nota fiscal")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {emailErrors.company_fiscal && (
                  <p className="text-xs text-red-500 mt-1">
                    Formato de email inválido
                  </p>
                )}
                {hasFieldError("email para nota fiscal") &&
                  !emailErrors.company_fiscal && (
                    <p className="text-xs text-red-500 mt-1">
                      Email para nota fiscal é obrigatório
                    </p>
                  )}
              </div>
              <div>
                <Label
                  htmlFor="telefone"
                  className="text-primary-foreground/80"
                >
                  Telefone *
                </Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  value={state.company.telefone}
                  onChange={(e) => handlePhoneChange("company", e.target.value)}
                  className={
                    hasFieldError("telefone")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {hasFieldError("telefone") && (
                  <p className="text-xs text-red-500 mt-1">
                    Telefone é obrigatório
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="respGeral"
                  className="text-primary-foreground/80"
                >
                  Responsável Geral *
                </Label>
                <Input
                  id="respGeral"
                  placeholder="Nome do responsável"
                  value={state.company.responsavelGeral}
                  onChange={(e) =>
                    dispatch(setCompany({ responsavelGeral: e.target.value }))
                  }
                  className={
                    hasFieldError("responsável geral")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {hasFieldError("responsável geral") && (
                  <p className="text-xs text-red-500 mt-1">
                    Responsável geral é obrigatório
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Responsável Financeiro */}
          <section className="mb-8">
            <h3 className="text-base font-medium mb-4 text-primary-foreground/90">
              Responsável Financeiro
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="finNome">Nome *</Label>
                <Input
                  id="finNome"
                  value={state.responsavelFinanceiro.nome}
                  onChange={(e) =>
                    dispatch(setFinanceiro({ nome: e.target.value }))
                  }
                  placeholder="Nome do responsável financeiro"
                  className={
                    hasFieldError("nome do responsável financeiro")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {hasFieldError("nome do responsável financeiro") && (
                  <p className="text-xs text-red-500 mt-1">
                    Nome do responsável financeiro é obrigatório
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="finEmail">Email *</Label>
                <Input
                  id="emailFinanceiro"
                  type="email"
                  value={state.responsavelFinanceiro.email}
                  onChange={(e) =>
                    handleEmailChange("financeiro", e.target.value, "email")
                  }
                  placeholder="financeiro@empresa.com"
                  className={
                    emailErrors.financeiro_email ||
                    hasFieldError("email do responsável financeiro")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {emailErrors.financeiro_email && (
                  <p className="text-xs text-red-500 mt-1">
                    Formato de email inválido
                  </p>
                )}
                {hasFieldError("email do responsável financeiro") &&
                  !emailErrors.financeiro_email && (
                    <p className="text-xs text-red-500 mt-1">
                      Email do responsável financeiro é obrigatório
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="finTel">Telefone *</Label>
                <Input
                  id="finTel"
                  value={state.responsavelFinanceiro.telefone}
                  onChange={(e) =>
                    handlePhoneChange("financeiro", e.target.value)
                  }
                  placeholder="(11) 99999-9999"
                  className={
                    hasFieldError("telefone do responsável financeiro")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {hasFieldError("telefone do responsável financeiro") && (
                  <p className="text-xs text-red-500 mt-1">
                    Telefone do responsável financeiro é obrigatório
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Responsável Operação */}
          <section className="mb-2">
            <h3 className="text-base font-medium mb-4 text-primary-foreground/90">
              Responsável pela Operação
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="opNome">Nome *</Label>
                <Input
                  id="opNome"
                  value={state.responsavelOperacao.nome}
                  onChange={(e) =>
                    dispatch(setOperacao({ nome: e.target.value }))
                  }
                  placeholder="Nome do responsável operacional"
                  className={
                    hasFieldError("nome do responsável operacional")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {hasFieldError("nome do responsável operacional") && (
                  <p className="text-xs text-red-500 mt-1">
                    Nome do responsável operacional é obrigatório
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="opEmail">Email *</Label>
                <Input
                  id="emailOperacao"
                  type="email"
                  value={state.responsavelOperacao.email}
                  onChange={(e) =>
                    handleEmailChange("operacao", e.target.value, "email")
                  }
                  placeholder="operacao@empresa.com"
                  className={
                    emailErrors.operacao_email ||
                    hasFieldError("email do responsável operacional")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {emailErrors.operacao_email && (
                  <p className="text-xs text-red-500 mt-1">
                    Formato de email inválido
                  </p>
                )}
                {hasFieldError("email do responsável operacional") &&
                  !emailErrors.operacao_email && (
                    <p className="text-xs text-red-500 mt-1">
                      Email do responsável operacional é obrigatório
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="opTel">Telefone *</Label>
                <Input
                  id="opTel"
                  value={state.responsavelOperacao.telefone}
                  onChange={(e) =>
                    handlePhoneChange("operacao", e.target.value)
                  }
                  placeholder="(11) 99999-9999"
                  className={
                    hasFieldError("telefone do responsável operacional")
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {hasFieldError("telefone do responsável operacional") && (
                  <p className="text-xs text-red-500 mt-1">
                    Telefone do responsável operacional é obrigatório
                  </p>
                )}
              </div>
            </div>
          </section>
        </article>
      </div>
    </section>
  );
};

export default CompanyInfoSection;
