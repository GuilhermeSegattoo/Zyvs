# 📊 Thumdra - Resumo de Decisões Técnicas

## ✅ O que foi definido e documentado

### 1. Arquitetura Completa
📄 **Arquivo**: [ARQUITETURA_TECNICA.md](ARQUITETURA_TECNICA.md)

- ✅ Frontend: Next.js 15 + React 19 + TypeScript
- ✅ Backend: Fastify + TypeScript + Prisma
- ✅ Banco: PostgreSQL 16
- ✅ Cache/Filas: Redis 7 + BullMQ
- ✅ Custo inicial: **R$ 25/mês** (Railway)

### 2. Rotas e Navegação
📄 **Arquivo**: [ROTAS_E_NAVEGACAO.md](ROTAS_E_NAVEGACAO.md)

- ✅ Fluxo completo: Landing → Checkout → Cadastro → Login → Dashboard
- ✅ **Dock Navigation** estilo macOS (na parte inferior)
- ✅ Sistema de permissões (ADMIN vs LOJA)
- ✅ 5 abas principais: Dashboard, Clientes, Automações, Pipeline, Campanhas
- ✅ Middleware de proteção de rotas

### 3. Schema do Banco de Dados
📄 **Arquivo**: [schema.prisma](schema.prisma)
📄 **Análise**: [ANALISE_SCHEMA.md](ANALISE_SCHEMA.md)

#### Transformação do Schema Supabase

**ANTES**: 19 tabelas complexas
**DEPOIS**: 12 tabelas otimizadas (37% mais simples!)

#### Principais Mudanças

| Mudança | Razão |
|---------|-------|
| ✅ Adicionado `UserRole` (ADMIN/LOJA) | Sistema de permissões |
| ✅ `clients` → `organizations` | Nomenclatura mais clara |
| ✅ Removido `profiles` | Dados movidos para `users` |
| ✅ Removido `contact_tags` | Many-to-many direto |
| ✅ Removido `kanban_cards` | `contacts` tem `columnId` |
| ✅ Removido `message_queue` | Usar BullMQ (Redis) |
| ✅ Adicionado `campaigns` | Mensagens e posts sociais |
| ✅ Adicionado `birthday_automations` | Automação de aniversários |
| ✅ Unificado mensagens | `scheduled_messages` + `message_logs` → `messages` |

#### Tabelas Finais (12)

```
1. users                 - Autenticação, perfis e roles
2. organizations         - Multi-tenancy (lojas)
3. contacts              - CRM de clientes
4. tags                  - Segmentação
5. kanban_columns        - Pipeline de vendas
6. flows                 - Flow builder (automações)
7. flow_executions       - Histórico de execuções
8. campaigns             - Mensagens/Posts sociais
9. messages              - Histórico de mensagens
10. integrations         - APIs externas
11. birthday_automations - Config de aniversários
12. audit_logs           - Auditoria completa
```

### 4. Estrutura Redis
📄 **Arquivo**: [REDIS_STRUCTURE.md](REDIS_STRUCTURE.md)

#### Uso do Redis

```
📦 Cache (TTL variável)
  ├── Usuários (1h)
  ├── Organizações (30min)
  ├── Stats Dashboard (5min)
  └── Listas de contatos (5min)

⚡ Filas (BullMQ)
  ├── messages (envio de mensagens)
  ├── flows (execução de automações)
  ├── birthdays (cron diário às 9h)
  ├── social-posts (publicação social)
  └── emails (envio de emails)

🚦 Rate Limiting
  ├── Por usuário (100 req/min)
  ├── Por plano (FREE: 10, PRO: 100, etc)
  └── Limites de uso mensal
```

---

## 🔐 Sistema de Permissões (RBAC)

### Roles

```prisma
enum UserRole {
  ADMIN  // Gerencia o sistema todo
  LOJA   // Gerencia apenas sua organização
}
```

### Matriz de Acesso

| Recurso | LOJA | ADMIN |
|---------|------|-------|
| **Dashboard próprio** | ✅ | ✅ |
| **Contatos próprios** | ✅ (CRUD completo) | ✅ (ver todos) |
| **Flows próprios** | ✅ (criar/editar) | ✅ (ver todos) |
| **Campanhas** | ✅ (próprias) | ✅ (todas) |
| **Pipeline (Kanban)** | ✅ | ✅ |
| **Tags** | ✅ | ✅ |
| **Integrações** | ✅ (próprias) | ✅ (todas) |
| **Painel Admin** | ❌ | ✅ |
| **Gerenciar usuários** | ❌ | ✅ |
| **Ver estatísticas globais** | ❌ | ✅ |
| **Audit logs** | ❌ | ✅ |

### Implementação

```typescript
// Middleware de autenticação
async function requireAuth(req, reply) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { organization: true },
  });

  req.user = user;
}

// Middleware de autorização
async function requireRole(role: UserRole) {
  return async (req, reply) => {
    if (req.user.role !== role) {
      return reply.status(403).send({ error: 'Forbidden' });
    }
  };
}

// Uso nas rotas
fastify.get('/api/admin/users', {
  preHandler: [requireAuth, requireRole('ADMIN')],
}, listAllUsers);
```

