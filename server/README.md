# JAI Onboarding - Backend

API REST em Node.js para o sistema de onboarding da plataforma JAI.

## Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação baseada em tokens
- **GridFS** - Armazenamento de arquivos
- **bcrypt** - Hash de senhas
- **CORS** - Cross-Origin Resource Sharing

## Estrutura do Projeto

```
server/
├── config/              # Configurações
│   └── db.js           # Configuração MongoDB
├── controllers/         # Controladores da API
│   ├── authController.js
│   ├── companyController.js
│   └── userController.js
├── middleware/          # Middlewares
│   ├── auth.js         # Middleware de autenticação
│   └── userAuth.js     # Middleware de autorização
├── models/             # Modelos Mongoose
│   ├── AdminModel.js
│   ├── CompanyModel.js
│   └── UserModel.js
├── routes/             # Rotas da API
│   ├── authRoutes.js
│   ├── companyRoutes.js
│   └── userRoutes.js
├── scripts/            # Scripts utilitários
└── server.js           # Arquivo principal
```

## Modelos de Dados

### User Model

```javascript
{
  name: String,
  email: String (único),
  password: String (hash),
  role: String (user/admin),
  createdAt: Date
}
```

### Company Model

```javascript
{
  userId: ObjectId (ref: User),
  company: {
    name: String,
    cnpj: String,
    address: Object,
    contacts: Object
  },
  responsaveis: Object,
  contratos: Object,
  integracao: Object,
  whatsapp: Object,
  robo: Object,
  faq: Array,
  files: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## Controladores

### AuthController

- `register` - Registro de usuários
- `login` - Autenticação
- `getMe` - Dados do usuário logado

### CompanyController

- `createCompany` - Criar empresa
- `getCompanies` - Listar empresas (admin)
- `getCompany` - Buscar empresa específica
- `updateCompany` - Atualizar empresa
- `deleteCompany` - Excluir empresa
- `uploadFiles` - Upload de arquivos
- `getFiles` - Listar arquivos
- `deleteFile` - Excluir arquivo

## Middlewares

### auth.js

Middleware de autenticação JWT para proteger rotas.

### userAuth.js

Middleware de autorização baseado em roles (user/admin).

## API Endpoints

### Autenticação

```
POST /api/auth/register    # Registro de usuário
POST /api/auth/login       # Login
GET  /api/auth/me          # Dados do usuário
```

### Empresas

```
GET    /api/companies           # Lista empresas (admin)
POST   /api/companies           # Cria empresa
GET    /api/companies/:id       # Busca empresa
PUT    /api/companies/:id       # Atualiza empresa
DELETE /api/companies/:id       # Remove empresa
```

### Arquivos

```
POST   /api/companies/:id/files     # Upload de arquivos
GET    /api/companies/:id/files     # Lista arquivos
DELETE /api/companies/files/:filename # Remove arquivo
```

### Usuários (Admin)

```
GET    /api/users              # Lista usuários (admin)
DELETE /api/users/:id          # Remove usuário (admin)
```

## Gerenciamento de Arquivos

### GridFS

- Armazenamento de arquivos grandes
- Metadados personalizados
- Streaming de arquivos

### Validação

- Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, JPEG
- Tamanho máximo: 50MB por arquivo
- Organização por seções

### Operações

- Upload múltiplo
- Download de arquivos
- Exclusão com limpeza do GridFS
- Busca por metadados

## Autenticação e Segurança

### JWT (JSON Web Tokens)

- Tokens de acesso com expiração
- Middleware de verificação automática

### Hash de Senhas

- bcrypt com salt rounds
- Senhas nunca armazenadas em texto plano

### CORS

- Configuração específica para origens permitidas
- Suporte a credenciais

### Validação de Dados

- Validação de entrada em todos os endpoints
- Sanitização de dados
- Validação de tipos de arquivo

## Configuração e Instalação

### Pré-requisitos

- Node.js 18+
- MongoDB 6+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd jai-onboarding/server

# Instale as dependências
npm install

### Executando o Projeto

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

## Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm start` - Executa em modo produção