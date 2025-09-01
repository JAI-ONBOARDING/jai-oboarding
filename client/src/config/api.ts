import { ENV_CONFIG } from "./environment";

// Configuração da API
export const API_CONFIG = {
  // URL base da API - configuração automática baseada no ambiente
  BASE_URL: ENV_CONFIG.API_BASE_URL,

  // Headers padrão
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
};

// Função para obter a URL base da API
export const getApiBaseUrl = (): string => {
  return API_CONFIG.BASE_URL;
};

// Função para construir URLs completas da API
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  // Remove barra inicial se existir para evitar duplicação
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

// Função para fazer requisições com configuração padrão
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const fullUrl = url.startsWith("http") ? url : buildApiUrl(url);

  const defaultOptions: RequestInit = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    ...options,
  };

  // Adicionar token de autenticação se disponível
  const token = localStorage.getItem("token");
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return fetch(fullUrl, defaultOptions);
};
