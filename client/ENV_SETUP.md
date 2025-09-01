# Configuração de Variáveis de Ambiente - Frontend

## Arquivos de Configuração

### Para Desenvolvimento Local
Crie um arquivo `.env.development` na pasta `client/`:

```env
# Variáveis de ambiente para desenvolvimento
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=JAI Onboarding (Dev)
VITE_NODE_ENV=development
```

### Para Produção
No Vercel, configure as variáveis de ambiente:

```env
VITE_API_BASE_URL=https://jai-onboardind-prod-y75g.vercel.app/api
VITE_APP_NAME=JAI Onboarding
VITE_NODE_ENV=production
```

## Como Funciona

### 1. Prioridade das Configurações:
1. **Variáveis do Vite** (`.env.development`, `.env.production`)
2. **Detecção automática** baseada no hostname
3. **Configuração padrão** (fallback)

### 2. Detecção Automática:
- **Desenvolvimento**: `http://localhost:5000/api`
- **Produção**: `https://jai-onboardind-prod-y75g.vercel.app/api`

### 3. Arquivos de Configuração:
- `client/src/config/environment.ts` - Configuração baseada no ambiente
- `client/src/config/api.ts` - Configuração da API

## Comandos para Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## URLs de Teste

### Desenvolvimento Local:
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`

### Produção:
- Frontend: `https://jai-onboardind-prod.vercel.app`
- Backend: `https://jai-onboardind-prod-y75g.vercel.app`
