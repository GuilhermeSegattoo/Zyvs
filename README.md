# 🚀 Zyva - Plataforma de Automação de Relacionamento com Clientes

<div align="center">
  <h3>Automatize mensagens, gerencie pipeline e crie automações inteligentes</h3>
  <p>WhatsApp • Email • Instagram • Flows • Kanban • Campanhas</p>
</div>

---

## 📋 Sobre o Projeto

**Zyva** é uma plataforma SaaS completa para automação de processos de relacionamento com clientes. O diferencial está na integração total entre todos os módulos, permitindo criar fluxos automatizados que se comunicam com o Kanban, enviam mensagens programadas e gerenciam toda a jornada do cliente.

### ✨ Principais Funcionalidades

- 👥 **CRM Completo** - Gestão de contatos com tags, importação CSV e campos customizáveis
- ⚡ **Flow Builder** - Automações visuais drag-and-drop
- 📋 **Pipeline Kanban** - Gestão visual de vendas com integração aos flows
- 💬 **Mensagens** - WhatsApp, Email e SMS em massa
- 📱 **Posts Sociais** - Agendamento automático no Instagram e Facebook
- 🎂 **Aniversários** - Automação de mensagens de aniversário
- 📊 **Dashboard** - Métricas e estatísticas em tempo real

---

## 🏗️ Arquitetura

### Stack Tecnológica

**Frontend**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn/UI
- Tanstack Query
- Zustand

**Backend**
- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL 16
- Redis 7
- BullMQ (filas)

**Integrações**
- WhatsApp Business API
- Instagram Graph API
- Resend (Email)
- Cloudflare R2 (Storage)

---

## 📁 Estrutura do Projeto

```
zyva/
├── frontend/          # Aplicação Next.js
│   ├── src/
│   │   ├── app/      # Rotas (App Router)
│   │   ├── components/
│   │   ├── lib/
│   │   └── stores/
│   └── package.json
│
├── backend/           # API Fastify
│   ├── src/
│   │   ├── modules/  # Módulos (auth, contacts, flows, etc)
│   │   ├── integrations/
│   │   ├── jobs/     # BullMQ workers
│   │   └── lib/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── docker-compose.yml # PostgreSQL + Redis
└── docs/              # Documentação completa
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 20+ (LTS)
- Docker e Docker Compose
- Git

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/seu-usuario/zyva.git
cd zyva
```

### Passo 2: Subir banco de dados (Docker)

```bash
# Iniciar PostgreSQL e Redis
docker-compose up -d

# Verificar se estão rodando
docker-compose ps
```

**Acesso aos containers**:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### Passo 3: Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Rodar migrations do Prisma
npx prisma migrate dev

# Gerar Prisma Client
npx prisma generate

# (Opcional) Seed de dados iniciais
npx prisma db seed

# Iniciar servidor de desenvolvimento
npm run dev
```

Backend rodando em: `http://localhost:3001`

### Passo 4: Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

Frontend rodando em: `http://localhost:3000`

---

## 🗄️ Banco de Dados

### Schema Prisma

O schema completo está em [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma).

**Principais tabelas** (12 no total):
1. `users` - Autenticação e perfis
2. `organizations` - Multi-tenancy (lojas)
3. `contacts` - CRM de clientes
4. `tags` - Segmentação
5. `kanban_columns` - Pipeline de vendas
6. `flows` - Automações
7. `flow_executions` - Histórico de execuções
8. `campaigns` - Mensagens/Posts
9. `messages` - Histórico de mensagens
10. `integrations` - APIs externas
11. `birthday_automations` - Config de aniversários
12. `audit_logs` - Auditoria

### Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Visualizar banco de dados
npx prisma studio
```

---

## 🔐 Sistema de Permissões

### Roles

- **ADMIN** - Acesso total ao sistema, gerencia todas as organizações
- **LOJA** - Gerencia apenas sua própria organização

### Matriz de Acesso

| Recurso | LOJA | ADMIN |
|---------|------|-------|
| Dashboard | ✅ Próprio | ✅ Todos |
| Contatos | ✅ CRUD completo | ✅ Ver todos |
| Flows | ✅ Criar/Editar | ✅ Ver todos |
| Campanhas | ✅ Próprias | ✅ Todas |
| Painel Admin | ❌ | ✅ |

---

## 🧪 Testes

```bash
# Backend
cd backend
npm run test
npm run test:watch
npm run test:coverage

