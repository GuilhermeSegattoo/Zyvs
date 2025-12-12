# 🏗️ Zyva - Arquitetura Técnica Completa

## 📋 Índice
1. [Visão Geral da Arquitetura](#visão-geral)
2. [Stack Tecnológica Recomendada](#stack-tecnológica)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Banco de Dados](#banco-de-dados)
5. [Integrações com APIs Externas](#integrações)
6. [Infraestrutura e Custos](#infraestrutura)
7. [Guia Passo a Passo de Implementação](#guia-implementação)

---

## 🎯 Visão Geral da Arquitetura

### Arquitetura Recomendada: **Monorepo com API REST**

```
┌─────────────────────────────────────────────────────────┐
│                     USUÁRIO                             │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              FRONTEND (Next.js 15)                      │
│  • Server Components (SSR)                              │
│  • Client Components (Interatividade)                   │
│  • App Router                                           │
│  • Tailwind CSS v4                                      │
└─────────────────────────────────────────────────────────┘
                          │
                   (REST API / tRPC)
                          ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND API (Node.js)                      │
│  • Express.js ou Fastify                                │
│  • TypeScript                                           │
│  • Autenticação JWT                                     │
│  • Rate Limiting                                        │
│  • Queue System (BullMQ)                                │
└─────────────────────────────────────────────────────────┘
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │PostgreSQL│   │  Redis   │   │  S3/R2   │
    │(Primário)│   │ (Cache + │   │(Uploads) │
    │          │   │  Queue)  │   │          │
    └──────────┘   └──────────┘   └──────────┘
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │WhatsApp  │   │Instagram │   │  Email   │
    │Business  │   │Graph API │   │(Resend/  │
    │   API    │   │          │   │SendGrid) │
    └──────────┘   └──────────┘   └──────────┘
```

### Por que essa arquitetura?

✅ **Separação clara**: Frontend e Backend independentes
✅ **Escalabilidade**: Cada parte pode escalar separadamente
✅ **Manutenibilidade**: Código organizado e testável
✅ **Performance**: Next.js com SSR + API otimizada
✅ **Queue System**: Mensagens enviadas de forma assíncrona (não bloqueia)

---

## 🛠️ Stack Tecnológica Recomendada

### Frontend

| Tecnologia | Versão | Por que usar? |
|------------|--------|---------------|
| **Next.js** | 15.x | SSR, App Router, Otimização automática, Deploy fácil |
| **React** | 19.x | Biblioteca mais popular, ecossistema maduro |
| **TypeScript** | 5.x | Tipagem forte, menos bugs, melhor DX |
| **Tailwind CSS** | 4.x | Estilização rápida, consistente, otimizado |
| **Shadcn/UI** | Latest | Componentes prontos, acessíveis, customizáveis |
| **Tanstack Query** | 5.x | Cache inteligente, sincronização de estado servidor |
| **Zustand** | 4.x | Estado global leve (alternativa ao Redux) |
| **React Hook Form** | 7.x | Formulários performáticos |
| **Zod** | 3.x | Validação de schemas |

### Backend

| Tecnologia | Versão | Por que usar? |
|------------|--------|---------------|
| **Node.js** | 20.x LTS | Runtime estável, performance excelente |
| **Fastify** | 5.x | Mais rápido que Express, TypeScript nativo |
| **TypeScript** | 5.x | Consistência com frontend |
| **Prisma** | 6.x | ORM moderno, type-safe, migrations fáceis |
| **BullMQ** | 5.x | Filas robustas com Redis |
| **Zod** | 3.x | Validação compartilhada com frontend |
| **JWT** | 9.x | Autenticação stateless |

### Banco de Dados

| Tecnologia | Por que usar? |
|------------|---------------|
| **PostgreSQL 16** | ACID, relacionamentos complexos, JSON support, gratuito |
| **Redis 7** | Cache de sessões, filas de mensagens, rate limiting |

### DevOps & Infraestrutura

| Tecnologia | Por que usar? |
|------------|---------------|
| **Docker** | Containerização, ambiente consistente |
| **GitHub Actions** | CI/CD gratuito |
| **Vercel** | Deploy frontend (gratuito com limites) |
| **Railway/Render** | Deploy backend + DB (plano gratuito disponível) |

---

## 📁 Estrutura de Pastas Completa

```
zyva/
├── README.md
├── docker-compose.yml          # Ambiente de dev completo
├── .github/
│   └── workflows/
│       ├── frontend.yml        # CI/CD do frontend
│       └── backend.yml         # CI/CD do backend
│
├── packages/                   # Código compartilhado
│   ├── shared/
│   │   ├── src/
│   │   │   ├── types/         # Types compartilhados
│   │   │   ├── schemas/       # Schemas Zod
│   │   │   └── utils/         # Funções utilitárias
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── config/                 # Configurações ESLint, Prettier
│
├── apps/
│   ├── web/                    # FRONTEND (Next.js)
│   │   ├── src/
│   │   │   ├── app/           # App Router
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── page.tsx           # Dashboard
│   │   │   │   │   ├── contacts/
│   │   │   │   │   ├── automations/
│   │   │   │   │   ├── pipeline/
│   │   │   │   │   ├── campaigns/
│   │   │   │   │   └── birthdays/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx               # Landing page
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── ui/                    # Shadcn components
│   │   │   │   ├── dashboard/
│   │   │   │   ├── contacts/
│   │   │   │   ├── flow-builder/
│   │   │   │   ├── kanban/
│   │   │   │   ├── campaigns/
│   │   │   │   └── shared/                # Navbar, Sidebar
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   ├── api.ts                 # Cliente API
│   │   │   │   ├── hooks/                 # Custom hooks
│   │   │   │   └── utils.ts
│   │   │   │
│   │   │   ├── stores/                    # Zustand stores
│   │   │   │   ├── auth.ts
│   │   │   │   ├── contacts.ts
│   │   │   │   └── flows.ts
│   │   │   │
│   │   │   └── styles/
│   │   │       └── globals.css
│   │   │
│   │   ├── public/
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── api/                    # BACKEND (Node.js/Fastify)
│       ├── src/
│       │   ├── server.ts                  # Entry point
│       │   │
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── auth.routes.ts
│       │   │   │   └── auth.schema.ts
│       │   │   │
│       │   │   ├── contacts/
│       │   │   │   ├── contacts.controller.ts
│       │   │   │   ├── contacts.service.ts
│       │   │   │   ├── contacts.routes.ts
│       │   │   │   └── contacts.schema.ts
│       │   │   │
│       │   │   ├── flows/
│       │   │   ├── campaigns/
│       │   │   ├── kanban/
│       │   │   └── birthdays/
│       │   │
│       │   ├── integrations/              # APIs externas
│       │   │   ├── whatsapp/
│       │   │   │   ├── whatsapp.service.ts
│       │   │   │   ├── whatsapp.webhook.ts
│       │   │   │   └── whatsapp.types.ts
│       │   │   │
│       │   │   ├── instagram/
│       │   │   │   ├── instagram.service.ts
│       │   │   │   └── instagram.types.ts
│       │   │   │
│       │   │   └── email/
│       │   │       └── email.service.ts
│       │   │
│       │   ├── jobs/                      # Filas BullMQ
│       │   │   ├── queues/
│       │   │   │   ├── message.queue.ts
│       │   │   │   ├── flow.queue.ts
│       │   │   │   └── birthday.queue.ts
│       │   │   │
│       │   │   └── workers/
│       │   │       ├── message.worker.ts
│       │   │       ├── flow.worker.ts
│       │   │       └── birthday.worker.ts
│       │   │
│       │   ├── middlewares/
│       │   │   ├── auth.middleware.ts
│       │   │   ├── error.middleware.ts
│       │   │   └── rateLimit.middleware.ts
│       │   │
│       │   ├── lib/
│       │   │   ├── prisma.ts              # Cliente Prisma
│       │   │   ├── redis.ts               # Cliente Redis
│       │   │   └── logger.ts              # Winston/Pino
│       │   │
│       │   └── utils/
│       │       ├── jwt.ts
│       │       ├── validators.ts
│       │       └── helpers.ts
│       │
│       ├── prisma/
│       │   ├── schema.prisma              # Schema do banco
│       │   ├── migrations/
│       │   └── seed.ts
│       │
│       ├── tests/
│       │   ├── unit/
│       │   └── integration/
│       │
│       ├── package.json
│       ├── tsconfig.json
│       └── .env.example
│
└── infrastructure/
    ├── docker/
    │   ├── Dockerfile.api
    │   └── Dockerfile.worker
    └── nginx/
        └── nginx.conf
```

---

## 🗄️ Banco de Dados

### PostgreSQL - Schema Completo

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== AUTENTICAÇÃO ====================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // Hash bcrypt
  name          String
  avatar        String?

  // Plano SaaS
  plan          Plan      @default(FREE)
  planExpiry    DateTime?

  // Limites por plano
  maxContacts   Int       @default(100)
  maxFlows      Int       @default(3)
  maxMessages   Int       @default(500) // por mês

  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?

  // Relações
  contacts      Contact[]
  tags          Tag[]
  flows         Flow[]
  campaigns     Campaign[]
  kanbanColumns KanbanColumn[]

  @@index([email])
}

enum Plan {
  FREE
  PRO
  BUSINESS
  ENTERPRISE
}

// ==================== CONTATOS ====================

model Contact {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Dados pessoais
  name          String
  email         String?
  phone         String?
  avatar        String?
  birthday      DateTime?

  // Dados de negócio
  dealValue     Decimal?  @db.Decimal(10, 2)
  status        ContactStatus @default(ACTIVE)

  // Metadados
  customFields  Json?     // Campos personalizados
  notes         String?   @db.Text

  // Relacionamentos
  tags          Tag[]
  kanbanColumn  KanbanColumn? @relation(fields: [columnId], references: [id])
  columnId      String?

  // Histórico
  messages      Message[]
  flowExecutions FlowExecution[]

  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId, email])
  @@index([userId, phone])
  @@index([userId, birthday])
}

enum ContactStatus {
  ACTIVE
  INACTIVE
  ARCHIVED
}

// ==================== TAGS ====================

model Tag {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  name      String
  color     String    // HEX color

  contacts  Contact[]

  createdAt DateTime  @default(now())

  @@unique([userId, name])
  @@index([userId])
}

// ==================== KANBAN ====================

model KanbanColumn {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  name      String
  order     Int       // Ordem de exibição
  color     String?   // Cor personalizada

  contacts  Contact[]

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@unique([userId, order])
  @@index([userId])
}

// ==================== FLOW BUILDER ====================

model Flow {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String
  description String?

  // Configuração do fluxo (JSON)
  nodes       Json      // Array de nós
  edges       Json      // Conexões entre nós

  // Status
  isActive    Boolean   @default(false)

  // Execuções
  executions  FlowExecution[]

  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId, isActive])
}

