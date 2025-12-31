# 🗺️ Thumdra - Plano de Desenvolvimento Atualizado

**Última atualização:** 30/12/2024

---

## 📊 Status Atual do Projeto

### ✅ O que já está PRONTO

```
🎉 INFRAESTRUTURA E BASE (100%)
├── ✅ Docker (PostgreSQL + Redis)
├── ✅ Backend Fastify + TypeScript
├── ✅ Frontend Next.js 15 + React 19
├── ✅ Prisma ORM com migrations
├── ✅ Scripts de inicialização (Windows/Linux)
└── ✅ Ambiente de desenvolvimento completo

🔐 AUTENTICAÇÃO E MULTI-TENANCY (100%)
├── ✅ Sistema de registro/login com JWT
├── ✅ Middleware de autenticação
├── ✅ Controle de roles (ADMIN/LOJA)
├── ✅ Multi-tenancy com Organizations
├── ✅ Store Zustand com persistência
└── ✅ Páginas de login/cadastro brutal style

💳 SISTEMA DE PAGAMENTOS (100%) ⭐ NOVO
├── ✅ Integração Stripe completa
├── ✅ 3 planos pagos (Teste A: R$10, B: R$50, C: R$100)
├── ✅ Checkout com trial de 14 dias
├── ✅ Customer Portal
├── ✅ Webhooks (subscription created/updated/deleted)
├── ✅ Gerenciamento de assinaturas
├── ✅ Página de billing no dashboard
└── ✅ Fluxo completo: Cadastro → Checkout → Login → Dashboard

🎨 DESIGN SYSTEM E UX (100%) ⭐ NOVO
├── ✅ Landing page neo-brutal completa
│   ├── Hero com copy otimizado
│   ├── FAQ redesenhado
│   ├── Pricing (3 planos pagos)
│   ├── Features
│   └── Footer
├── ✅ Páginas de autenticação com brutal style
├── ✅ Dashboard clean e funcional (user)
├── ✅ Dashboard Admin clean
├── ✅ Sidebar minimalista
├── ✅ Design system unificado
│   ├── Cores: #00ff88 (verde), #ff3366 (rosa), #ffeb3b (amarelo)
│   ├── Borders: 2px preto
│   ├── Shadows: box-shadow brutal
│   └── Typography: Bold/Extrabold consistente
└── ✅ Responsive design

🏢 PAINEL ADMINISTRATIVO (100%)
├── ✅ Dashboard com estatísticas
├── ✅ Layout separado para admin
├── ✅ Sistema de roles
└── ✅ Rotas protegidas
```

**Progresso:** ~30% do MVP original + **Sistema de monetização completo**

---

## 🎯 Roadmap Atualizado

### 🔄 PRÓXIMAS FASES (Por Prioridade)

---

## 📋 **FASE 2: CRUD de Contatos** (PRÓXIMA - Alta Prioridade)
**Duração estimada:** 4-5 dias
**Status:** ⏳ Não iniciado

### Por que é prioritário?
Contatos são a **base de dados** do CRM. Sem eles, nenhuma outra funcionalidade (flows, campanhas, mensagens) funciona.

### Objetivos
- Gestão completa de contatos com campos customizados
- Importação/Exportação CSV
- Sistema de tags para segmentação
- Busca e filtros avançados

### Checklist Backend

#### `backend/src/modules/contacts/`

**contacts.schema.ts**
```typescript
- [ ] Schema de criação de contato
- [ ] Schema de atualização
- [ ] Schema de filtros/busca
- [ ] Validação de campos customizados
```

**contacts.service.ts**
```typescript
- [ ] list() - Listar contatos com paginação
- [ ] getById() - Buscar por ID
- [ ] create() - Criar contato
- [ ] update() - Atualizar contato
- [ ] delete() - Deletar contato
- [ ] importCSV() - Importar múltiplos contatos
- [ ] exportCSV() - Exportar para CSV
- [ ] search() - Busca por nome/email/telefone
- [ ] filterByTags() - Filtrar por tags
- [ ] updateCustomFields() - Atualizar campos JSON
```

**contacts.controller.ts**
```typescript
- [ ] GET /api/contacts - Listar (com query params)
- [ ] GET /api/contacts/:id - Buscar um
- [ ] POST /api/contacts - Criar
- [ ] PUT /api/contacts/:id - Atualizar
- [ ] DELETE /api/contacts/:id - Deletar
- [ ] POST /api/contacts/import - Importar CSV
- [ ] GET /api/contacts/export - Exportar CSV
```

**contacts.routes.ts**
```typescript
- [ ] Registrar todas as rotas
- [ ] Aplicar middleware de autenticação
- [ ] Validar organizationId (multi-tenancy)
```

#### Tags (relacionado)

