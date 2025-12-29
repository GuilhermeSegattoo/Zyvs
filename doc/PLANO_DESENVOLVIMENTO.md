# 🗺️ Thumdra - Plano de Desenvolvimento Completo

## 📋 Visão Geral

Este documento contém o **roteiro completo** para desenvolver o Thumdra do zero até o MVP em produção.

O projeto está dividido em **2 pastas principais**:
- **`frontend/`** - Aplicação Next.js (interface do usuário)
- **`backend/`** - API Fastify (lógica de negócio)

---

## 📁 Estrutura de Pastas

```
thumdra/
├── frontend/                    # 🎨 APLICAÇÃO NEXT.JS
│   ├── src/
│   │   ├── app/                # App Router (rotas)
│   │   ├── components/         # Componentes React
│   │   ├── lib/               # Utils e helpers
│   │   ├── stores/            # Zustand (estado global)
│   │   └── styles/            # CSS global
│   ├── public/                # Arquivos estáticos
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/                     # ⚙️ API FASTIFY
│   ├── src/
│   │   ├── modules/           # Módulos (contacts, flows, etc)
│   │   ├── integrations/      # APIs externas (WhatsApp, etc)
│   │   ├── jobs/              # Filas BullMQ
│   │   ├── middlewares/       # Auth, CORS, etc
│   │   ├── lib/               # Prisma, Redis, Logger
│   │   ├── utils/             # Helpers
│   │   └── server.ts          # Entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco
│   │   ├── migrations/        # Migrações
│   │   └── seed.ts            # Dados iniciais
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml          # PostgreSQL + Redis local
├── .gitignore
├── README.md
└── PLANO_DESENVOLVIMENTO.md    # 👈 Este arquivo
```

---

## 🎯 Fases de Desenvolvimento

### 📊 Resumo das Fases

| Fase | Duração | Foco | Entrega |
|------|---------|------|---------|
| **0** | 1 dia | Setup inicial | Projeto rodando local |
| **1** | 3 dias | Autenticação | Login/Registro funcionando |
| **2** | 4 dias | CRUD Contatos | Gestão completa de clientes |
| **3** | 3 dias | Kanban | Pipeline visual |
| **4** | 5 dias | Flow Builder | Automações básicas |
| **5** | 4 dias | Mensagens | WhatsApp + Email funcionando |
| **6** | 3 dias | Campanhas | Disparos em massa |
| **7** | 2 dias | Aniversários | Automação de datas |
| **8** | 3 dias | Deploy | MVP em produção |

**Total estimado**: ~30 dias (6 semanas)

---

## 🚀 FASE 0: Setup Inicial (DIA 1)

### Objetivo
Ter o projeto rodando localmente com Docker, banco de dados e estrutura pronta.

### Checklist

#### 0.1 - Criar estrutura de pastas ✅
```bash
# Já criamos as pastas frontend/ e backend/
cd thumdra
ls  # Deve mostrar: frontend/ backend/
```

#### 0.2 - Setup do Backend
```bash
cd backend

# Inicializar projeto Node.js
npm init -y

# Instalar dependências principais
npm install fastify @fastify/cors @fastify/jwt @fastify/helmet
npm install prisma @prisma/client bcryptjs
npm install bullmq ioredis
npm install zod dotenv

# Instalar dependências de desenvolvimento
npm install -D typescript @types/node @types/bcryptjs
npm install -D tsx nodemon prisma

# Inicializar TypeScript
npx tsc --init

# Inicializar Prisma
npx prisma init
```

**Arquivos criados**:
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/.env`
- `backend/prisma/schema.prisma`

#### 0.3 - Setup do Frontend
```bash
cd ../frontend

# Criar projeto Next.js
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# Instalar dependências adicionais
npm install @tanstack/react-query zustand
npm install react-hook-form @hookform/resolvers zod
npm install framer-motion lucide-react
npm install axios