model FlowExecution {
  id          String    @id @default(cuid())
  flowId      String
  flow        Flow      @relation(fields: [flowId], references: [id], onDelete: Cascade)

  contactId   String
  contact     Contact   @relation(fields: [contactId], references: [id], onDelete: Cascade)

  // Estado atual
  currentNode String?   // ID do nó atual
  status      FlowExecutionStatus @default(RUNNING)

  // Histórico
  executionLog Json     // Log de cada passo

  // Timestamps
  startedAt   DateTime  @default(now())
  completedAt DateTime?

  @@index([flowId, status])
  @@index([contactId])
}

enum FlowExecutionStatus {
  RUNNING
  PAUSED
  COMPLETED
  FAILED
}

// ==================== CAMPANHAS ====================

model Campaign {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Configuração
  name          String
  type          CampaignType
  channel       MessageChannel

  // Conteúdo
  content       String    @db.Text
  mediaUrl      String?   // Imagem/vídeo para posts

  // Segmentação
  targetAll     Boolean   @default(true)
  targetTags    String[]  // IDs de tags

  // Agendamento
  status        CampaignStatus @default(DRAFT)
  scheduledFor  DateTime?

  // Métricas
  totalSent     Int       @default(0)
  totalOpened   Int       @default(0)
  totalClicked  Int       @default(0)

  // Relacionamentos
  messages      Message[]

  // Timestamps
  createdAt     DateTime  @default(now())
  sentAt        DateTime?

  @@index([userId, status])
  @@index([scheduledFor])
}