**tags.service.ts**
```typescript
- [ ] list() - Listar tags da organização
- [ ] create() - Criar tag
- [ ] delete() - Deletar tag
- [ ] addToContact() - Adicionar tag a contato
- [ ] removeFromContact() - Remover tag de contato
```

### Checklist Frontend

#### `frontend/app/(app)/clientes/`

**page.tsx** - Lista de contatos
```typescript
- [ ] Tabela com contatos
- [ ] Paginação
- [ ] Busca em tempo real
- [ ] Filtros (tags, data criação)
- [ ] Botão "Novo Contato"
- [ ] Botão "Importar CSV"
- [ ] Botão "Exportar"
- [ ] Ações: Editar, Deletar
```

**novo/page.tsx** - Criar contato
```typescript
- [ ] Formulário com validação
- [ ] Campos: nome, email, telefone, empresa, cargo
- [ ] Campos customizados (JSON)
- [ ] Seletor de tags
- [ ] Botão salvar
```

**[id]/page.tsx** - Detalhes do contato
```typescript
- [ ] Visualizar todos os dados
- [ ] Editar inline
- [ ] Histórico de interações
- [ ] Timeline de atividades
```

#### Componentes

**components/contacts/**
```typescript
- [ ] ContactCard.tsx - Card de contato
- [ ] ContactTable.tsx - Tabela com sorting
- [ ] ImportModal.tsx - Modal de importação CSV
- [ ] ExportModal.tsx - Modal de exportação
- [ ] TagSelector.tsx - Seletor de tags
- [ ] CustomFieldsEditor.tsx - Editor de campos JSON
```

### Resultado Esperado
- ✅ Gestão completa de contatos funcionando
- ✅ Importar 1000+ contatos via CSV em segundos
- ✅ Busca instantânea
- ✅ Tags para segmentação
- ✅ Interface clean e rápida

---

## 💬 **FASE 5: Mensagens e Integrações** (Média Prioridade)
**Duração estimada:** 4-5 dias
**Status:** ⏳ Não iniciado

### Por que vem depois de Contatos?
Sem contatos, não há para quem enviar mensagens. Esta fase é o **core value** do produto.

### Objetivos
- Envio de mensagens via WhatsApp Business API
- Envio de emails via Resend
- Histórico de mensagens
- Webhooks para receber respostas

### Checklist Backend

#### WhatsApp Integration

**backend/src/integrations/whatsapp/**
```typescript
- [ ] whatsapp.service.ts
  - [ ] sendMessage() - Enviar mensagem
  - [ ] sendTemplate() - Enviar template aprovado
  - [ ] handleWebhook() - Receber respostas
  - [ ] verifyWebhook() - Validar webhook

- [ ] whatsapp.controller.ts
  - [ ] POST /api/integrations/whatsapp/send
  - [ ] POST /api/integrations/whatsapp/webhook
  - [ ] GET /api/integrations/whatsapp/webhook (verificação)
```

#### Email Integration

**backend/src/integrations/email/**
```typescript
- [ ] email.service.ts (Resend)
  - [ ] sendEmail() - Enviar email
  - [ ] sendBulk() - Envio em massa
  - [ ] handleWebhook() - Tracking (aberturas, cliques)
```

#### Messages Module

**backend/src/modules/messages/**
```typescript
- [ ] messages.service.ts
  - [ ] create() - Salvar mensagem no banco
  - [ ] list() - Listar histórico
  - [ ] getByContact() - Mensagens de um contato
  - [ ] updateStatus() - Atualizar status (enviado, lido, erro)

- [ ] messages.controller.ts
  - [ ] GET /api/messages - Histórico
  - [ ] GET /api/messages/contact/:id - Por contato
  - [ ] POST /api/messages/send - Enviar individual
```

#### Jobs (BullMQ)

**backend/src/jobs/queues/message.queue.ts**
```typescript
- [ ] Fila para envio de mensagens
- [ ] Retry automático em caso de erro
- [ ] Rate limiting
```

**backend/src/jobs/workers/message.worker.ts**
```typescript
- [ ] Processar fila de mensagens
- [ ] Chamar WhatsApp/Email API
- [ ] Atualizar status no banco
```

### Checklist Frontend

**frontend/app/(app)/mensagens/**
```typescript
- [ ] page.tsx - Histórico de mensagens
- [ ] novo/page.tsx - Enviar mensagem individual
- [ ] components/MessageTimeline.tsx - Timeline por contato
- [ ] components/SendMessageModal.tsx - Modal de envio rápido
```

**frontend/app/(app)/configuracoes/integracoes/**
```typescript
- [ ] page.tsx - Configurar WhatsApp e Email
- [ ] Salvar tokens/credenciais
- [ ] Testar conexão
```

### Resultado Esperado
- ✅ Envio de WhatsApp funcionando
- ✅ Envio de Email funcionando
- ✅ Webhooks recebendo respostas
- ✅ Histórico completo de mensagens
- ✅ Status tracking (enviado, lido, erro)

---

## ⚡ **FASE 4: Flow Builder** (Média-Alta Prioridade)
**Duração estimada:** 5-6 dias
**Status:** ⏳ Não iniciado

### Por que depois de Mensagens?
Flows precisam de **contatos** e **mensagens** para funcionar. Esta é a **automação** que diferencia o Thumdra.

### Objetivos
- Editor visual de automações (React Flow)
- Triggers (novo contato, tag adicionada, data específica)
- Actions (enviar mensagem, adicionar tag, mover kanban)
- Condições (if/else)
- Execução assíncrona via BullMQ

### Checklist Backend

**backend/src/modules/flows/**
```typescript
- [ ] flows.service.ts
  - [ ] create() - Criar flow
  - [ ] update() - Atualizar flow
  - [ ] list() - Listar flows
  - [ ] getById() - Buscar flow
  - [ ] delete() - Deletar flow
  - [ ] activate() - Ativar flow
  - [ ] deactivate() - Desativar flow
  - [ ] duplicate() - Duplicar flow

- [ ] flow-execution.service.ts
  - [ ] execute() - Executar flow para um contato
  - [ ] processNode() - Processar um nó
  - [ ] evaluateCondition() - Avaliar condição
  - [ ] logExecution() - Salvar log de execução
```

**Nodes (Tipos de nós)**
```typescript
- [ ] TriggerNode - Novo contato, Tag adicionada, Data
- [ ] ActionNode - Enviar mensagem, Adicionar tag, Mover kanban
- [ ] ConditionNode - IF/ELSE baseado em campos
- [ ] DelayNode - Aguardar X dias/horas
- [ ] WebhookNode - Chamar API externa
```

**backend/src/jobs/workers/flow.worker.ts**
```typescript
- [ ] Processar execução de flows
- [ ] Executar nós em sequência
- [ ] Tratar erros e retries
- [ ] Logs detalhados
```

### Checklist Frontend

**frontend/app/(app)/automacoes/**
```typescript
- [ ] page.tsx - Lista de flows
- [ ] novo/page.tsx - Canvas do editor (React Flow)
  - [ ] Drag & drop de nós
  - [ ] Conectar nós
  - [ ] Configurar cada nó
  - [ ] Salvar flow
  - [ ] Testar flow

- [ ] [id]/page.tsx - Editar flow existente
- [ ] [id]/execucoes/page.tsx - Histórico de execuções
```

**components/flows/**
```typescript
- [ ] FlowCanvas.tsx - Canvas principal
- [ ] NodePalette.tsx - Paleta de nós
- [ ] NodeConfig.tsx - Configuração de nó selecionado
- [ ] FlowTestModal.tsx - Modal para testar flow
```

### Resultado Esperado
- ✅ Editor visual funcionando
- ✅ Criar flows complexos com múltiplos nós
- ✅ Executar flows automaticamente
- ✅ Logs de execução detalhados
- ✅ UX intuitiva drag & drop

---

## 📋 **FASE 3: Kanban/Pipeline** (Média Prioridade)
**Duração estimada:** 3-4 dias
**Status:** ⏳ Não iniciado

### Objetivos
- Pipeline visual com drag & drop
- Colunas customizáveis
- Mover contatos entre estágios
- Estatísticas por coluna

### Checklist Backend

**backend/src/modules/kanban/**
```typescript
- [ ] columns.service.ts
  - [ ] list() - Listar colunas
  - [ ] create() - Criar coluna
  - [ ] update() - Atualizar nome/cor
  - [ ] delete() - Deletar coluna
  - [ ] reorder() - Reordenar colunas

- [ ] kanban.service.ts
  - [ ] moveContact() - Mover contato entre colunas
  - [ ] getStats() - Estatísticas por coluna
  - [ ] getByColumn() - Contatos de uma coluna
```

### Checklist Frontend

**frontend/app/(app)/pipeline/**
```typescript
- [ ] page.tsx - Board completo
- [ ] components/KanbanColumn.tsx - Coluna
- [ ] components/KanbanCard.tsx - Card de contato
- [ ] Drag & drop com @dnd-kit
- [ ] Modal de criação de coluna
```

### Resultado Esperado
- ✅ Pipeline visual funcionando
- ✅ Arrastar contatos entre colunas
- ✅ Estatísticas em tempo real
- ✅ Colunas customizáveis

---

## 📱 **FASE 6: Campanhas** (Baixa Prioridade)
**Duração estimada:** 3-4 dias
**Status:** ⏳ Não iniciado

### Objetivos
- Disparos em massa de mensagens
- Segmentação por tags
- Agendamento de envios
- Posts no Instagram (opcional)

### Checklist

**backend/src/modules/campaigns/**
```typescript
- [ ] campaigns.service.ts
  - [ ] create() - Criar campanha
  - [ ] list() - Listar campanhas
  - [ ] execute() - Executar disparo
  - [ ] schedule() - Agendar disparo
  - [ ] getStats() - Estatísticas de campanha

- [ ] campaign.worker.ts
  - [ ] Processar fila de envios
  - [ ] Enviar para contatos segmentados
  - [ ] Atualizar status
```

**frontend/app/(app)/campanhas/**
```typescript
- [ ] page.tsx - Lista de campanhas
- [ ] nova/mensagem/page.tsx - Criar campanha de mensagem
- [ ] [id]/page.tsx - Detalhes e estatísticas
```

---

## 🎂 **FASE 7: Aniversários** (Baixa Prioridade)
**Duração estimada:** 2 dias
**Status:** ⏳ Não iniciado

### Objetivos
- Cron job diário para detectar aniversariantes
- Envio automático de mensagem personalizada

### Checklist

**backend/src/jobs/cron/birthday.cron.ts**
```typescript
- [ ] Rodar diariamente às 8h
- [ ] Buscar contatos com aniversário hoje
- [ ] Enviar mensagem configurada
- [ ] Log de envios
```

**frontend/app/(app)/automacoes/aniversarios/**
```typescript
- [ ] page.tsx - Configurar template de mensagem
- [ ] Lista de próximos aniversários
```

---

## 🚀 **FASE 8: Deploy e Produção** (Final)
**Duração estimada:** 3-4 dias
**Status:** ⏳ Não iniciado

### Checklist

**Infraestrutura**
```typescript
- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Railway ou Render)
- [ ] PostgreSQL em produção (Supabase ou Neon)
- [ ] Redis em produção (Upstash)
- [ ] Configurar domínio
- [ ] SSL/HTTPS
- [ ] Variáveis de ambiente
```

**Monitoramento**
```typescript
- [ ] Sentry (errors)
- [ ] Uptime monitoring
- [ ] Logs centralizados
- [ ] Backups automáticos do banco
```

**Segurança**
```typescript
- [ ] Rate limiting em produção
- [ ] Validação de inputs
- [ ] Sanitização de dados
- [ ] CORS configurado
- [ ] Helmet.js
```

**Testes Finais**
```typescript
- [ ] Teste completo do fluxo de registro → checkout → uso
- [ ] Teste de envio de mensagens
- [ ] Teste de flows
- [ ] Teste de campanhas
- [ ] Teste de importação de contatos
```

---

## 📅 Timeline Estimada (Próximas Fases)

| Fase | Duração | Início | Fim |
|------|---------|--------|-----|
| **FASE 2: Contatos** | 4-5 dias | - | - |
| **FASE 5: Mensagens** | 4-5 dias | - | - |
| **FASE 4: Flow Builder** | 5-6 dias | - | - |
| **FASE 3: Kanban** | 3-4 dias | - | - |
| **FASE 6: Campanhas** | 3-4 dias | - | - |
| **FASE 7: Aniversários** | 2 dias | - | - |
| **FASE 8: Deploy** | 3-4 dias | - | - |

**Total estimado:** 25-32 dias (~5-6 semanas)

---

## 🎯 Recomendação de Próximos Passos

### Opção 1: MVP Mínimo (Prioridade Máxima)
**Objetivo:** Ter um produto vendável o mais rápido possível

1. ✅ **FASE 2: Contatos** (4-5 dias)
2. ✅ **FASE 5: Mensagens** (4-5 dias)
3. ✅ **FASE 8: Deploy** (3-4 dias)

**Total:** ~12-14 dias

**Resultado:** CRM funcional com envio de mensagens + Sistema de pagamento pronto

### Opção 2: MVP Completo (Recomendado)
**Objetivo:** Produto diferenciado com automação

1. ✅ **FASE 2: Contatos** (4-5 dias)
2. ✅ **FASE 5: Mensagens** (4-5 dias)
3. ✅ **FASE 4: Flow Builder** (5-6 dias)
4. ✅ **FASE 3: Kanban** (3-4 dias)
5. ✅ **FASE 8: Deploy** (3-4 dias)

**Total:** ~20-24 dias

**Resultado:** CRM completo com automações + Kanban + Mensagens + Pagamentos

---

## 📝 Notas Importantes

### O que temos de vantagem agora:
- ✅ Sistema de monetização completo (muitos startups esquecem disso)
- ✅ Design profissional e consistente
- ✅ Infraestrutura sólida
- ✅ Multi-tenancy configurado
- ✅ Admin dashboard pronto

### Próximas decisões:
1. Qual opção seguir? (MVP Mínimo ou Completo)
2. Quando começar a FASE 2?
3. Fazer deploy parcial ou só no final?

---

**🚀 Pronto para começar a FASE 2 (Contatos)?**
