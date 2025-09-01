const mongoose = require("mongoose");

// Subschemas

const CompanySchema = new mongoose.Schema({
  nomeEmpresa: { type: String, required: true },
  cnpj: { type: String, required: true },
  emailContato: { type: String, required: true },
  emailNotaFiscal: { type: String, required: true },
  telefone: { type: String, required: true },
  responsavelGeral: { type: String, required: true },
});

const ResponsavelSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  telefone: { type: String, required: true },
});

const EvoSchema = new mongoose.Schema({
  token: { type: String, default: "" },
  linkSistema: { type: String, default: "" },
  loginUsuarioJai: { type: String, default: "" },
  senhaUsuarioJai: { type: String, default: "" },
});

const ContractsSchema = new mongoose.Schema({
  contratosEvo: { type: [String], default: [] },
});

const WhatsappSchema = new mongoose.Schema({
  dataPreferida: { type: String, default: "" },
  horarioPreferido: { type: String, default: "" },
  numero: { type: String, default: "" },
  observacoes: { type: String, default: "" },
  logoEmpresa: {
    name: { type: String, default: "" },
    size: { type: Number, default: 0 },
    type: { type: String, default: "" },
  },
});

const RobotSchema = new mongoose.Schema({
  nome: { type: String, default: "" },
  caracteristicas: { type: [String], default: [] },
  personalidade: { type: [String], default: [] },
  tons: { type: [String], default: [] },
});

const FaqItemSchema = new mongoose.Schema({
  categoria: { type: String, default: "" },
  perguntaGuia: { type: String, default: "" },
  resposta: { type: String, default: "" },
});

const ExtendedFaqSchema = new mongoose.Schema({
  conveniosPlanos: { type: String, default: "" },
  conveniosInclusos: { type: String, default: "" },
  espacoKids: { type: String, default: "" },
  menoresIdade: { type: String, default: "" },
  estacionamento: { type: String, default: "" },
  objetosPerdidos: { type: String, default: "" },
  cancelamentoProcesso: { type: String, default: "" },
  planosDiarias: { type: String, default: "" },
  planosAquaticos: { type: String, default: "" },
  personalTrainer: { type: String, default: "" },
  modalidadesExtras: { type: String, default: "" },
  gradeDescricao: { type: String, default: "" },
  politicaAcompanhante: { type: String, default: "" },
  agendamentoApp: { type: String, default: "" },
  equipamentosLista: { type: String, default: "" },
  formasPagamento: { type: String, default: "" },
  chavePix: { type: String, default: "" },
  parcelamento: { type: String, default: "" },
  confirmacaoPix: { type: String, default: "" },
  perguntasEspecificas: { type: String, default: "" },
});

// Schema principal

const MainSchema = new mongoose.Schema({
  company: { type: CompanySchema, required: true },
  responsavelFinanceiro: { type: ResponsavelSchema, required: true },
  responsavelOperacao: { type: ResponsavelSchema, required: true },
  contratoAceito: { type: Boolean, required: true },
  integracaoTipo: { type: String, required: true },
  outroSistema: { type: String, default: "" },
  outroSistemaObservacoes: { type: String, default: "" },
  outroSistemaArquivos: { type: [Object], default: [] },
  evo: { type: EvoSchema, default: () => ({}) },
  contracts: { type: ContractsSchema, default: () => ({}) },
  whatsapp: { type: WhatsappSchema, default: () => ({}) },
  robot: { type: RobotSchema, default: () => ({}) },
  faq: { type: [FaqItemSchema], default: [] },
  extendedFaq: { type: ExtendedFaqSchema, default: () => ({}) },
});

module.exports = mongoose.model("Company", MainSchema);