enum CampaignType {
  MESSAGE      // Mensagem para contatos
  SOCIAL_POST  // Post em rede social
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  SENDING
  SENT
  FAILED
}

// ==================== MENSAGENS ====================

model Message {
  id          String    @id @default(cuid())
  contactId   String
  contact     Contact   @relation(fields: [contactId], references: [id], onDelete: Cascade)

  campaignId  String?
  campaign    Campaign? @relation(fields: [campaignId], references: [id])

  // Conteúdo
  channel     MessageChannel
  content     String    @db.Text
  mediaUrl    String?

  // Status de envio
  status      MessageStatus @default(PENDING)
  error       String?

  // Métricas
  sentAt      DateTime?
  deliveredAt DateTime?
  openedAt    DateTime?
  clickedAt   DateTime?

  // Metadata
  externalId  String?   // ID do provedor (WhatsApp, etc)
  metadata    Json?

  createdAt   DateTime  @default(now())

  @@index([contactId])
  @@index([campaignId])
  @@index([status, sentAt])
}

enum MessageChannel {
  WHATSAPP
  EMAIL
  SMS
  INSTAGRAM_DM
}

enum MessageStatus {
  PENDING
  QUEUED
  SENDING
  SENT
  DELIVERED
  READ
  FAILED
}

// ==================== INTEGRAÇÕES ====================

model Integration {
  id          String    @id @default(cuid())
  userId      String

  // Tipo de integração
  provider    IntegrationProvider

  // Credenciais (encriptadas)
  credentials Json

  // Status
  isActive    Boolean   @default(true)
  lastSync    DateTime?

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([userId, provider])
}

