# Deploy no Vercel - Frontend JAI Onboarding

## Configuração para Deploy

### 1. Variáveis de Ambiente
Configure as seguintes variáveis de ambiente no Vercel:

```env
VITE_API_BASE_URL=https://seu-backend-url.com/api
VITE_APP_NAME=JAI Onboarding
```

### 2. Configuração do Projeto
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Estrutura de Arquivos
```
client/
├── dist/           # Build de produção
├── src/            # Código fonte
├── public/         # Arquivos estáticos
├── vercel.json     # Configuração do Vercel
└── package.json    # Dependências
```

### 4. Comandos de Build
```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Preview local
npm run preview
```

### 5. Configurações Importantes

#### vercel.json
- Configura rewrites para SPA
- Headers CORS para API
- Fallback para index.html

#### vite.config.ts
- Otimizações de build
- Chunk splitting
- Source maps apenas em desenvolvimento

### 6. URLs da API
O frontend está configurado para usar a API através da variável de ambiente `VITE_API_BASE_URL`.

**Desenvolvimento**: `http://localhost:5000/api`
**Produção**: Configurar no Vercel

### 7. Deploy
1. Conecte o repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático será feito a cada push

### 8. Troubleshooting
- Se houver problemas de CORS, verifique a configuração do backend
- Para problemas de roteamento, verifique o vercel.json
- Logs disponíveis no dashboard do Vercel
