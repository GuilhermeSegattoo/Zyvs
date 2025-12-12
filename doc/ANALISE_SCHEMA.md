# 📊 Análise e Evolução do Schema do Banco de Dados

## 🔍 Análise do Schema Atual (Supabase)

### ✅ Pontos Fortes

1. **Estrutura multi-tenant bem definida**
   - `clients` table como base para cada loja
   - Todas as tabelas relacionadas ao `client_id`

2. **Sistema de automação robusto**
   - `flows`, `flow_executions`, `flow_node_types`
   - `scheduled_messages`, `message_queue`

3. **Gestão de contatos completa**
   - `customer_contacts` com campos relevantes
   - `tags` e `contact_tags` para segmentação
   - `kanban_cards` e `kanban_columns` para pipeline

4. **Histórico e auditoria**
   - `message_logs` para tracking de mensagens
   - `operation_logs` para auditoria

5. **Sistema de assinaturas**
   - `subscriptions` com limites por plano
   - `client_settings` com configurações personalizadas

### ❌ Problemas Identificados

1. **FALTA Sistema de Roles/Permissões**
   - Não há diferenciação entre ADMIN e LOJA
   - Sem tabela de `users` própria (usa `auth.users` do Supabase)
   - Sem controle granular de permissões

2. **Estrutura muito acoplada ao Supabase**
   - Dependência de `auth.users`
   - Não funciona standalone com Prisma

3. **Campos desnecessários para o escopo inicial**
   - `transactions` - pode ser adicionado depois
   - `coupons` e `coupon_usages` - feature avançada
   - Integração com Shopify específica

4. **Falta de campos importantes**
   - Aniversários (birthdays automation)
   - Campanhas (messages campaigns)
   - Posts sociais (social media scheduling)

5. **Normalização excessiva**
   - `contact_tags` como tabela separada (pode ser many-to-many direto)
   - `message_queue` separado de `scheduled_messages`

---

## 🎯 Proposta de Schema Otimizado

### Mudanças Principais

1. ✅ **Adicionar sistema de ROLES**
   - Enum `UserRole` (ADMIN, LOJA)
   - Tabela `users` própria (não depende de auth externa)

2. ✅ **Simplificar multi-tenancy**
   - Renomear `clients` → `organizations` (mais claro)
   - Todo usuário LOJA pertence a uma organization

3. ✅ **Adicionar funcionalidades faltantes**
   - Campanhas de mensagens
   - Posts sociais agendados
   - Automação de aniversários

4. ✅ **Remover complexidade desnecessária**
   - Remover `transactions`, `coupons` (adicionar depois se necessário)
   - Simplificar `message_queue` (usar BullMQ/Redis)

5. ✅ **Otimizar para Prisma**
   - Relações explícitas
   - Enums tipados
   - Índices otimizados

---

## 📝 Mapeamento de Tabelas

### Tabelas que serão MANTIDAS (com ajustes)

| Tabela Antiga | Tabela Nova | Mudanças |
|---------------|-------------|----------|
| `clients` | `organizations` | + `owner_id` agora aponta para `users` |
| `profiles` | ❌ Removido | Dados movidos para `users` |
| `customer_contacts` | `contacts` | Nome simplificado |
| `tags` | `tags` | Mantido |
| `contact_tags` | ❌ Removido | Relação many-to-many direta |
| `kanban_columns` | `kanban_columns` | Mantido |
| `kanban_cards` | ❌ Removido | `contacts` tem `columnId` direto |
| `flows` | `flows` | Mantido |
| `flow_executions` | `flow_executions` | Mantido |
| `flow_node_types` | ❌ Removido | Hard-coded no frontend |
| `scheduled_messages` | `messages` | Unificado |
| `message_logs` | `messages` | Mesma tabela |
| `message_queue` | ❌ Removido | Usar BullMQ (Redis) |
| `integrations` | `integrations` | Mantido |
| `client_settings` | ❌ Removido | Campos movidos para `organizations` |
| `subscriptions` | ❌ Removido | Dados movidos para `users` |
| `operation_logs` | `audit_logs` | Renomeado |

