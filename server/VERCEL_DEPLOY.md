# Deploy do Servidor no Vercel - JAI API

## Configuração para Deploy

### 1. Variáveis de Ambiente
Configure as seguintes variáveis de ambiente no Vercel:

```env
MONGO_URI=mongodb+srv://seu-usuario:sua-senha@seu-cluster.mongodb.net/jai-onboarding
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-jwt
```

### 2. Configuração do Projeto
- **Framework**: Node.js
- **Build Command**: `npm run build`
- **Output Directory**: (não aplicável para Node.js)
- **Install Command**: `npm install`

### 3. Estrutura de Arquivos
```
server/
├── server.js          # Arquivo principal
├── package.json       # Dependências
├── vercel.json        # Configuração do Vercel
├── routes/            # Rotas da API
├── controllers/       # Controladores
├── models/           # Modelos do MongoDB
├── middleware/       # Middlewares
└── config/          # Configurações
```

### 4. Comandos de Deploy
```bash
# Instalar dependências
npm install

# Desenvolvimento local
npm run dev

# Produção
npm start
```

### 5. Configurações Importantes

#### vercel.json
- Configura builds para Node.js
- Rotas para API e fallback
- Variáveis de ambiente

#### server.js
- CORS configurado para frontend Vercel
- Middleware de segurança
- Tratamento de erros

### 6. URLs da API
Após o deploy, a API estará disponível em:
- **Base URL**: `https://seu-projeto.vercel.app/api`
- **Health Check**: `https://seu-projeto.vercel.app/api/health`

### 7. Endpoints Disponíveis
- `POST /api/auth/login` - Login de admin
- `POST /api/users/login` - Login de usuário
- `POST /api/users/register` - Registro de usuário
- `GET /api/users/my-company` - Dados da empresa do usuário
- `POST /api/companies` - Criar empresa
- `PUT /api/companies/update` - Atualizar empresa
- `GET /api/companies/:id/files` - Arquivos da empresa

### 8. Deploy
1. Conecte o repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático será feito a cada push

### 9. Troubleshooting
- Verifique as variáveis de ambiente
- Logs disponíveis no dashboard do Vercel
- Teste o endpoint `/api/health` para verificar se está funcionando
