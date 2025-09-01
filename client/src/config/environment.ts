// Configuração de ambiente
interface EnvironmentConfig {
  API_BASE_URL: string;
  APP_NAME: string;
  NODE_ENV: string;
}

export const ENV_CONFIG: EnvironmentConfig = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  APP_NAME: import.meta.env.VITE_APP_NAME || "JAI Onboarding",
  NODE_ENV: import.meta.env.VITE_NODE_ENV || "development",
};