---

## 📱 Funcionalidades Principais

### 1. Dashboard
- Cards de métricas (contatos, mensagens, conversão)
- Gráficos de atividade (últimos 7 meses)
- Flows em execução (tempo real)

### 2. Clientes (CRM)
- ✅ CRUD completo de contatos
- ✅ Importação CSV/Excel
- ✅ Exportação para Excel
- ✅ Sistema de tags customizáveis
- ✅ Busca avançada
- ✅ Campos personalizados (JSON)

### 3. Automações (Flow Builder)
- ✅ Drag-and-drop visual
- ✅ 5 tipos de nós:
  - ⚡ Gatilho (novo contato, tag, aniversário)
  - 💬 Mensagem (WhatsApp/Email/SMS)
  - ⏱️ Delay (aguardar X tempo)
  - 🔀 Condição (if/else)
  - 📋 Mover Kanban (integração!)
- ✅ Execução assíncrona (BullMQ)
- ✅ Log completo de execuções
- ✅ Templates prontos

### 4. Pipeline (Kanban)
- ✅ Colunas customizáveis
- ✅ Drag & drop de cards
- ✅ Valor do negócio por card
- ✅ Tags nos cards
- ✅ Estatísticas por coluna
- ✅ **Integração com Flow Builder** (automação move cards!)

### 5. Campanhas
- ✅ Mensagens em massa (WhatsApp/Email/SMS)
- ✅ Posts sociais (Instagram/Facebook/Twitter)
- ✅ Agendamento futuro
- ✅ Segmentação por tags
- ✅ Vinculação com flows
- ✅ Métricas (enviadas, abertas, clicadas)

### 6. Aniversários
- ✅ Detecção automática (cron diário)
- ✅ Template personalizável
- ✅ Envio automático às 9h
- ✅ Lista de próximos aniversariantes
- ✅ Histórico de envios

### 7. Integrações
- ✅ WhatsApp Business API (gratuito até 1k/mês)
- ✅ Instagram Graph API (posts automáticos)
- ✅ Facebook Graph API
- ✅ Resend (email - 3k grátis/mês)
- ✅ Webhook para receber mensagens

---

## 🎨 Design System

### Dock Navigation (macOS Style)

```
┌──────────────────────────────────────────┐
│        ÁREA DE CONTEÚDO                  │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ 📊  👥  ⚡  📋  📱  │  ⚙️            │
│ Dash Cli Auto Pipe Camp │ Config        │
└──────────────────────────────────────────┘
```

**Características**:
- Fixo na parte inferior
- Backdrop blur + transparência
- Efeito magnético ao hover
- Indicador de aba ativa (bolinha roxa)
- Separador visual
- Animações com Framer Motion

### Paleta de Cores

```scss
// Primárias
--purple-600: #9333ea
--purple-700: #7e22ce
--purple-500: #a855f7

// Secundárias
--blue-600: #3b82f6
--green-600: #10b981
--pink-600: #ec4899
--amber-600: #f59e0b

// Neutras
--gray-50: #fafafa
--gray-100: #f9fafb
--gray-900: #111827
```

---

## 🚀 Integrações Externas

### WhatsApp Business API (Meta)

**Custo**: Gratuito até 1.000 conversas/mês

**Regras importantes**:
- ✅ Janela de 24h para mensagens livres
- ✅ Templates aprovados pela Meta fora da janela
- ✅ Rate limit por tier (Tier 1: 1k/dia)
- ❌ Taxa de bloqueio deve ser < 2%

**Implementação**:
```typescript
const whatsapp = new WhatsAppService(
  process.env.WHATSAPP_PHONE_ID,
  process.env.WHATSAPP_TOKEN
);

await whatsapp.sendTextMessage(
  '+5511999999999',
  'Olá! Sua mensagem aqui'
);
```

### Instagram Graph API

**Funcionalidades**:
- ✅ Publicar posts (imagem + legenda)
- ✅ Agendar posts
- ✅ Insights do perfil

**Limitações**:
- ❌ Instagram não suporta agendamento nativo (usar BullMQ)
- ✅ Precisa de conta Business vinculada a Página do Facebook

### Email (Resend)

**Custo**: 3.000 emails/mês gratuitos

**Vantagens**:
- ✅ Setup super simples
- ✅ Templates em React
- ✅ Rastreamento de abertura/cliques
- ✅ API moderna

---

## 💰 Custos por Fase

### Fase 1: Desenvolvimento (GRATUITO)
```yaml
Docker local:
  - PostgreSQL: Grátis
  - Redis: Grátis
  - Next.js dev: Grátis
  - Fastify dev: Grátis

Total: R$ 0/mês
```

