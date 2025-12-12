# 📂 Estrutura Completa do Projeto Zyva

## 🎯 Visão Geral

Este documento mostra **exatamente** onde está cada arquivo e o que você precisa criar.

---

## 📁 Estado Atual do Projeto

```
zyva/                                    # ✅ Pasta raiz
├── frontend/                            # ✅ Criada (vazia)
├── backend/                             # ✅ Criada (vazia)
│
├── .gitignore                           # ✅ Criado
├── docker-compose.yml                   # ✅ Criado
├── README.md                            # ✅ Criado
├── COMECE_AQUI.md                       # ✅ Criado (LEIA PRIMEIRO!)
├── PLANO_DESENVOLVIMENTO.md             # ✅ Criado (seu guia)
│
├── ARQUITETURA_TECNICA.md               # ✅ Documentação
├── ROTAS_E_NAVEGACAO.md                 # ✅ Documentação
├── ANALISE_SCHEMA.md                    # ✅ Documentação
├── schema.prisma                        # ✅ Schema do banco
├── REDIS_STRUCTURE.md                   # ✅ Documentação
└── RESUMO_DECISOES.md                   # ✅ Documentação
```

---

## 🎨 Estrutura Completa do Frontend

### O que você vai criar:

```
frontend/
├── src/
│   ├── app/                             # App Router (Next.js 15)
│   │   ├── (marketing)/                # Rotas públicas
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                # Landing page
│   │   │   └── planos/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/                     # Autenticação
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx            # 📝 FASE 1
│   │   │   ├── cadastro/
│   │   │   │   └── page.tsx            # 📝 FASE 1
│   │   │   └── esqueci-senha/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (app)/                      # Área autenticada
│   │   │   ├── layout.tsx              # Com DockNavigation
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── clientes/               # 📝 FASE 2
│   │   │   │   ├── page.tsx
│   │   │   │   ├── novo/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── importar/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── editar/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── automacoes/             # 📝 FASE 4
│   │   │   │   ├── page.tsx
│   │   │   │   ├── novo/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── execucoes/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── pipeline/               # 📝 FASE 3
│   │   │   │   ├── page.tsx
│   │   │   │   └── tags/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── campanhas/              # 📝 FASE 6
│   │   │   │   ├── page.tsx
│   │   │   │   ├── nova/
│   │   │   │   │   ├── mensagem/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── post/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── metricas/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   └── configuracoes/
│   │   │       ├── page.tsx
│   │   │       ├── perfil/
│   │   │       │   └── page.tsx
│   │   │       ├── integracoes/
│   │   │       │   └── page.tsx
│   │   │       └── plano/
│   │   │           └── page.tsx
│   │   │
│   │   ├── layout.tsx                  # Root layout
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                         # Shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   │
│   │   ├── navigation/
│   │   │   └── DockNavigation.tsx      # 🎨 Dock macOS style
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   │
│   │   ├── contacts/                   # 📝 FASE 2
│   │   │   ├── ContactCard.tsx
│   │   │   ├── ContactList.tsx
│   │   │   ├── ImportModal.tsx
│   │   │   └── ContactForm.tsx
│   │   │
│   │   ├── kanban/                     # 📝 FASE 3
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   └── KanbanCard.tsx
│   │   │
│   │   ├── flow-builder/               # 📝 FASE 4
│   │   │   ├── FlowCanvas.tsx
│   │   │   ├── FlowNode.tsx
│   │   │   ├── NodePalette.tsx
│   │   │   └── ConfigPanel.tsx
│   │   │
│   │   └── campaigns/                  # 📝 FASE 6
│   │       ├── CampaignCard.tsx
│   │       ├── CampaignForm.tsx
│   │       └── MetricsChart.tsx
│   │
│   ├── lib/
│   │   ├── api.ts                      # Cliente axios
│   │   ├── utils.ts                    # Helpers
│   │   └── hooks/
│   │       ├── useAuth.ts
│   │       ├── useContacts.ts
│   │       └── useFlows.ts
│   │
│   └── stores/                         # Zustand
│       ├── auth.ts
│       ├── contacts.ts
│       └── flows.ts
│
├── public/
│   ├── logo.svg
│   └── favicon.ico
│
├── .env.local                          # Variáveis de ambiente
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── components.json                     # Shadcn config
```

