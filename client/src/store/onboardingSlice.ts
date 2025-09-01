import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { buildApiUrl } from "../config/api";

export type IntegrationType = "EVO" | "OUTRO" | "NAO" | "";

export interface CompanyInfo {
  nomeEmpresa: string;
  cnpj: string;
  emailContato: string;
  emailNotaFiscal: string;
  telefone: string;
  responsavelGeral: string;
}

export interface PersonInfo {
  nome: string;
  email: string;
  telefone: string;
}

export interface EvoInfo {
  token: string;
  linkSistema: string;
  loginUsuarioJai: string;
  senhaUsuarioJai: string;
}

export interface ContractsConfig {
  contratosEvo: string[]; // length 5
}

export interface WhatsappConfig {
  numero?: string;
  dataPreferida?: string; // ISO date format (YYYY-MM-DD)
  horarioPreferido?: string; // Time format (HH:MM)
  observacoes?: string;
  logoEmpresa?: { name: string; size: number; type: string };
}

export interface RobotConfig {
  nome: string;
  caracteristicas: string[];
  personalidade: string[];
  tons: string[];
}

export interface FaqCard {
  categoria: string;
  perguntaGuia: string;
  resposta: string;
}

// Extended FAQ structure with all the new fields
export interface ExtendedFaqData {
  // Convênios
  conveniosPlanos: string;
  conveniosInclusos: string;

  // Infraestrutura & Serviços
  espacoKids: string;
  menoresIdade: string;
  estacionamento: string;
  objetosPerdidos: string;

  // Cancelamento
  cancelamentoProcesso: string;

  // Planos e Contratação
  planosDiarias: string;
  planosAquaticos: string;

  // Serviços Adicionais
  personalTrainer: string;
  modalidadesExtras: string;

  // Aulas
  gradeDescricao: string;
  politicaAcompanhante: string;

  // Agendamento
  agendamentoApp: string;

  // Equipamentos
  equipamentosLista: string;

  // Cobrança
  formasPagamento: string;
  chavePix: string;
  parcelamento: string;
  confirmacaoPix: string;

  // Perguntas Específicas
  perguntasEspecificas: string;
}

export interface OnboardingState {
  company: CompanyInfo;
  responsavelFinanceiro: PersonInfo;
  responsavelOperacao: PersonInfo;
  contratoAceito: boolean;
  integracaoTipo: IntegrationType;
  outroSistema: string;
  outroSistemaObservacoes: string;
  outroSistemaArquivos: Array<{ name: string; size: number; type: string }>;
  evo: EvoInfo;
  contracts: ContractsConfig;
  whatsapp: WhatsappConfig;
  robot: RobotConfig;
  faq: FaqCard[];
  extendedFaq: ExtendedFaqData;
  extendedFaqArquivos: Record<string, string[]>;
  submitting: boolean;
  submitError?: string;
  submitSuccess?: boolean;
}

// Tipagem para o payload do submitOnboarding
interface SubmitOnboardingPayload {
  onboardingData: Omit<OnboardingState, "outroSistemaArquivos" | "whatsapp"> & {
    outroSistemaArquivos: Array<{ name: string; size: number; type: string }>;
    whatsapp: Omit<WhatsappConfig, "logoEmpresa"> & {
      logoEmpresa?: { name: string; size: number; type: string };
    };
  };
}

// Tipagem para o response da API (ajuste conforme sua API)
interface SubmitOnboardingResponse {
  success: boolean;
  message?: string;
  data?: any;
  id: string;
}

const initialExtendedFaq: ExtendedFaqData = {
  conveniosPlanos: "",
  conveniosInclusos: "",
  espacoKids: "",
  menoresIdade: "",
  estacionamento: "",
  objetosPerdidos: "",
  cancelamentoProcesso: "",
  planosDiarias: "",
  planosAquaticos: "",
  personalTrainer: "",
  modalidadesExtras: "",
  gradeDescricao: "",
  politicaAcompanhante: "",
  agendamentoApp: "",
  equipamentosLista: "",
  formasPagamento: "",
  chavePix: "",
  parcelamento: "",
  confirmacaoPix: "",
  perguntasEspecificas: "",
};