enum IntegrationProvider {
  WHATSAPP_BUSINESS
  INSTAGRAM
  FACEBOOK
  SENDGRID
  RESEND
  TWILIO
}

// ==================== AUTOMAÇÕES DE ANIVERSÁRIO ====================

model BirthdayAutomation {
  id          String    @id @default(cuid())
  userId      String

  // Configuração
  isEnabled   Boolean   @default(true)
  template    String    @db.Text
  channel     MessageChannel
  sendAtHour  Int       @default(9) // Hora do dia (0-23)

  // Estatísticas
  totalSent   Int       @default(0)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([userId])
}
```

### Migrações e Seeds

```typescript
// prisma/seed.ts
import { PrismaClient, Plan } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário de exemplo
  const hashedPassword = await bcrypt.hash('senha123', 10);

  const user = await prisma.user.create({
    data: {
      email: 'demo@zyva.com',
      password: hashedPassword,
      name: 'Demo User',
      plan: Plan.PRO,
      maxContacts: 1000,
      maxFlows: 10,
      maxMessages: 5000,
    },
  });

  // Criar colunas padrão do Kanban
  await prisma.kanbanColumn.createMany({
    data: [
      { userId: user.id, name: 'Novo Lead', order: 0, color: '#818cf8' },
      { userId: user.id, name: 'Em Contato', order: 1, color: '#a855f7' },
      { userId: user.id, name: 'Proposta Enviada', order: 2, color: '#ec4899' },
      { userId: user.id, name: 'Fechado', order: 3, color: '#10b981' },
    ],
  });

  // Criar tags padrão
  await prisma.tag.createMany({
    data: [
      { userId: user.id, name: 'VIP', color: '#fbbf24' },
      { userId: user.id, name: 'Novo Cliente', color: '#10b981' },
      { userId: user.id, name: 'Recorrente', color: '#3b82f6' },
    ],
  });

  console.log('✅ Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 🔌 Integrações com APIs Externas

### 1. WhatsApp Business API

#### Opções de Implementação

| Opção | Custo | Complexidade | Recomendação |
|-------|-------|--------------|--------------|
| **WhatsApp Cloud API (Meta)** | Gratuito até 1.000 conversas/mês | Média | ✅ MELHOR opção |
| **Twilio WhatsApp** | $0.005 por mensagem | Baixa | Para começar rápido |
| **360Dialog** | A partir de €49/mês | Baixa | Empresas médias |

#### Implementação Recomendada: WhatsApp Cloud API

```typescript
// apps/api/src/integrations/whatsapp/whatsapp.service.ts

import axios from 'axios';

export class WhatsAppService {
  private readonly apiUrl = 'https://graph.facebook.com/v18.0';
  private readonly phoneNumberId: string;
  private readonly accessToken: string;

  constructor(phoneNumberId: string, accessToken: string) {
    this.phoneNumberId = phoneNumberId;
    this.accessToken = accessToken;
  }

  /**
   * Envia mensagem de texto
   */
  async sendTextMessage(to: string, message: string) {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''), // Remove caracteres não numéricos
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    };

    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Erro ao enviar WhatsApp:', error.response?.data);
      throw new Error(error.response?.data?.error?.message || 'Erro ao enviar mensagem');
    }
  }

  /**
   * Envia mensagem com template (para evitar bloqueio)
   */
  async sendTemplateMessage(to: string, templateName: string, variables: string[]) {
    const payload = {
      messaging_product: 'whatsapp',
      to: to.replace(/\D/g, ''),
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: 'pt_BR',
        },
        components: [
          {
            type: 'body',
            parameters: variables.map(v => ({ type: 'text', text: v })),
          },
        ],
      },
    };

    const response = await axios.post(
      `${this.apiUrl}/${this.phoneNumberId}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }

  /**
   * Webhook para receber mensagens (respostas dos clientes)
   */
  handleWebhook(body: any) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (value?.messages) {
      const message = value.messages[0];
      return {
        from: message.from,
        text: message.text?.body,
        timestamp: message.timestamp,
        messageId: message.id,
      };
    }

    return null;
  }
}
```

#### Regras Importantes do WhatsApp (para evitar bloqueio):

1. **Janela de 24h**: Só pode enviar mensagens livres dentro de 24h após o cliente te enviar algo
2. **Fora da janela**: Use templates aprovados pela Meta
3. **Rate Limits**:
   - Tier 1: 1.000 conversas/dia
   - Tier 2: 10.000 conversas/dia (após aprovação)
4. **Qualidade**: Taxa de bloqueio < 2% senão sua conta é suspensa

#### Setup Inicial:

```bash
# 1. Criar app no Meta for Developers
https://developers.facebook.com/apps