### Tabelas NOVAS

| Tabela | Propósito |
|--------|-----------|
| `users` | Autenticação e perfil (substitui auth.users + profiles) |
| `campaigns` | Campanhas de mensagens e posts sociais |
| `birthday_automations` | Configuração de automação de aniversários |

---

## 🗂️ Comparação Lado a Lado

### ANTES (Supabase - 19 tabelas)

```
auth.users (Supabase)
├── profiles
├── clients
│   ├── client_settings
│   ├── subscriptions
│   ├── customer_contacts
│   │   ├── contact_tags
│   │   ├── kanban_cards
│   │   └── transactions
│   ├── tags
│   ├── kanban_columns
│   ├── flows
│   │   ├── flow_executions
│   │   └── flow_node_types
│   ├── scheduled_messages
│   │   ├── message_queue
│   │   └── message_logs
│   ├── integrations
│   └── coupons
│       └── coupon_usages
└── operation_logs
```

### DEPOIS (Prisma - 12 tabelas)

```
users (próprio)
├── organizations (se role = LOJA)
│   ├── contacts
│   │   └── tags (many-to-many)
│   ├── kanban_columns
│   ├── flows
│   │   └── flow_executions
│   ├── campaigns
│   ├── messages
│   ├── integrations
│   └── birthday_automations
└── audit_logs
```

**Redução**: 19 → 12 tabelas (37% mais simples!)

---

## 🔐 Sistema de Permissões (RBAC)

### Modelo de Dados

```prisma
enum UserRole {
  ADMIN       // Acesso total ao sistema
  LOJA        // Usuário cliente (organização)
}

model User {
  id       String   @id @default(cuid())
  email    String   @unique
  password String   // hash bcrypt
  name     String
  role     UserRole @default(LOJA)

  // Se role = LOJA
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])

  // Se role = ADMIN
  // Sem organization, acessa tudo
}

model Organization {
  id      String @id @default(cuid())
  ownerId String
  owner   User   @relation(fields: [ownerId], references: [id])

  // Plano e limites
  plan         Plan    @default(FREE)
  maxContacts  Int     @default(100)
  maxFlows     Int     @default(3)
  maxMessages  Int     @default(500)

  // Relações
  users    User[]     // Múltiplos usuários podem gerenciar (futuro: equipes)
  contacts Contact[]
  flows    Flow[]
  // ...
}
```

### Regras de Acesso

| Ação | LOJA | ADMIN |
|------|------|-------|
| **Criar organização** | ❌ (criada no cadastro) | ✅ |
| **Ver própria org** | ✅ | ✅ (todas) |
| **Editar própria org** | ✅ (limitado) | ✅ (tudo) |
| **Deletar org** | ❌ | ✅ |
| **Ver contatos** | ✅ (próprios) | ✅ (todos) |
| **Ver flows** | ✅ (próprios) | ✅ (todos) |
| **Ver estatísticas globais** | ❌ | ✅ |
| **Gerenciar usuários** | ❌ | ✅ |
| **Ver audit logs** | ❌ | ✅ |

---

## 📊 Campos Importantes por Contexto

### Aniversários (`contacts.birthdate`)

```prisma
model Contact {
  birthdate DateTime?  // Data de nascimento

  // Automação verifica diariamente:
  // WHERE EXTRACT(MONTH FROM birthdate) = ?
  //   AND EXTRACT(DAY FROM birthdate) = ?
}

model BirthdayAutomation {
  id         String  @id @default(cuid())
  orgId      String

  isEnabled  Boolean @default(true)
  template   String  @db.Text  // "Feliz aniversário {{nome}}!"
  channel    MessageChannel
  sendAtHour Int     @default(9)  // Enviar às 9h
}
```

### Campanhas

