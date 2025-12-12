# 🔴 Redis - Estrutura de Cache e Filas

## 📋 Visão Geral

Redis será usado para 3 propósitos principais:
1. **Cache** - Dados acessados frequentemente
2. **Filas** - Processamento assíncrono de mensagens (BullMQ)
3. **Rate Limiting** - Controle de taxa de requisições

---

## 🎯 1. Sistema de Filas (BullMQ)

### Filas Principais

```typescript
// apps/api/src/jobs/queues/index.ts

import { Queue } from 'bullmq';
import { redisConnection } from '@/lib/redis';

// 1️⃣ Fila de Mensagens
export const messageQueue = new Queue('messages', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      count: 100, // Manter últimos 100 jobs completos
      age: 24 * 3600, // Remover após 24h
    },
    removeOnFail: {
      count: 500, // Manter últimos 500 falhados para debug
    },
  },
});

// 2️⃣ Fila de Flows
export const flowQueue = new Queue('flows', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 5000,
    },
  },
});

// 3️⃣ Fila de Aniversários (CRON)
export const birthdayQueue = new Queue('birthdays', {
  connection: redisConnection,
});

// 4️⃣ Fila de Posts Sociais
export const socialPostQueue = new Queue('social-posts', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
  },
});

// 5️⃣ Fila de Emails
export const emailQueue = new Queue('emails', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});
```

### Estrutura de Jobs

#### 1. Message Job

```typescript
// Estrutura do job de mensagem
interface MessageJob {
  id: string;
  organizationId: string;
  contactId: string;
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS' | 'INSTAGRAM_DM';
  content: string;
  mediaUrl?: string;
  scheduledFor?: string; // ISO date
  campaignId?: string;
  flowExecutionId?: string;
}

// Exemplo de uso
await messageQueue.add('send-message', {
  id: 'msg_123',
  organizationId: 'org_abc',
  contactId: 'contact_xyz',
  channel: 'WHATSAPP',
  content: 'Olá {{nome}}! Bem-vindo ao Zyva!',
});
```

#### 2. Flow Execution Job

```typescript
interface FlowExecutionJob {
  flowId: string;
  contactId: string;
  triggerType: 'MANUAL' | 'TAG_ADDED' | 'BIRTHDAY' | 'WEBHOOK';
  triggerData?: Record<string, any>;
}

await flowQueue.add('execute-flow', {
  flowId: 'flow_123',
  contactId: 'contact_xyz',
  triggerType: 'TAG_ADDED',
  triggerData: { tagId: 'tag_vip' },
});
```

#### 3. Birthday Check Job (CRON)

```typescript
interface BirthdayCheckJob {
  date: string; // YYYY-MM-DD
}

// Agendado diariamente às 9h
await birthdayQueue.add(
  'check-birthdays',
  { date: '2025-01-15' },
  {
    repeat: {
      pattern: '0 9 * * *', // Cron: todo dia às 9h
    },
  }
);
```

#### 4. Social Post Job

```typescript
interface SocialPostJob {
  campaignId: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TWITTER';
  content: string;
  imageUrl?: string;
  scheduledFor: string;
}

await socialPostQueue.add('publish-post', {
  campaignId: 'camp_123',
  platform: 'INSTAGRAM',
  content: 'Nova coleção chegou! 🔥',
  imageUrl: 'https://...',
  scheduledFor: '2025-01-20T18:00:00Z',
});
```

### Workers (Processadores)