### Arquivos de Configuração (Frontend)

#### `package.json`
```json
{
  "name": "zyva-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.0.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.0.0",
    "@hookform/resolvers": "^3.0.0",
    "zod": "^3.22.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "^0.300.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

#### `.env.example`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## ⚙️ Estrutura Completa do Backend

### O que você vai criar:

```
backend/
├── src/
│   ├── modules/                        # Módulos da aplicação
│   │   ├── auth/                       # 📝 FASE 1
│   │   │   ├── auth.schema.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── contacts/                   # 📝 FASE 2
│   │   │   ├── contacts.schema.ts
│   │   │   ├── contacts.service.ts
│   │   │   ├── contacts.controller.ts
│   │   │   └── contacts.routes.ts
│   │   │
│   │   ├── tags/
│   │   │   └── ...
│   │   │
│   │   ├── kanban/                     # 📝 FASE 3
│   │   │   └── ...
│   │   │
│   │   ├── flows/                      # 📝 FASE 4
│   │   │   ├── flows.schema.ts
│   │   │   ├── flows.service.ts
│   │   │   ├── flows.controller.ts
│   │   │   ├── flows.routes.ts
│   │   │   └── flow-executor.ts
│   │   │
│   │   ├── campaigns/                  # 📝 FASE 6
│   │   │   └── ...
│   │   │
│   │   └── messages/                   # 📝 FASE 5
│   │       └── ...
│   │
│   ├── integrations/                   # APIs externas
│   │   ├── whatsapp/                   # 📝 FASE 5
│   │   │   ├── whatsapp.service.ts
│   │   │   ├── whatsapp.webhook.ts
│   │   │   └── whatsapp.types.ts
│   │   │
│   │   ├── instagram/                  # 📝 FASE 6
│   │   │   └── instagram.service.ts
│   │   │
│   │   └── email/                      # 📝 FASE 5
│   │       └── email.service.ts
│   │
│   ├── jobs/                           # BullMQ
│   │   ├── queues/
│   │   │   ├── index.ts
│   │   │   ├── message.queue.ts        # 📝 FASE 5
│   │   │   ├── flow.queue.ts           # 📝 FASE 4
│   │   │   ├── birthday.queue.ts       # 📝 FASE 7
│   │   │   └── social.queue.ts         # 📝 FASE 6
│   │   │
│   │   └── workers/
│   │       ├── message.worker.ts       # 📝 FASE 5
│   │       ├── flow.worker.ts          # 📝 FASE 4
│   │       ├── birthday.worker.ts      # 📝 FASE 7
│   │       └── social.worker.ts        # 📝 FASE 6
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts          # 📝 FASE 1
│   │   ├── role.middleware.ts          # 📝 FASE 1
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts
│   │
│   ├── lib/
│   │   ├── prisma.ts                   # 📝 FASE 1
│   │   ├── redis.ts                    # 📝 FASE 4
│   │   ├── cache.ts                    # 📝 FASE 4
│   │   └── logger.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   │
│   └── server.ts                       # 📝 FASE 1 (Entry point)
│
├── prisma/
│   ├── schema.prisma                   # ✅ Já criado!
│   ├── migrations/
│   │   └── ... (geradas automaticamente)
│   └── seed.ts
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .env                                # Variáveis de ambiente
├── .env.example
├── tsconfig.json
├── package.json
└── nodemon.json
```

### Arquivos de Configuração (Backend)

#### `package.json`
```json
{
  "name": "zyva-backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate",
    "prisma:studio": "prisma studio",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "fastify": "^4.25.0",
    "@fastify/cors": "^9.0.0",
    "@fastify/jwt": "^8.0.0",
    "@fastify/helmet": "^11.0.0",
    "@prisma/client": "^5.8.0",
    "prisma": "^5.8.0",
    "bcryptjs": "^2.4.3",
    "bullmq": "^5.0.0",
    "ioredis": "^5.3.0",
    "zod": "^3.22.0",
    "dotenv": "^16.3.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/bcryptjs": "^2.4.6",
    "tsx": "^4.7.0",
    "nodemon": "^3.0.0"
  }
}
```

#### `.env.example`
```env
# Database
DATABASE_URL="postgresql://zyva:zyva123@localhost:5432/zyva_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="seu-secret-super-seguro-trocar-em-producao"