const initialState: OnboardingState = {
  company: {
    nomeEmpresa: "",
    cnpj: "",
    emailContato: "",
    emailNotaFiscal: "",
    telefone: "",
    responsavelGeral: "",
  },
  responsavelFinanceiro: { nome: "", email: "", telefone: "" },
  responsavelOperacao: { nome: "", email: "", telefone: "" },
  contratoAceito: false,
  integracaoTipo: "",
  outroSistema: "",
  outroSistemaObservacoes: "",
  outroSistemaArquivos: [] as Array<{
    name: string;
    size: number;
    type: string;
  }>,
  evo: { token: "", linkSistema: "", loginUsuarioJai: "", senhaUsuarioJai: "" },
  contracts: { contratosEvo: ["", "", "", "", ""] },
  whatsapp: {},
  robot: { nome: "", caracteristicas: [], personalidade: [], tons: [] },
  faq: [
    {
      categoria: "Convênios",
      perguntaGuia: "Quais planos aceita?",
      resposta: "",
    },
    {
      categoria: "Infraestrutura",
      perguntaGuia: "Como é o acesso?",
      resposta: "",
    },
    {
      categoria: "Cobrança",
      perguntaGuia: "Como funciona a cobrança?",
      resposta: "",
    },
  ],
  extendedFaq: initialExtendedFaq,
  // Inicializa o estado para arquivos com arrays vazios para cada campo necessário
  extendedFaqArquivos: {},
  submitting: false,
};

const API_ENDPOINT = buildApiUrl("companies");

export const submitOnboardingData = createAsyncThunk<
  any,
  SubmitOnboardingPayload["onboardingData"],
  { rejectValue: string }