# Shadcn UI (componentes)
npx shadcn-ui@latest init
```

**Arquivos criados**:
- `frontend/package.json`
- `frontend/next.config.js`
- `frontend/tailwind.config.ts`
- `frontend/tsconfig.json`

#### 0.4 - Docker Compose (PostgreSQL + Redis)
Criar arquivo `docker-compose.yml` na raiz:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: thumdra-postgres
    environment:
      POSTGRES_USER: thumdra
      POSTGRES_PASSWORD: thumdra123
      POSTGRES_DB: thumdra_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U thumdra']
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: thumdra-redis
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

Iniciar containers:
```bash
docker-compose up -d
```

#### 0.5 - Configurar Prisma Schema
Copiar o schema que criamos para `backend/prisma/schema.prisma`.

Rodar migração inicial:
```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

#### 0.6 - Criar arquivo .env (backend)
```bash
# backend/.env

# Database
DATABASE_URL="postgresql://thumdra:thumdra123@localhost:5432/thumdra_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="seu-secret-super-seguro-aqui-trocar-em-producao"

# Integrações (deixar vazio por enquanto)
WHATSAPP_PHONE_ID=
WHATSAPP_TOKEN=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=

INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_ACCOUNT_ID=

RESEND_API_KEY=

# Server
PORT=3001
NODE_ENV=development
```

#### 0.7 - Criar arquivo .env (frontend)
```bash
# frontend/.env.local

NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 0.8 - Testar se está tudo funcionando
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Verificar containers
docker-compose ps
```

**Resultado esperado**:
- ✅ Backend rodando em `http://localhost:3001`
- ✅ Frontend rodando em `http://localhost:3000`
- ✅ PostgreSQL e Redis funcionando

---

## 🔐 FASE 1: Autenticação (DIAS 2-4)

### Objetivo
Sistema completo de autenticação com JWT, registro, login e controle de acesso.

### 1.1 - Backend: Módulo de Autenticação

**Arquivos a criar**:

#### `backend/src/modules/auth/auth.schema.ts`
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  plan: z.enum(['FREE', 'PRO', 'BUSINESS']).optional().default('FREE'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
```

#### `backend/src/modules/auth/auth.service.ts`
```typescript
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { RegisterInput, LoginInput } from './auth.schema';

export class AuthService {
  async register(data: RegisterInput) {
    // 1. Verificar se email já existe
    const exists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new Error('Email já cadastrado');
    }

    // 2. Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Criar usuário e organização
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'LOJA',
        plan: data.plan,
        ownedOrganizations: {
          create: {
            name: `${data.name}'s Organization`,
            slug: data.email.split('@')[0],
            plan: data.plan,
          },
        },
      },
      include: {
        ownedOrganizations: true,
      },
    });

    // 4. Atualizar organizationId no usuário
    await prisma.user.update({
      where: { id: user.id },
      data: { organizationId: user.ownedOrganizations[0].id },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.ownedOrganizations[0].id,
    };
  }

  async login(data: LoginInput) {
    // 1. Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { organization: true },
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // 2. Verificar senha
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new Error('Credenciais inválidas');
    }

    // 3. Atualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
      organization: user.organization,
    };
  }

  async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        plan: true,
        organizationId: true,
        organization: true,
        createdAt: true,
      },
    });
  }
}
```

#### `backend/src/modules/auth/auth.controller.ts`
```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema } from './auth.schema';

const authService = new AuthService();

export async function register(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = registerSchema.parse(req.body);
    const user = await authService.register(data);

    // Gerar token JWT
    const token = req.server.jwt.sign({
      userId: user.id,
      role: user.role,
      organizationId: user.organizationId,
    });

    return reply.send({
      user,
      token,
    });
  } catch (error: any) {
    return reply.status(400).send({
      error: error.message,
    });
  }
}