# 2. Configurar WhatsApp Business API
# 3. Pegar credenciais:
WHATSAPP_PHONE_NUMBER_ID=seu_id
WHATSAPP_ACCESS_TOKEN=seu_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=token_secreto
```

### 2. Instagram Graph API

```typescript
// apps/api/src/integrations/instagram/instagram.service.ts

import axios from 'axios';

export class InstagramService {
  private readonly apiUrl = 'https://graph.facebook.com/v18.0';
  private readonly accessToken: string;
  private readonly instagramAccountId: string;

  constructor(accessToken: string, instagramAccountId: string) {
    this.accessToken = accessToken;
    this.instagramAccountId = instagramAccountId;
  }

  /**
   * Cria post de imagem
   */
  async createImagePost(imageUrl: string, caption: string) {
    // Passo 1: Criar container de mídia
    const containerResponse = await axios.post(
      `${this.apiUrl}/${this.instagramAccountId}/media`,
      {
        image_url: imageUrl,
        caption: caption,
        access_token: this.accessToken,
      }
    );

    const creationId = containerResponse.data.id;

    // Passo 2: Publicar o container
    const publishResponse = await axios.post(
      `${this.apiUrl}/${this.instagramAccountId}/media_publish`,
      {
        creation_id: creationId,
        access_token: this.accessToken,
      }
    );

    return publishResponse.data;
  }

  /**
   * Agenda post (usando scheduler próprio)
   */
  async schedulePost(imageUrl: string, caption: string, scheduledTime: Date) {
    // Instagram API não suporta agendamento direto
    // Você precisará usar BullMQ para agendar
    return {
      scheduledFor: scheduledTime,
      imageUrl,
      caption,
      status: 'scheduled',
    };
  }

  /**
   * Pegar insights do perfil
   */
  async getInsights() {
    const response = await axios.get(
      `${this.apiUrl}/${this.instagramAccountId}/insights`,
      {
        params: {
          metric: 'impressions,reach,follower_count,profile_views',
          period: 'day',
          access_token: this.accessToken,
        },
      }
    );

    return response.data;
  }
}
```

#### Setup Instagram:

```bash
# 1. Conectar Página do Facebook à conta Instagram Business
# 2. Criar app no Facebook for Developers
# 3. Adicionar Instagram Graph API
# 4. Pedir permissões:
#    - instagram_basic
#    - instagram_content_publish
#    - pages_read_engagement

INSTAGRAM_ACCESS_TOKEN=seu_token
INSTAGRAM_ACCOUNT_ID=id_da_conta
```

### 3. Email (Resend - Recomendado)

```typescript
// apps/api/src/integrations/email/email.service.ts

import { Resend } from 'resend';