### Fase 2: MVP em Produção (ECONÔMICO)
```yaml
Railway:
  - Backend API: $5/mês
  - PostgreSQL 500MB: Incluído
  - Redis 100MB: Incluído

Vercel:
  - Frontend (Hobby): Grátis

Integrações:
  - WhatsApp: Grátis (1k/mês)
  - Resend: Grátis (3k/mês)
  - Cloudflare R2: Grátis (10GB)

Total: ~R$ 25/mês
```

### Fase 3: Escala (100+ clientes)
```yaml
Railway/Render:
  - Backend Pro: $20/mês

Neon.tech:
  - PostgreSQL Pro: $19/mês

Upstash:
  - Redis: $10/mês

Vercel:
  - Pro: $20/mês

Resend:
  - Pro (50k emails): $20/mês

Total: ~R$ 450/mês
```

---

## 📋 Próximos Passos

### Fase 1: Setup do Projeto (Semana 1)
- [ ] Criar estrutura Next.js (frontend)
- [ ] Criar estrutura Fastify (backend)
- [ ] Configurar Prisma + PostgreSQL
- [ ] Setup Redis + BullMQ
- [ ] Docker Compose para desenvolvimento

### Fase 2: Autenticação (Semana 1-2)
- [ ] Registro de usuário
- [ ] Login (JWT)
- [ ] Middleware de autenticação
- [ ] Middleware de autorização (RBAC)
- [ ] Recuperação de senha

### Fase 3: CRUD de Contatos (Semana 2)
- [ ] Listar contatos
- [ ] Criar contato
- [ ] Editar contato
- [ ] Deletar contato
- [ ] Importação CSV
- [ ] Exportação Excel
- [ ] Sistema de tags

### Fase 4: Kanban (Semana 3)
- [ ] Criar colunas
- [ ] Drag & drop (React DnD)
- [ ] Mover contatos entre colunas
- [ ] Estatísticas por coluna

### Fase 5: Flow Builder (Semana 3-4)
- [ ] UI drag-and-drop (React Flow)
- [ ] Salvar/carregar flows
- [ ] Sistema de execução
- [ ] Workers (BullMQ)
- [ ] Integração com Kanban

### Fase 6: Integrações (Semana 4-5)
- [ ] WhatsApp Business API
- [ ] Instagram Graph API
- [ ] Resend (Email)
- [ ] Webhooks

### Fase 7: Campanhas e Aniversários (Semana 5-6)
- [ ] CRUD de campanhas
- [ ] Segmentação
- [ ] Agendamento
- [ ] Automação de aniversários (cron)
- [ ] Posts sociais

### Fase 8: Deploy e Monitoramento (Semana 6)
- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Railway)
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry)
- [ ] Analytics

---

## 🎯 Decision Log (Decisões Importantes)

### Por que Next.js 15?
- ✅ App Router (melhor para SEO)
- ✅ Server Components (performance)
- ✅ Deploy otimizado na Vercel
- ✅ React 19 (mais rápido)

### Por que Fastify em vez de Express?
- ✅ 2x mais rápido
- ✅ TypeScript nativo
- ✅ Validação com schemas (Zod)
- ✅ Plugin system modular

### Por que Prisma?
- ✅ Type-safe queries
- ✅ Migrations automáticas
- ✅ Studio visual
- ✅ Melhor DX do mercado

### Por que BullMQ?
- ✅ Filas robustas e testadas
- ✅ Retries automáticos
- ✅ Dashboard visual (Bull Board)
- ✅ Processamento paralelo
- ✅ Não sobrecarrega PostgreSQL

### Por que remover Transactions/Coupons?
- ✅ Simplificar MVP
- ✅ Features avançadas para depois
- ✅ Focar em automação primeiro
- ✅ Adicionar quando houver demanda

---

## 📚 Documentos Criados

1. ✅ [ARQUITETURA_TECNICA.md](ARQUITETURA_TECNICA.md) - Stack completa
2. ✅ [ROTAS_E_NAVEGACAO.md](ROTAS_E_NAVEGACAO.md) - Fluxo de usuário e dock
3. ✅ [ANALISE_SCHEMA.md](ANALISE_SCHEMA.md) - Comparação Supabase → Prisma
4. ✅ [schema.prisma](schema.prisma) - Schema final (12 tabelas)
5. ✅ [REDIS_STRUCTURE.md](REDIS_STRUCTURE.md) - Cache e filas
6. ✅ [RESUMO_DECISOES.md](RESUMO_DECISOES.md) - Este documento

---

## ✅ Pronto para Implementar!

Temos TUDO documentado:
- ✅ Arquitetura definida
- ✅ Rotas mapeadas
- ✅ Banco de dados modelado
- ✅ Redis estruturado
- ✅ Custos calculados
- ✅ Integrações planejadas

**Próximo passo**: Começar a implementar! 🚀

Quer que eu:
1. Crie a estrutura inicial do projeto (Next.js + Fastify)?
2. Implemente uma funcionalidade específica primeiro?
3. Crie o Docker Compose para dev local?