>(
  "onboarding/submitData",
  async (onboardingData, { rejectWithValue, getState }) => {
    try {
      // Obtenção do token de autenticação
      const token = localStorage.getItem("authToken");

      if (!token) {
        return rejectWithValue("Token de autenticação não encontrado");
      }

      // Formatação dos dados conforme estrutura esperada pelo modelo
      const formattedData = {
        company: {
          nomeEmpresa: onboardingData.company.nomeEmpresa || "",
          cnpj: onboardingData.company.cnpj || "",
          emailContato: onboardingData.company.emailContato || "",
          emailNotaFiscal: onboardingData.company.emailNotaFiscal || "",
          telefone: onboardingData.company.telefone || "",
          responsavelGeral: onboardingData.company.responsavelGeral || "",
        },
        responsavelFinanceiro: {
          nome: onboardingData.responsavelFinanceiro.nome || "",
          email: onboardingData.responsavelFinanceiro.email || "",
          telefone: onboardingData.responsavelFinanceiro.telefone || "",
        },
        responsavelOperacao: {
          nome: onboardingData.responsavelOperacao.nome || "",
          email: onboardingData.responsavelOperacao.email || "",
          telefone: onboardingData.responsavelOperacao.telefone || "",
        },
        contratoAceito: onboardingData.contratoAceito || false,
        integracaoTipo: onboardingData.integracaoTipo || "NAO",
        outroSistema: onboardingData.outroSistema || "",
        outroSistemaObservacoes: onboardingData.outroSistemaObservacoes || "",
        outroSistemaArquivos: onboardingData.outroSistemaArquivos || [],
        evo: onboardingData.evo || {},
        contracts: onboardingData.contracts || {
          contratosEvo: ["", "", "", "", ""],
        },
        whatsapp: onboardingData.whatsapp || {},
        robot: onboardingData.robot || {
          nome: "",
          caracteristicas: [],
          personalidade: [],
          tons: [],
        },
        faq: onboardingData.faq || [],
        extendedFaq: onboardingData.extendedFaq || {},
      };

      // Verificação se o usuário já possui empresa cadastrada
      const checkCompanyResponse = await fetch(
        `${API_ENDPOINT.replace("/companies", "/users/my-company")}`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let isUpdate = false;
      let companyId = null;

      if (checkCompanyResponse.ok) {
        const companyData = await checkCompanyResponse.json();
        if (companyData.company) {
          isUpdate = true;
          companyId = companyData.company._id;
        }
      }

      // Definição da URL e método baseado na operação (criação ou atualização)
      const url = isUpdate
        ? `${API_ENDPOINT.replace("/companies", "/companies/update")}`
        : API_ENDPOINT;
      const method = isUpdate ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        let errorMessage = "Falha ao enviar dados";
        let errorDetails = [];

        try {
          const error = await res.json();
          errorMessage = error.error || error.message || errorMessage;
          errorDetails = error.details || error.missingFields || [];
        } catch {}

        // Se há detalhes de validação, incluir na mensagem de erro
        if (errorDetails.length > 0) {
          return rejectWithValue(
            `Campos obrigatórios não preenchidos\n\n• ${errorDetails.join(
              "\n• "
            )}`
          );
        }

        return rejectWithValue(errorMessage);
      }

      const result = await res.json();

      // Preservação do ID existente em caso de atualização
      if (isUpdate && companyId) {
        result.id = companyId;
      }

      return result;
    } catch (error) {
      return rejectWithValue("Erro de rede");
    }
  }
);

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setCompany: (state, action: PayloadAction<Partial<CompanyInfo>>) => {
      state.company = { ...state.company, ...action.payload };
    },
    setFinanceiro: (state, action: PayloadAction<Partial<PersonInfo>>) => {
      state.responsavelFinanceiro = {
        ...state.responsavelFinanceiro,
        ...action.payload,
      };
    },
    setOperacao: (state, action: PayloadAction<Partial<PersonInfo>>) => {
      state.responsavelOperacao = {
        ...state.responsavelOperacao,
        ...action.payload,
      };
    },
    setContratoAceito: (state, action: PayloadAction<boolean>) => {
      state.contratoAceito = action.payload;
    },
    setIntegracaoTipo: (state, action: PayloadAction<IntegrationType>) => {
      state.integracaoTipo = action.payload;
    },
    setOutroSistema: (state, action: PayloadAction<string>) => {
      state.outroSistema = action.payload;
    },
    setOutroSistemaObservacoes: (state, action: PayloadAction<string>) => {
      state.outroSistemaObservacoes = action.payload;
    },
    setOutroSistemaArquivos: (
      state,
      action: PayloadAction<Array<{ name: string; size: number; type: string }>>
    ) => {
      state.outroSistemaArquivos = action.payload;
    },
    setEvo: (state, action: PayloadAction<Partial<EvoInfo>>) => {
      state.evo = { ...state.evo, ...action.payload };
    },
    setContracts: (
      state,
      action: PayloadAction<{ index: number; value: string }>
    ) => {
      const { index, value } = action.payload;
      if (index >= 0 && index < state.contracts.contratosEvo.length) {
        state.contracts.contratosEvo[index] = value;
      }
    },
    setWhatsapp: (state, action: PayloadAction<Partial<WhatsappConfig>>) => {
      state.whatsapp = { ...state.whatsapp, ...action.payload };
    },
    setWhatsappNumero: (state, action: PayloadAction<string>) => {
      state.whatsapp.numero = action.payload;
    },
    setWhatsappDataPreferida: (state, action: PayloadAction<string>) => {
      state.whatsapp.dataPreferida = action.payload;
    },
    setWhatsappHorarioPreferido: (state, action: PayloadAction<string>) => {
      state.whatsapp.horarioPreferido = action.payload;
    },
    setWhatsappObservacoes: (state, action: PayloadAction<string>) => {
      state.whatsapp.observacoes = action.payload;
    },
    setWhatsappLogoEmpresa: (
      state,
      action: PayloadAction<
        { name: string; size: number; type: string } | undefined
      >
    ) => {
      state.whatsapp.logoEmpresa = action.payload;
    },
    setRobot: (state, action: PayloadAction<Partial<RobotConfig>>) => {
      state.robot = { ...state.robot, ...action.payload };
    },
    toggleRobotArrayField: (
      state,
      action: PayloadAction<{
        field: "caracteristicas" | "personalidade" | "tons";
        value: string;
      }>
    ) => {
      const { field, value } = action.payload;
      const arr = state.robot[field];

      if (field === "tons") {
        state.robot[field] = arr.includes(value) ? [] : [value];
      } else {
        const exists = arr.includes(value);
        state.robot[field] = exists
          ? arr.filter((v) => v !== value)
          : [...arr, value];
      }
    },

    setFaqResposta: (
      state,
      action: PayloadAction<{ key: keyof ExtendedFaqData; resposta: string }>
    ) => {
      const { key, resposta } = action.payload;
      state.extendedFaq[key] = resposta;
    },
    updateExtendedFaq: (
      state,
      action: PayloadAction<Partial<ExtendedFaqData>>
    ) => {
      state.extendedFaq = { ...state.extendedFaq, ...action.payload };
    },
    resetOnboarding: () => initialState,
    clearSubmitState: (state) => {
      state.submitError = undefined;
      state.submitSuccess = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboardingData.pending, (state) => {
        state.submitting = true;
        state.submitError = undefined;
        state.submitSuccess = undefined;
      })
      .addCase(submitOnboardingData.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitSuccess = true;
      })
      .addCase(submitOnboardingData.rejected, (state, action) => {
        state.submitting = false;
        state.submitError =
          action.payload || "Erro desconhecido ao enviar dados";
      });
  },
});

export const {
  setCompany,
  setFinanceiro,
  setOperacao,
  setContratoAceito,
  setIntegracaoTipo,
  setOutroSistema,
  setOutroSistemaObservacoes,
  setOutroSistemaArquivos,
  setEvo,
  setContracts,
  setWhatsapp,
  setWhatsappNumero,
  setWhatsappDataPreferida,
  setWhatsappHorarioPreferido,
  setWhatsappObservacoes,
  setWhatsappLogoEmpresa,
  setRobot,
  toggleRobotArrayField,
  setFaqResposta,
  updateExtendedFaq,
  resetOnboarding,
  clearSubmitState,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;

// Exportação do tipo para uso nos componentes
export type { SubmitOnboardingPayload };