export class EmailService {
  private resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async sendEmail(to: string, subject: string, html: string) {
    const { data, error } = await this.resend.emails.send({
      from: 'Zyva <noreply@seudominio.com>',
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Template de aniversário
   */
  async sendBirthdayEmail(to: string, name: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #9333ea;">🎉 Feliz Aniversário, ${name}!</h1>
        <p>Desejamos um dia maravilhoso e cheio de alegrias.</p>
        <p>Como presente especial, você ganhou <strong>15% de desconto</strong>!</p>
        <p>Use o cupom: <strong style="color: #9333ea;">ANIVER15</strong></p>
      </div>
    `;

    return this.sendEmail(to, `Feliz Aniversário, ${name}! 🎂`, html);
  }
}
```

**Custos Resend**:
- Gratuito: 3.000 emails/mês
- Pro: $20/mês = 50.000 emails

---

## 💰 Infraestrutura e Custos

### Opção 1: Ambiente de Desenvolvimento (GRATUITO)

```yaml
# docker-compose.yml

version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: zyva
      POSTGRES_PASSWORD: senha_dev
      POSTGRES_DB: zyva_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

  api:
    build:
      context: ./apps/api
      dockerfile: ../../infrastructure/docker/Dockerfile.api
    ports:
      - '3001:3001'
    environment:
      DATABASE_URL: postgresql://zyva:senha_dev@postgres:5432/zyva_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  worker:
    build:
      context: ./apps/api
      dockerfile: ../../infrastructure/docker/Dockerfile.worker
    environment:
      DATABASE_URL: postgresql://zyva:senha_dev@postgres:5432/zyva_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
```

**Custo**: R$ 0/mês

### Opção 2: Produção Inicial (Econômica)

| Serviço | Provedor | Plano | Custo/mês |
|---------|----------|-------|-----------|
| **Frontend** | Vercel | Hobby | R$ 0 |
| **Backend API** | Railway | Starter | $5 (R$ 25) |
| **PostgreSQL** | Railway (incluído) | 500MB | Incluído |
| **Redis** | Railway | 100MB | Incluído |
| **Storage (uploads)** | Cloudflare R2 | 10GB | R$ 0 |
| **Email** | Resend | Free | R$ 0 (3k/mês) |
| **WhatsApp** | Meta Cloud API | Free | R$ 0 (1k conv/mês) |
| **Domínio** | Registro.br | .com.br | R$ 40/ano |

**TOTAL**: ~R$ 25/mês + R$ 40/ano

### Opção 3: Produção Escalável

| Serviço | Provedor | Plano | Custo/mês |
|---------|----------|-------|-----------|
| **Frontend** | Vercel | Pro | $20 (R$ 100) |
| **Backend** | Railway/Render | Pro | $20 (R$ 100) |
| **PostgreSQL** | Neon.tech | Pro | $19 (R$ 95) |
| **Redis** | Upstash | Pay-as-go | ~$10 (R$ 50) |
| **Storage** | Cloudflare R2 | 50GB | R$ 5 |
| **Email** | Resend | Pro | $20 (R$ 100) |
| **WhatsApp** | Meta | Tier 2 | $0.005/msg |
| **Monitoring** | Sentry | Team | $26 (R$ 130) |

**TOTAL**: ~R$ 580/mês (para 10k usuários)

### Opção 4: Self-Hosted (VPS)

| Serviço | Provedor | Especificações | Custo/mês |
|---------|----------|----------------|-----------|
| **VPS** | Hetzner | 4 vCPU, 8GB RAM, 160GB SSD | €9.50 (R$ 55) |
| **Backup** | Hetzner | 20GB | €3 (R$ 17) |
| **Domínio** | Cloudflare | Grátis | R$ 0 |

**TOTAL**: ~R$ 72/mês

**Setup VPS**:
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clonar repositório
git clone https://github.com/seu-usuario/zyva.git
cd zyva

# Configurar variáveis
cp apps/api/.env.example apps/api/.env
# Editar .env com suas credenciais

# Subir aplicação
docker-compose -f docker-compose.prod.yml up -d

# Configurar Nginx como reverse proxy
# Instalar Certbot para SSL gratuito
```

---

## 📝 Guia Passo a Passo de Implementação

### Fase 1: Setup Inicial (Semana 1)

#### Dia 1-2: Configuração do Ambiente

```bash
# 1. Criar estrutura do projeto
mkdir zyva && cd zyva
git init

# 2. Criar monorepo
npm install -g pnpm
pnpm init

# 3. Criar workspaces (package.json na raiz)
{
  "name": "zyva",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}

# 4. Criar frontend (Next.js)
cd apps
npx create-next-app@latest web --typescript --tailwind --app
cd web
pnpm add @tanstack/react-query zustand react-hook-form zod @hookform/resolvers
pnpm add -D @types/node

# 5. Criar backend (Fastify)
mkdir api && cd api
pnpm init
pnpm add fastify @fastify/cors @fastify/jwt @fastify/helmet
pnpm add prisma @prisma/client bcryptjs
pnpm add bullmq ioredis
pnpm add zod
pnpm add -D @types/node @types/bcryptjs tsx nodemon

# 6. Inicializar Prisma
npx prisma init
# Copiar schema fornecido acima
npx prisma generate
npx prisma migrate dev --name init

# 7. Docker para desenvolvimento
# Copiar docker-compose.yml fornecido acima
docker-compose up -d
```

#### Dia 3-4: Autenticação

**Backend**:
```typescript
// apps/api/src/modules/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { FastifyRequest } from 'fastify';

export async function register(email: string, password: string, name: string) {
  // Verificar se usuário existe
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error('Email já cadastrado');

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      plan: 'FREE',
    },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
    },
  });

  return user;
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Credenciais inválidas');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Credenciais inválidas');

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
  };
}
```

**Frontend**:
```typescript
// apps/web/src/stores/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const response = await fetch('http://localhost:3001/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        set({ user: data.user, token: data.token });
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

#### Dia 5-7: CRUD de Contatos

**Backend**:
```typescript
// apps/api/src/modules/contacts/contacts.service.ts
import { prisma } from '../../lib/prisma';

export async function createContact(userId: string, data: {
  name: string;
  email?: string;
  phone?: string;
  birthday?: Date;
}) {
  return prisma.contact.create({
    data: {
      userId,
      ...data,
      status: 'ACTIVE',
    },
    include: {
      tags: true,
    },
  });
}

export async function listContacts(userId: string, filters?: {
  search?: string;
  tagIds?: string[];
}) {
  return prisma.contact.findMany({
    where: {
      userId,
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
          { phone: { contains: filters.search } },
        ],
      }),
      ...(filters?.tagIds && {
        tags: {
          some: {
            id: { in: filters.tagIds },
          },
        },
      }),
    },
    include: {
      tags: true,
      kanbanColumn: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function importContactsFromCSV(userId: string, csvData: any[]) {
  // Processar CSV em lote
  const contacts = await prisma.contact.createMany({
    data: csvData.map(row => ({
      userId,
      name: row.name,
      email: row.email,
      phone: row.phone,
      birthday: row.birthday ? new Date(row.birthday) : null,
    })),
    skipDuplicates: true,
  });

  return contacts;
}
```