```typescript
// apps/api/src/jobs/workers/message.worker.ts

import { Worker } from 'bullmq';
import { redisConnection } from '@/lib/redis';
import { WhatsAppService } from '@/integrations/whatsapp/whatsapp.service';
import { EmailService } from '@/integrations/email/email.service';
import { prisma } from '@/lib/prisma';

export const messageWorker = new Worker(
  'messages',
  async (job) => {
    const { id, organizationId, contactId, channel, content, mediaUrl } = job.data;

    console.log(`📤 Processando mensagem ${id} para ${contactId} via ${channel}`);

    // 1. Buscar contato
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      throw new Error(`Contato ${contactId} não encontrado`);
    }

    // 2. Personalizar conteúdo
    let personalizedContent = content;
    personalizedContent = personalizedContent.replace(/{{nome}}/g, contact.name);
    personalizedContent = personalizedContent.replace(/{{email}}/g, contact.email || '');

    // 3. Enviar por canal
    let result;
    switch (channel) {
      case 'WHATSAPP':
        const whatsapp = new WhatsAppService(
          process.env.WHATSAPP_PHONE_ID!,
          process.env.WHATSAPP_TOKEN!
        );
        result = await whatsapp.sendTextMessage(contact.phone!, personalizedContent);
        break;

      case 'EMAIL':
        const email = new EmailService(process.env.RESEND_API_KEY!);
        result = await email.sendEmail(
          contact.email!,
          'Mensagem Zyva',
          personalizedContent
        );
        break;

      default:
        throw new Error(`Canal ${channel} não suportado`);
    }

    // 4. Atualizar status no banco
    await prisma.message.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        externalId: result.messageId,
      },
    });

    // 5. Atualizar estatísticas da organização
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        messagesThisMonth: { increment: 1 },
      },
    });

    console.log(`✅ Mensagem ${id} enviada com sucesso!`);
    return { success: true, externalId: result.messageId };
  },
  {
    connection: redisConnection,
    concurrency: 5, // Processar 5 mensagens simultâneas
  }
);

// Eventos do worker
messageWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completado!`);
});

messageWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} falhou:`, err.message);

  // Atualizar mensagem como falhada
  if (job?.data?.id) {
    prisma.message.update({
      where: { id: job.data.id },
      data: {
        status: 'FAILED',
        failedAt: new Date(),
        errorMessage: err.message,
      },
    });
  }
});

messageWorker.on('progress', (job, progress) => {
  console.log(`⏳ Job ${job.id} progresso: ${progress}%`);
});
```

---

## 💾 2. Sistema de Cache

### Estrutura de Keys

```
zyva:cache:{resource}:{id}:{field?}
```

### Caches Principais

#### 1. Cache de Usuário

```typescript
// Chave: zyva:cache:user:{userId}
// TTL: 1 hora
// Valor: JSON do usuário

interface CachedUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'LOJA';
  organizationId?: string;
  plan?: string;
}

// Exemplo
await redis.setex(
  `zyva:cache:user:${userId}`,
  3600, // 1 hora
  JSON.stringify(user)
);

// Recuperar
const cached = await redis.get(`zyva:cache:user:${userId}`);
const user = cached ? JSON.parse(cached) : null;
```

#### 2. Cache de Organização

```typescript
// Chave: zyva:cache:org:{organizationId}
// TTL: 30 minutos

interface CachedOrganization {
  id: string;
  name: string;
  plan: string;
  maxContacts: number;
  currentContacts: number;
  maxMessagesPerMonth: number;
  messagesThisMonth: number;
}

await redis.setex(
  `zyva:cache:org:${organizationId}`,
  1800,
  JSON.stringify(organization)
);
```

#### 3. Cache de Estatísticas do Dashboard

```typescript
// Chave: zyva:cache:stats:{organizationId}:dashboard
// TTL: 5 minutos

interface DashboardStats {
  totalContacts: number;
  totalFlows: number;
  activeFlows: number;
  messagesThisMonth: number;
  conversionRate: number;
  recentActivity: Array<{ date: string; count: number }>;
}

await redis.setex(
  `zyva:cache:stats:${organizationId}:dashboard`,
  300, // 5 minutos
  JSON.stringify(stats)
);
```

#### 4. Cache de Limites de Plano (Rate Check)

```typescript
// Chave: zyva:limits:{organizationId}:{resource}
// TTL: Até fim do mês

// Exemplo: Contagem de mensagens do mês
const key = `zyva:limits:${organizationId}:messages`;
const count = await redis.incr(key);

// Definir expiração até fim do mês
const endOfMonth = new Date();
endOfMonth.setMonth(endOfMonth.getMonth() + 1, 1);
endOfMonth.setHours(0, 0, 0, 0);
const ttl = Math.floor((endOfMonth.getTime() - Date.now()) / 1000);

await redis.expire(key, ttl);

// Verificar se excedeu
if (count > organization.maxMessagesPerMonth) {
  throw new Error('Limite de mensagens excedido');
}
```