export async function login(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = loginSchema.parse(req.body);
    const user = await authService.login(data);

    // Gerar token JWT
    const token = req.server.jwt.sign({
      userId: user.id,
      role: user.role,
      organizationId: user.organizationId,
    });

    return reply.send({
      user,
      token,
    });
  } catch (error: any) {
    return reply.status(401).send({
      error: error.message,
    });
  }
}

export async function me(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user.userId;
    const user = await authService.getProfile(userId);

    if (!user) {
      return reply.status(404).send({ error: 'Usuário não encontrado' });
    }

    return reply.send(user);
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
}
```

#### `backend/src/modules/auth/auth.routes.ts`
```typescript
import { FastifyInstance } from 'fastify';
import { register, login, me } from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

export async function authRoutes(fastify: FastifyInstance) {
  // Públicas
  fastify.post('/register', register);
  fastify.post('/login', login);

  // Protegidas
  fastify.get('/me', { preHandler: [authenticate] }, me);
}
```

#### `backend/src/middlewares/auth.middleware.ts`
```typescript
import { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ error: 'Não autenticado' });
  }
}

export function requireRole(role: 'ADMIN' | 'LOJA') {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.user.role !== role) {
      return reply.status(403).send({ error: 'Acesso negado' });
    }
  };
}
```

#### `backend/src/lib/prisma.ts`
```typescript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
```

#### `backend/src/server.ts`
```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import helmet from '@fastify/helmet';
import { authRoutes } from './modules/auth/auth.routes';

const fastify = Fastify({
  logger: true,
});

// Plugins
fastify.register(cors, {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://seudominio.com'
    : 'http://localhost:3000',
  credentials: true,
});

fastify.register(helmet);

fastify.register(jwt, {
  secret: process.env.JWT_SECRET!,
});

// Declarar tipos customizados
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      userId: string;
      role: 'ADMIN' | 'LOJA';
      organizationId?: string;
    };
  }
}

// Rotas
fastify.register(authRoutes, { prefix: '/api/auth' });

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Iniciar servidor
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server rodando em http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

#### `backend/package.json` (adicionar scripts)
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:migrate": "npx prisma migrate dev",
    "prisma:generate": "npx prisma generate",
    "prisma:studio": "npx prisma studio"
  }
}
```

### 1.2 - Frontend: Páginas de Auth

**Arquivos a criar**:

#### `frontend/src/lib/api.ts`
```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### `frontend/src/stores/auth.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'LOJA';
  organizationId?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
        localStorage.setItem('token', token);
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