**Frontend**:
```typescript
// apps/web/src/app/(dashboard)/contacts/page.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ContactCard } from '@/components/contacts/ContactCard';
import { NewContactModal } from '@/components/contacts/NewContactModal';

export default function ContactsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const res = await fetch('/api/contacts');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newContact: any) => {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsModalOpen(false);
    },
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contatos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          + Novo Contato
        </button>
      </div>

      <div className="grid gap-4">
        {contacts?.map((contact: any) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>

      <NewContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createMutation.mutate}
      />
    </div>
  );
}
```

### Fase 2: Funcionalidades Core (Semana 2-3)

#### Sistema de Filas (BullMQ)

```typescript
// apps/api/src/jobs/queues/message.queue.ts
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

export const messageQueue = new Queue('messages', { connection });

// Adicionar mensagem na fila
export async function queueMessage(data: {
  contactId: string;
  channel: string;
  content: string;
}) {
  return messageQueue.add('send-message', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
}
```

```typescript
// apps/api/src/jobs/workers/message.worker.ts
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { WhatsAppService } from '../../integrations/whatsapp/whatsapp.service';
import { EmailService } from '../../integrations/email/email.service';
import { prisma } from '../../lib/prisma';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'messages',
  async (job) => {
    const { contactId, channel, content } = job.data;

    // Buscar contato
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) throw new Error('Contato não encontrado');

    let result;

    // Enviar por canal
    switch (channel) {
      case 'WHATSAPP':
        const whatsapp = new WhatsAppService(
          process.env.WHATSAPP_PHONE_ID!,
          process.env.WHATSAPP_TOKEN!
        );
        result = await whatsapp.sendTextMessage(contact.phone!, content);
        break;

      case 'EMAIL':
        const email = new EmailService(process.env.RESEND_API_KEY!);
        result = await email.sendEmail(contact.email!, 'Mensagem Zyva', content);
        break;

      default:
        throw new Error('Canal não suportado');
    }

    // Salvar no banco
    await prisma.message.create({
      data: {
        contactId,
        channel,
        content,
        status: 'SENT',
        sentAt: new Date(),
        externalId: result.messageId,
      },
    });

    return result;
  },
  {
    connection,
    concurrency: 5, // Processar 5 mensagens simultâneas
  }
);

worker.on('completed', (job) => {
  console.log(`✅ Mensagem ${job.id} enviada com sucesso`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Erro ao enviar mensagem ${job?.id}:`, err);
});
```

#### Flow Builder com Execução

```typescript
// apps/api/src/modules/flows/flow.executor.ts
import { prisma } from '../../lib/prisma';
import { queueMessage } from '../../jobs/queues/message.queue';

export async function executeFlow(flowId: string, contactId: string) {
  const flow = await prisma.flow.findUnique({
    where: { id: flowId },
  });

  if (!flow || !flow.isActive) return;

  // Criar execução
  const execution = await prisma.flowExecution.create({
    data: {
      flowId,
      contactId,
      status: 'RUNNING',
      executionLog: { steps: [] },
    },
  });

  // Processar nós
  const nodes = flow.nodes as any[];

  for (const node of nodes) {
    await processNode(node, contactId, execution.id);
  }

  // Marcar como completo
  await prisma.flowExecution.update({
    where: { id: execution.id },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });
}

async function processNode(node: any, contactId: string, executionId: string) {
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    include: { tags: true },
  });

  switch (node.type) {
    case 'trigger':
      // Apenas registra o início
      break;

    case 'message':
      // Personalizar mensagem
      let content = node.config.content;
      content = content.replace('{{nome}}', contact!.name);
      content = content.replace('{{email}}', contact!.email || '');

      // Adicionar na fila
      await queueMessage({
        contactId,
        channel: node.config.channel,
        content,
      });
      break;

    case 'delay':
      // Aguardar tempo
      const delayMs = node.config.value * node.config.unit;
      await new Promise(resolve => setTimeout(resolve, delayMs));
      break;

    case 'condition':
      // Avaliar condição
      const field = node.config.field;
      const operator = node.config.operator;
      const value = node.config.value;

      // Lógica de comparação
      break;

    case 'kanban':
      // Mover para coluna
      const column = await prisma.kanbanColumn.findFirst({
        where: {
          userId: contact!.userId,
          name: node.config.targetColumn,
        },
      });

      if (column) {
        await prisma.contact.update({
          where: { id: contactId },
          data: { columnId: column.id },
        });
      }
      break;
  }

  // Registrar no log
  await prisma.flowExecution.update({
    where: { id: executionId },
    data: {
      executionLog: {
        steps: [
          ...(execution.executionLog as any).steps,
          {
            nodeId: node.id,
            type: node.type,
            executedAt: new Date(),
            success: true,
          },
        ],
      },
    },
  });
}
```

### Fase 3: Integrações (Semana 4)

#### Webhook do WhatsApp

```typescript
// apps/api/src/integrations/whatsapp/whatsapp.webhook.ts
import { FastifyRequest, FastifyReply } from 'fastify';

