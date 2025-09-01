# JAI Onboarding - Frontend

Documentação específica do frontend do sistema JAI Onboarding, desenvolvido em React 18 com TypeScript.

## Visão Geral

O frontend é uma aplicação React moderna que utiliza as melhores práticas de desenvolvimento, incluindo gerenciamento de estado com Redux Toolkit, roteamento com React Router v6, e estilização com Tailwind CSS.

## Tecnologias

- **React 18** - Biblioteca principal para construção da interface
- **TypeScript** - Tipagem estática para maior segurança e produtividade
- **Redux Toolkit** - Gerenciamento de estado global
- **React Router v6** - Roteamento e navegação
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Biblioteca de componentes UI
- **Vite** - Bundler e ferramenta de desenvolvimento
- **Lucide React** - Ícones

## Estrutura do Projeto

```
client/src/
├── components/           # Componentes React reutilizáveis
│   ├── admin/           # Componentes específicos do painel admin
│   ├── index/           # Componentes do processo de onboarding
│   ├── shared/          # Componentes compartilhados
│   └── ui/              # Componentes de interface (Shadcn/ui)
├── contexts/            # Contextos React
├── hooks/               # Custom hooks
├── lib/                 # Utilitários e configurações
├── pages/               # Páginas principais da aplicação
├── store/               # Redux store e slices
├── utils/               # Funções utilitárias
└── assets/              # Recursos estáticos
```

## Componentes Principais

### Componentes de Páginas

- **Index.tsx** - Página principal do onboarding
- **Login.tsx** - Página de autenticação
- **Dashboard.tsx** - Dashboard do usuário
- **Admin.tsx** - Painel administrativo
- **UserDashboard.tsx** - Dashboard específico do usuário
- **NotFound.tsx** - Página 404

### Componentes de Onboarding

- **OnboardingHeader.tsx** - Header do processo de onboarding
- **CompanyInfoSection.tsx** - Seção de informações da empresa
- **ContractSection.tsx** - Seção de contratos
- **FaqSection.tsx** - Seção de perguntas frequentes
- **FinalSection.tsx** - Seção final de revisão
- **IntegrationSection.tsx** - Seção de integração
- **RobotSection.tsx** - Seção de configuração do robô
- **SideNavigation.tsx** - Navegação lateral
- **WhatsAppSection.tsx** - Seção de configuração do WhatsApp

### Componentes Administrativos

- **Dashboard.tsx** - Dashboard principal do admin
- **Header.tsx** - Header do painel admin
- **CompanyCard.tsx** - Card de empresa
- **CompanyDetailsModal.tsx** - Modal de detalhes da empresa
- **DeleteConfirmationModal.tsx** - Modal de confirmação de exclusão
- **FileItem.tsx** - Item de arquivo
- **LoginForm.tsx** - Formulário de login admin

### Componentes Compartilhados

- **FileAttachment.tsx** - Componente de anexo de arquivos
- **CustomInput.tsx** - Input customizado
- **InputDisplay.tsx** - Exibição de dados de input
- **ProtectedRoute.tsx** - Rota protegida

## Hooks Customizados

### useFileManagement

Gerencia upload, remoção e organização de arquivos por seção.

```typescript
const {
  arquivosPorCampo,
  handleFilesChange,
  loadExistingFiles,
  uploadFilesDirectly,
} = useFileManagement();
```

### useMobile

Detecta se o dispositivo é mobile para responsividade.

```typescript
const isMobile = useMobile();
```

### useToast

Gerencia notificações toast na aplicação.

```typescript
const { toast } = useToast();
```

## Contextos

### AuthContext

Gerencia autenticação e estado do usuário.

```typescript
const { user, login, logout, token } = useAuth();
```

## Gerenciamento de Estado (Redux)

### onboardingSlice

Gerencia o estado do processo de onboarding.

**Estados principais:**

- `company` - Dados da empresa
- `responsaveis` - Responsáveis financeiro e operacional
- `contratos` - Configurações de contratos
- `integracao` - Configurações de integração
- `whatsapp` - Configurações do WhatsApp
- `robo` - Configurações do robô
- `faq` - Perguntas frequentes

**Actions principais:**

- `setCompanyData` - Define dados da empresa
- `setResponsaveis` - Define responsáveis
- `setContratos` - Define contratos
- `setIntegracao` - Define integração
- `setWhatsappData` - Define dados do WhatsApp
- `setRoboData` - Define dados do robô
- `setFaqData` - Define FAQ
- `resetOnboarding` - Reseta todos os dados

## Roteamento

A aplicação utiliza React Router v6 com as seguintes rotas:

- `/` - Página inicial (onboarding)
- `/login` - Página de login
- `/dashboard` - Dashboard do usuário
- `/admin` - Painel administrativo
- `*` - Página 404

## Estilização

### Tailwind CSS

Utiliza classes utilitárias do Tailwind CSS para estilização responsiva e consistente.

### Shadcn/ui

Componentes de interface pré-construídos e customizáveis.

### Tema

Paleta de cores personalizada com tons de laranja e marrom.

## Validação de Formulários

### Validação de Email

```typescript
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### Formatação de CNPJ

```typescript
const formatCNPJ = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};
```

### Formatação de Telefone

```typescript
const formatPhone = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};
```

## Upload de Arquivos

### Tipos Suportados

- PDF, DOC, DOCX, XLS, XLSX
- PNG, JPG, JPEG

### Tamanho Máximo

- 50MB por arquivo

### Organização

Os arquivos são organizados por seções:

- `logo` - Logo da empresa
- `sistema` - Documentação do sistema
- `faq` - Arquivos relacionados ao FAQ
- `geral` - Outros arquivos

## Responsividade

A aplicação é totalmente responsiva, adaptando-se a diferentes tamanhos de tela:

- **Desktop** - Layout completo com navegação lateral
- **Tablet** - Layout adaptado com navegação otimizada
- **Mobile** - Layout mobile-first com navegação simplificada

## Performance

### Otimizações Implementadas

- Lazy loading de componentes
- Memoização com React.memo
- Debounce em inputs de busca
- Otimização de re-renders

## Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build
- `npm test` - Executa testes
- `npm run lint` - Executa linter
- `npm run type-check` - Verifica tipos TypeScript

## Variáveis de Ambiente

Crie um arquivo `.env` na pasta `client`:

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=JAI Onboarding
```

## Troubleshooting

### Problemas Comuns

**Erro de CORS**

- Verifique se o backend está configurado para aceitar requisições do frontend
- Configure as variáveis de ambiente corretamente

**Erro de Build**

- Verifique se todas as dependências estão instaladas
- Execute `npm install` novamente

**Erro de Tipos TypeScript**

- Execute `npm run type-check` para identificar problemas
- Verifique se todos os tipos estão corretamente definidos

## Contribuição

1. Siga as convenções de nomenclatura
2. Mantenha a tipagem TypeScript
3. Teste em diferentes dispositivos
4. Documente novos componentes
5. Mantenha a responsividade

---

**Para documentação completa do projeto, incluindo backend, veja o [README principal](../README.md)**