### Helper de Cache

```typescript
// apps/api/src/lib/cache.ts

import { redis } from './redis';

export class CacheService {
  private prefix = 'zyva:cache';

  /**
   * Busca no cache ou executa função
   */
  async getOrSet<T>(
    key: string,
    ttl: number,
    fn: () => Promise<T>
  ): Promise<T> {
    const fullKey = `${this.prefix}:${key}`;

    // Tentar buscar do cache
    const cached = await redis.get(fullKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Executar função
    const data = await fn();

    // Salvar no cache
    await redis.setex(fullKey, ttl, JSON.stringify(data));

    return data;
  }

  /**
   * Invalida cache por padrão
   */
  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(`${this.prefix}:${pattern}`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  /**
   * Invalida cache de uma organização
   */
  async invalidateOrganization(organizationId: string): Promise<void> {
    await this.invalidate(`org:${organizationId}*`);
    await this.invalidate(`stats:${organizationId}*`);
  }
}

export const cache = new CacheService();
```

### Uso no Controller

```typescript
// apps/api/src/modules/contacts/contacts.controller.ts

import { cache } from '@/lib/cache';

export async function listContacts(req, reply) {
  const { organizationId } = req.user;

  // Buscar do cache ou banco
  const contacts = await cache.getOrSet(
    `contacts:${organizationId}`,
    300, // 5 minutos
    async () => {
      return prisma.contact.findMany({
        where: { organizationId },
        include: { tags: true },
      });
    }
  );

  return reply.send(contacts);
}

export async function createContact(req, reply) {
  const { organizationId } = req.user;
  const contact = await prisma.contact.create({
    data: { ...req.body, organizationId },
  });

  // Invalidar cache
  await cache.invalidate(`contacts:${organizationId}`);

  return reply.send(contact);
}
```

---

## 🚦 3. Rate Limiting

### Implementação

```typescript
// apps/api/src/middlewares/rateLimit.middleware.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { redis } from '@/lib/redis';

interface RateLimitOptions {
  max: number;      // Máximo de requisições
  window: number;   // Janela de tempo (segundos)
}

export function rateLimit(options: RateLimitOptions) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { max, window } = options;
    const userId = req.user?.id || req.ip;

    const key = `zyva:ratelimit:${userId}`;

    // Incrementar contador
    const current = await redis.incr(key);

    // Definir expiração na primeira requisição
    if (current === 1) {
      await redis.expire(key, window);
    }

    // Verificar limite
    if (current > max) {
      return reply.status(429).send({
        error: 'Too Many Requests',
        message: `Você excedeu o limite de ${max} requisições por ${window} segundos`,
        retryAfter: await redis.ttl(key),
      });
    }

    // Adicionar headers
    reply.header('X-RateLimit-Limit', max);
    reply.header('X-RateLimit-Remaining', Math.max(0, max - current));
    reply.header('X-RateLimit-Reset', Date.now() + (await redis.ttl(key)) * 1000);
  };
}

// Uso nas rotas
fastify.get('/api/contacts', {
  preHandler: rateLimit({ max: 100, window: 60 }), // 100 req/min
}, listContacts);
```

### Rate Limiting por Plano

```typescript
// apps/api/src/middlewares/planRateLimit.middleware.ts

const PLAN_LIMITS = {
  FREE: { max: 10, window: 60 },        // 10 req/min
  PRO: { max: 100, window: 60 },        // 100 req/min
  BUSINESS: { max: 1000, window: 60 },  // 1000 req/min
  ENTERPRISE: { max: 10000, window: 60 }, // 10k req/min
};

export async function planRateLimit(req: FastifyRequest, reply: FastifyReply) {
  const user = req.user!;
  const plan = user.plan || 'FREE';

  const limits = PLAN_LIMITS[plan];
  const key = `zyva:ratelimit:plan:${user.id}`;

  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, limits.window);

  if (current > limits.max) {
    return reply.status(429).send({
      error: 'Plan Limit Exceeded',
      message: `Seu plano ${plan} permite ${limits.max} requisições por minuto. Faça upgrade para aumentar.`,
    });
  }
}
```