#### `frontend/src/app/(auth)/login/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const response = await api.post('/api/auth/login', data);
      const { user, token } = response.data;

      setAuth(user, token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Thumdra
          </h1>
          <p className="text-gray-600 mt-2">Entre na sua conta</p>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Link para cadastro */}
          <p className="text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <a href="/cadastro" className="text-purple-600 font-semibold hover:underline">
              Criar conta
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
```

### ✅ Checklist da Fase 1

- [ ] Backend: Criar módulo de autenticação
- [ ] Backend: Configurar JWT
- [ ] Backend: Criar middlewares (auth, role)
- [ ] Backend: Testar endpoints com Postman
- [ ] Frontend: Criar store Zustand
- [ ] Frontend: Criar página de login
- [ ] Frontend: Criar página de cadastro
- [ ] Frontend: Testar fluxo completo

**Resultado esperado**:
- ✅ Usuário consegue se registrar
- ✅ Usuário consegue fazer login
- ✅ Token JWT é gerado e armazenado
- ✅ Redirecionamento para dashboard após login

---

## 👥 FASE 2: CRUD de Contatos (DIAS 5-8)

### Objetivo
Gestão completa de contatos com importação CSV, tags e busca.

### 2.1 - Backend: Módulo de Contatos

**Arquivos a criar**:

#### `backend/src/modules/contacts/contacts.service.ts`
#### `backend/src/modules/contacts/contacts.controller.ts`
#### `backend/src/modules/contacts/contacts.routes.ts`
#### `backend/src/modules/contacts/contacts.schema.ts`

### 2.2 - Frontend: Páginas de Contatos

#### `frontend/src/app/(app)/clientes/page.tsx`
#### `frontend/src/components/contacts/ContactCard.tsx`
#### `frontend/src/components/contacts/ImportModal.tsx`

### ✅ Checklist da Fase 2

- [ ] Backend: CRUD completo (list, create, update, delete)
- [ ] Backend: Filtros e busca
- [ ] Backend: Importação CSV
- [ ] Backend: Exportação Excel
- [ ] Backend: Sistema de tags
- [ ] Frontend: Lista de contatos
- [ ] Frontend: Formulário de novo contato
- [ ] Frontend: Modal de importação
- [ ] Frontend: Exportar para Excel

---

## 📋 FASE 3: Kanban/Pipeline (DIAS 9-11)

### Objetivo
Pipeline visual com drag-and-drop de contatos.

### ✅ Checklist da Fase 3

- [ ] Backend: CRUD de colunas
- [ ] Backend: Mover contato entre colunas
- [ ] Backend: Estatísticas por coluna
- [ ] Frontend: Board com React DnD
- [ ] Frontend: Drag & drop funcionando
- [ ] Frontend: Criar/editar colunas

---

## ⚡ FASE 4: Flow Builder (DIAS 12-16)

### Objetivo
Automações com drag-and-drop e execução assíncrona.

### ✅ Checklist da Fase 4

- [ ] Backend: CRUD de flows
- [ ] Backend: Sistema de execução
- [ ] Backend: Workers BullMQ
- [ ] Frontend: Canvas drag-and-drop (React Flow)
- [ ] Frontend: Painel de configuração
- [ ] Frontend: Salvar/carregar flows

---

## 💬 FASE 5: Mensagens e Integrações (DIAS 17-20)

### Objetivo
Envio de mensagens via WhatsApp e Email.

### ✅ Checklist da Fase 5

- [ ] Backend: Integração WhatsApp Business API
- [ ] Backend: Integração Resend (Email)
- [ ] Backend: Worker de mensagens
- [ ] Backend: Webhook WhatsApp
- [ ] Frontend: Configurar integrações
- [ ] Frontend: Histórico de mensagens

---

## 📱 FASE 6: Campanhas (DIAS 21-23)

### Objetivo
Disparos em massa e posts sociais agendados.

### ✅ Checklist da Fase 6

- [ ] Backend: CRUD de campanhas
- [ ] Backend: Segmentação por tags
- [ ] Backend: Worker de campanhas
- [ ] Backend: Instagram Graph API
- [ ] Frontend: Criar campanha
- [ ] Frontend: Agendar posts

---

## 🎂 FASE 7: Aniversários (DIAS 24-25)

### Objetivo
Automação de mensagens de aniversário.

### ✅ Checklist da Fase 7

- [ ] Backend: Cron job diário
- [ ] Backend: Worker de aniversários
- [ ] Frontend: Configurar template
- [ ] Frontend: Lista de aniversariantes

---

## 🚀 FASE 8: Deploy e Produção (DIAS 26-28)

### Objetivo
Deploy do MVP em produção.

### ✅ Checklist da Fase 8

- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Railway)
- [ ] Configurar domínio
- [ ] SSL (HTTPS)
- [ ] Variáveis de ambiente
- [ ] Monitoramento (Sentry)
- [ ] Testes finais

---

## 📝 Próximos Passos

**AGORA**: Vou criar todos os arquivos de configuração iniciais para você começar a desenvolver!

Quer que eu:
1. ✅ Crie TODOS os arquivos da Fase 0 (setup inicial)?
2. ✅ Crie a estrutura completa de pastas?
3. ✅ Configure package.json, tsconfig, etc?

**Basta confirmar e eu gero tudo! 🚀**