export async function verifyWebhook(request: FastifyRequest, reply: FastifyReply) {
  const mode = request.query['hub.mode'];
  const token = request.query['hub.verify_token'];
  const challenge = request.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return reply.send(challenge);
  }

  return reply.code(403).send('Forbidden');
}

export async function handleWebhook(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;

  // Processar mensagem recebida
  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;

  if (value?.messages) {
    const message = value.messages[0];

    // Buscar contato pelo telefone
    const contact = await prisma.contact.findFirst({
      where: { phone: message.from },
    });

    if (contact) {
      // Salvar mensagem recebida
      await prisma.message.create({
        data: {
          contactId: contact.id,
          channel: 'WHATSAPP',
          content: message.text?.body || '',
          status: 'DELIVERED',
          externalId: message.id,
        },
      });

      // Aqui você pode implementar lógica de resposta automática
    }
  }

  return reply.send({ success: true });
}
```

### Fase 4: Automação de Aniversários (Semana 5)

```typescript
// apps/api/src/jobs/workers/birthday.worker.ts
import { CronJob } from 'cron';
import { prisma } from '../../lib/prisma';
import { queueMessage } from '../queues/message.queue';

// Rodar todo dia às 9h
export const birthdayJob = new CronJob('0 9 * * *', async () => {
  console.log('🎂 Verificando aniversariantes...');

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  // Buscar contatos com aniversário hoje
  const contacts = await prisma.$queryRaw`
    SELECT c.*, u.id as "userId"
    FROM "Contact" c
    JOIN "User" u ON c."userId" = u.id
    WHERE EXTRACT(MONTH FROM c.birthday) = ${todayMonth}
      AND EXTRACT(DAY FROM c.birthday) = ${todayDay}
      AND c.status = 'ACTIVE'
  `;

  for (const contact of contacts as any[]) {
    // Buscar configuração de aniversário do usuário
    const config = await prisma.birthdayAutomation.findUnique({
      where: { userId: contact.userId },
    });

    if (config && config.isEnabled) {
      // Personalizar template
      let content = config.template;
      content = content.replace('{{nome}}', contact.name);

      // Adicionar na fila
      await queueMessage({
        contactId: contact.id,
        channel: config.channel,
        content,
      });

      console.log(`✅ Mensagem de aniversário agendada para ${contact.name}`);
    }
  }
});

// Iniciar job
birthdayJob.start();
```

---

## 🚀 Próximos Passos

### Checklist de Implementação

- [ ] Setup inicial do projeto
- [ ] Configurar Docker para desenvolvimento
- [ ] Implementar autenticação (JWT)
- [ ] CRUD de contatos com importação CSV
- [ ] Sistema de tags customizáveis
- [ ] Kanban com drag-and-drop
- [ ] Flow Builder (UI)
- [ ] Sistema de filas (BullMQ)
- [ ] Integração WhatsApp Business API
- [ ] Integração Instagram Graph API
- [ ] Integração de Email (Resend)
- [ ] Worker de mensagens
- [ ] Execução de flows
- [ ] Automação de aniversários (cron job)
- [ ] Dashboard com métricas
- [ ] Sistema de campanhas
- [ ] Testes automatizados
- [ ] Deploy em produção
- [ ] Monitoramento (Sentry)
- [ ] Documentação de API

---

## 📚 Recursos Adicionais

### Documentações Oficiais
- [Next.js 15](https://nextjs.org/docs)
- [Fastify](https://fastify.dev/)
- [Prisma](https://www.prisma.io/docs)
- [BullMQ](https://docs.bullmq.io/)
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Resend](https://resend.com/docs)

### Ferramentas Recomendadas
- **VS Code**: IDE
- **Docker Desktop**: Containers
- **Postman**: Testar API
- **DBeaver**: Gerenciar PostgreSQL
- **RedisInsight**: Visualizar Redis

---

**Criado para o projeto Zyva - Automação de Relacionamento com Clientes**