---

## 📊 4. Sessões e Tokens

### Sessões de Usuário

```typescript
// Chave: zyva:session:{sessionId}
// TTL: 7 dias

interface Session {
  userId: string;
  role: string;
  organizationId?: string;
  createdAt: number;
  lastActivity: number;
}

// Criar sessão
const sessionId = crypto.randomUUID();
await redis.setex(
  `zyva:session:${sessionId}`,
  7 * 24 * 3600, // 7 dias
  JSON.stringify(session)
);

// Refresh last activity
await redis.expire(`zyva:session:${sessionId}`, 7 * 24 * 3600);
```

### Tokens de Verificação

```typescript
// Chave: zyva:token:email:{token}
// TTL: 1 hora

const token = crypto.randomBytes(32).toString('hex');
await redis.setex(
  `zyva:token:email:${token}`,
  3600,
  userId
);

// Verificar
const userId = await redis.get(`zyva:token:email:${token}`);
if (userId) {
  await redis.del(`zyva:token:email:${token}`);
  // Token válido, prosseguir
}
```

---

## 🔧 5. Configuração do Redis

### Conexão

```typescript
// apps/api/src/lib/redis.ts

import Redis from 'ioredis';

// Cliente principal
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // Para BullMQ
  enableReadyCheck: false,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Conexão para BullMQ (separada)
export const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Health check
redis.on('connect', () => {
  console.log('✅ Redis conectado!');
});

redis.on('error', (err) => {
  console.error('❌ Erro no Redis:', err);
});
```

### Variáveis de Ambiente

```bash
# .env
REDIS_URL=redis://localhost:6379

# Produção (Upstash ou Redis Cloud)
REDIS_URL=rediss://:password@redis-12345.upstash.io:6379
```

---

## 📈 6. Monitoramento

### Bull Board (Dashboard Visual)

```typescript
// apps/api/src/server.ts

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { FastifyAdapter } from '@bull-board/fastify';

import {
  messageQueue,
  flowQueue,
  birthdayQueue,
  socialPostQueue,
  emailQueue,
} from './jobs/queues';

const serverAdapter = new FastifyAdapter();

createBullBoard({
  queues: [
    new BullMQAdapter(messageQueue),
    new BullMQAdapter(flowQueue),
    new BullMQAdapter(birthdayQueue),
    new BullMQAdapter(socialPostQueue),
    new BullMQAdapter(emailQueue),
  ],
  serverAdapter,
});

serverAdapter.setBasePath('/admin/queues');
fastify.register(serverAdapter.registerPlugin(), {
  prefix: '/admin/queues',
  // Proteger com middleware admin
});

// Acesse em: http://localhost:3001/admin/queues
```

### Métricas de Cache

```typescript
// Endpoint para métricas
fastify.get('/api/admin/redis/stats', async (req, reply) => {
  const info = await redis.info('stats');
  const memory = await redis.info('memory');
  const clients = await redis.info('clients');

  return {
    stats: parseRedisInfo(info),
    memory: parseRedisInfo(memory),
    clients: parseRedisInfo(clients),
  };
});

function parseRedisInfo(info: string) {
  return info
    .split('\r\n')
    .filter((line) => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const [key, value] = line.split(':');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
}
```

---

## 🎯 Resumo da Estrutura Redis

```
zyva:
├── cache:                    # Cache de dados
│   ├── user:{userId}
│   ├── org:{orgId}
│   ├── stats:{orgId}:dashboard
│   └── contacts:{orgId}
│
├── limits:                   # Rate limiting de plano
│   └── {orgId}:{resource}
│
├── ratelimit:                # Rate limiting de API
│   ├── {userId}
│   └── plan:{userId}
│
├── session:{sessionId}       # Sessões
│
├── token:                    # Tokens temporários
│   ├── email:{token}
│   └── reset:{token}
│
└── bull:{queueName}:         # BullMQ (automático)
    ├── messages
    ├── flows
    ├── birthdays
    ├── social-posts
    └── emails
```

---

**Próximo**: Implementar workers e integrar com API! 🚀