# Server
PORT=3001
NODE_ENV=development

# WhatsApp (FASE 5)
WHATSAPP_PHONE_ID=
WHATSAPP_TOKEN=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=

# Instagram (FASE 6)
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_ACCOUNT_ID=

# Email (FASE 5)
RESEND_API_KEY=
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 🗂️ Ordem de Criação dos Arquivos

### FASE 0: Setup (Dia 1)

1. ✅ `docker-compose.yml` (já criado)
2. ✅ `.gitignore` (já criado)
3. Backend:
   - `backend/package.json`
   - `backend/tsconfig.json`
   - `backend/.env`
   - `backend/prisma/schema.prisma` (copiar do raiz)
   - `backend/src/lib/prisma.ts`
   - `backend/src/server.ts`
4. Frontend:
   - `frontend/package.json`
   - `frontend/next.config.js`
   - `frontend/tailwind.config.ts`
   - `frontend/tsconfig.json`
   - `frontend/.env.local`

### FASE 1: Autenticação (Dias 2-4)

**Backend** (nesta ordem):
1. `src/lib/prisma.ts`
2. `src/modules/auth/auth.schema.ts`
3. `src/modules/auth/auth.service.ts`
4. `src/modules/auth/auth.controller.ts`
5. `src/modules/auth/auth.routes.ts`
6. `src/middlewares/auth.middleware.ts`
7. Atualizar `src/server.ts`

**Frontend** (nesta ordem):
1. `src/lib/api.ts`
2. `src/stores/auth.ts`
3. `src/app/(auth)/layout.tsx`
4. `src/app/(auth)/login/page.tsx`
5. `src/app/(auth)/cadastro/page.tsx`

### FASE 2: Contatos (Dias 5-8)

**Backend**:
1. `src/modules/contacts/contacts.schema.ts`
2. `src/modules/contacts/contacts.service.ts`
3. `src/modules/contacts/contacts.controller.ts`
4. `src/modules/contacts/contacts.routes.ts`

**Frontend**:
1. `src/components/contacts/ContactCard.tsx`
2. `src/components/contacts/ContactList.tsx`
3. `src/components/contacts/ContactForm.tsx`
4. `src/components/contacts/ImportModal.tsx`
5. `src/app/(app)/clientes/page.tsx`

E assim por diante...

---

## 📊 Legenda de Status

- ✅ **Criado e pronto**
- 📝 **A criar na fase indicada**
- 🔄 **Será atualizado depois**
- ⚠️ **Opcional (pode adicionar depois)**

---

## 🎯 Prioridades

### Alta (fazer primeiro)
1. ✅ Docker Compose rodando
2. 📝 Backend: Autenticação
3. 📝 Frontend: Login/Registro
4. 📝 CRUD de Contatos

### Média (fazer depois)
5. 📝 Kanban
6. 📝 Flow Builder
7. 📝 Mensagens

### Baixa (pode deixar para o final)
8. 📝 Campanhas
9. 📝 Aniversários
10. 📝 Posts sociais

---

## 📞 Próximos Passos

1. **Leia**: `COMECE_AQUI.md`
2. **Siga**: `PLANO_DESENVOLVIMENTO.md` → FASE 0
3. **Crie**: Arquivos da Fase 0 (backend e frontend)
4. **Teste**: Tudo rodando local
5. **Avance**: Para Fase 1 (Autenticação)

---

**Última atualização**: 11/12/2024
**Status**: ✅ Estrutura documentada e pronta para desenvolvimento