```prisma
enum CampaignType {
  MESSAGE      // WhatsApp/Email/SMS para contatos
  SOCIAL_POST  // Instagram/Facebook post
}

model Campaign {
  id            String       @id @default(cuid())
  organizationId String

  name          String
  type          CampaignType
  channel       MessageChannel?  // Para MESSAGE
  platform      String?          // Para SOCIAL_POST (instagram, facebook)

  content       String       @db.Text
  mediaUrl      String?

  // Segmentação
  targetAll     Boolean      @default(true)
  targetTags    String[]     // IDs de tags

  // Agendamento
  status        CampaignStatus
  scheduledFor  DateTime?

  // Métricas
  totalSent     Int          @default(0)
  totalOpened   Int          @default(0)
}
```

### Mensagens (unificado)

```prisma
model Message {
  id         String  @id @default(cuid())
  contactId  String

  // Origem
  campaignId String?
  flowExecutionId String?

  // Conteúdo
  channel    MessageChannel
  content    String  @db.Text
  mediaUrl   String?

  // Status e tracking
  status     MessageStatus
  sentAt     DateTime?
  deliveredAt DateTime?
  openedAt   DateTime?

  // Erros
  error      String?
}
```

---

## 🚀 Próximos Passos

1. ✅ Criar schema.prisma completo
2. ✅ Definir seeds iniciais
3. ✅ Configurar Redis para filas
4. ✅ Documentar migrations
5. ✅ Criar testes de integração

---

## 💡 Decisões Técnicas

### Por que remover `message_queue`?

**ANTES**: Tabela SQL para fila
```sql
-- Problema:
-- - Polling constante no banco
-- - Não escala bem
-- - Sem retries sofisticados
```

**DEPOIS**: BullMQ com Redis
```typescript
// Vantagens:
// - Filas robustas e testadas
// - Retries automáticos
// - Processamento paralelo
// - Dashboard visual (Bull Board)
// - Não sobrecarrega PostgreSQL
```

### Por que simplificar kanban_cards?

**ANTES**: Tabela separada
```prisma
model KanbanCard {
  id        String
  contactId String
  columnId  String
  position  Int
  // ... mais campos
}
```

**DEPOIS**: Campo direto no Contact
```prisma
model Contact {
  columnId String?  // Basta isso!
  column   KanbanColumn? @relation(...)
}
// Posição = ordem de created_at
// Menos joins, queries mais rápidas
```

### Por que unificar mensagens?

**ANTES**: 3 tabelas
- `scheduled_messages` (futuras)
- `message_logs` (enviadas)
- `message_queue` (fila)

**DEPOIS**: 1 tabela + Redis
- `messages` (todas, filtradas por status)
- Fila no Redis (não persiste)

**Vantagem**: Menos complexidade, histórico completo em um lugar

---

## 📈 Estimativa de Performance

### Queries Otimizadas

| Query | Antes | Depois | Ganho |
|-------|-------|--------|-------|
| Listar contatos com tags | 2 JOINs | 1 JOIN | ~30% |
| Buscar mensagens de campanha | 3 JOINS | 1 JOIN | ~50% |
| Kanban completo | 4 JOINS | 2 JOINS | ~40% |
| Dashboard stats | 8 queries | 4 queries | ~50% |

### Índices Sugeridos

```prisma
// Queries mais comuns otimizadas

model Contact {
  @@index([organizationId, createdAt])  // Listar por org
  @@index([organizationId, email])      // Buscar por email
  @@index([organizationId, phone])      // Buscar por telefone
  @@index([birthdate])                  // Aniversariantes
}

model Message {
  @@index([contactId, createdAt])       // Histórico do contato
  @@index([campaignId])                 // Mensagens da campanha
  @@index([status, scheduledFor])       // Processar fila
}

model Flow {
  @@index([organizationId, isActive])   // Flows ativos
}
```

---

**Próximo**: Criar schema.prisma completo com todas essas melhorias! 🚀