# Frontend
cd frontend
npm run test
npm run test:e2e
```

---

## 📦 Deploy

### Frontend (Vercel)

```bash
cd frontend
vercel deploy
```

### Backend (Railway)

```bash
cd backend

# Conectar ao Railway
railway login
railway link

# Deploy
railway up
```

### Variáveis de Ambiente (Produção)

Configurar no Railway/Vercel:

```env
# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://...

# JWT
JWT_SECRET=seu-secret-super-seguro

# WhatsApp
WHATSAPP_PHONE_ID=...
WHATSAPP_TOKEN=...

# Email
RESEND_API_KEY=...

# Instagram
INSTAGRAM_ACCESS_TOKEN=...
INSTAGRAM_ACCOUNT_ID=...
```

---

## 📚 Documentação

Toda a documentação técnica está na pasta raiz:

- [ARQUITETURA_TECNICA.md](ARQUITETURA_TECNICA.md) - Arquitetura completa
- [ROTAS_E_NAVEGACAO.md](ROTAS_E_NAVEGACAO.md) - Estrutura de rotas
- [schema.prisma](schema.prisma) - Schema do banco
- [ANALISE_SCHEMA.md](ANALISE_SCHEMA.md) - Análise do schema
- [REDIS_STRUCTURE.md](REDIS_STRUCTURE.md) - Estrutura Redis
- [PLANO_DESENVOLVIMENTO.md](PLANO_DESENVOLVIMENTO.md) - Plano detalhado
- [RESUMO_DECISOES.md](RESUMO_DECISOES.md) - Decisões técnicas

---

## 🛠️ Comandos Úteis

### Docker

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f

# Iniciar com ferramentas (pgAdmin + Redis Commander)
docker-compose --profile tools up -d

# Acessar PostgreSQL
docker exec -it zyva-postgres psql -U zyva -d zyva_db

# Acessar Redis CLI
docker exec -it zyva-redis redis-cli
```

### Prisma

```bash
# Criar migration
npx prisma migrate dev --name nome

# Aplicar migrations
npx prisma migrate deploy

# Resetar banco (CUIDADO!)
npx prisma migrate reset

# Studio visual
npx prisma studio  # http://localhost:5555

# Gerar Prisma Client
npx prisma generate
```

### BullMQ (Filas)

```bash
# Acessar Bull Board (dashboard visual)
# http://localhost:3001/admin/queues

# Ver filas no Redis
docker exec -it zyva-redis redis-cli
> KEYS bull:*
> LRANGE bull:messages:waiting 0 -1
```

---

## 💰 Custos Estimados

### Desenvolvimento (GRATUITO)
- PostgreSQL + Redis: Docker local (R$ 0)
- Next.js dev: Local (R$ 0)

### MVP em Produção
- Railway (Backend + DB + Redis): $5/mês (~R$ 25)
- Vercel (Frontend): Gratuito
- WhatsApp Business API: Grátis até 1k conversas/mês
- Resend (Email): Grátis até 3k emails/mês

**Total: ~R$ 25/mês** 🎉

### Escala (1000+ usuários)
- Backend: $20/mês
- PostgreSQL: $19/mês
- Redis: $10/mês
- Vercel Pro: $20/mês
- Resend Pro: $20/mês

**Total: ~R$ 450/mês**

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com 💜 por [Seu Nome]

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu Nome](https://linkedin.com/in/seu-perfil)

---

## 🎯 Roadmap

### ✅ MVP (v1.0)
- [x] Autenticação
- [x] CRUD de Contatos
- [x] Kanban
- [x] Flow Builder
- [x] WhatsApp + Email
- [x] Campanhas
- [x] Aniversários

### 🚧 Próximas Features (v1.1)
- [ ] Templates de flows prontos
- [ ] Relatórios exportáveis
- [ ] Webhook builder
- [ ] Múltiplos usuários por organização (equipes)
- [ ] Permissões granulares

### 🔮 Futuro (v2.0)
- [ ] Integração com Shopify
- [ ] Sistema de cupons
- [ ] Transações e vendas
- [ ] IA para otimização de flows
- [ ] App mobile (React Native)

---

<div align="center">
  <p>Feito com ❤️ e muitas ☕</p>
  <p>⭐ Dê uma estrela se este projeto te ajudou!</p>
</div>
