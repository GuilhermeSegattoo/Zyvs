# 🚀 COMECE AQUI - Guia Rápido do Zyva

## 👋 Bem-vindo!

Este é o ponto de partida para desenvolver o **Zyva**. Siga este guia passo a passo.

---

## 📚 Documentação Completa

Antes de começar, familiarize-se com estes documentos:

1. ✅ **README.md** - Visão geral do projeto
2. ✅ **PLANO_DESENVOLVIMENTO.md** - Plano detalhado fase por fase
3. ✅ **ARQUITETURA_TECNICA.md** - Stack e decisões técnicas
4. ✅ **schema.prisma** - Estrutura do banco de dados
5. ✅ **ROTAS_E_NAVEGACAO.md** - Mapeamento de rotas

---

## 🎯 Roadmap de 30 Dias

### Semana 1: Fundação
- ✅ Dia 1: Setup inicial (Docker, estrutura de pastas)
- ✅ Dias 2-4: Autenticação completa (JWT, login, registro)

### Semana 2: CRM
- ✅ Dias 5-8: CRUD de Contatos (importação CSV, tags)
- ✅ Dias 9-11: Kanban/Pipeline (drag-and-drop)

### Semana 3: Automação
- ✅ Dias 12-16: Flow Builder (drag-and-drop visual)

### Semana 4: Integrações
- ✅ Dias 17-20: WhatsApp + Email (envio de mensagens)
- ✅ Dias 21-23: Campanhas (disparos em massa)

### Semana 5: Features Avançadas
- ✅ Dias 24-25: Automação de aniversários
- ✅ Dias 26-28: Deploy e produção

---

## 🏃 Início Rápido (5 minutos)

### 1. Verificar pré-requisitos

```bash
# Node.js 20+
node --version  # v20.x.x

# Docker
docker --version
docker-compose --version
```

### 2. Clonar e configurar

```bash
# Já está na pasta certa!
cd zyva

# Iniciar banco de dados
docker-compose up -d

# Verificar containers
docker-compose ps
# Deve mostrar: postgres (healthy), redis (healthy)
```

### 3. Escolher por onde começar

Você tem 2 opções:

#### Opção A: Backend primeiro (Recomendado)
```bash
cd backend

# Siga o guia: backend/SETUP.md
```

#### Opção B: Frontend primeiro
```bash
cd frontend

# Siga o guia: frontend/SETUP.md
```

---

## 📋 Checklist da Fase 0 (Setup Inicial)

Siga exatamente nesta ordem:

### Backend

- [ ] 1. Criar `backend/package.json`
- [ ] 2. Instalar dependências
- [ ] 3. Configurar TypeScript
- [ ] 4. Copiar `schema.prisma`
- [ ] 5. Criar `.env`
- [ ] 6. Rodar migrations do Prisma
- [ ] 7. Criar `src/server.ts`
- [ ] 8. Testar servidor (`npm run dev`)

### Frontend

- [ ] 1. Criar projeto Next.js
- [ ] 2. Instalar dependências adicionais
- [ ] 3. Configurar Tailwind
- [ ] 4. Instalar Shadcn/UI
- [ ] 5. Criar `.env.local`
- [ ] 6. Criar estrutura de pastas
- [ ] 7. Testar app (`npm run dev`)

### Docker

- [ ] 1. Verificar `docker-compose.yml` existe
- [ ] 2. Rodar `docker-compose up -d`
- [ ] 3. Acessar pgAdmin (opcional): `http://localhost:5050`
- [ ] 4. Verificar saúde: `docker-compose ps`

---

## 🎓 Próximos Passos

Após completar o setup inicial (Fase 0), vá para:

### **FASE 1: Autenticação** 📖
Abra: `PLANO_DESENVOLVIMENTO.md` → Seção "FASE 1"

Você vai criar:
- Sistema de registro
- Sistema de login
- JWT tokens
- Middlewares de proteção
- Páginas de auth no frontend

**Tempo estimado**: 3 dias

---

## 🆘 Problemas Comuns

### Erro: "Cannot connect to PostgreSQL"

```bash
# Verificar se container está rodando
docker-compose ps

# Verificar logs
docker-compose logs postgres

# Reiniciar container
docker-compose restart postgres
```

### Erro: "Prisma Client not generated"

```bash
cd backend
npx prisma generate
```

### Erro: "Port 3000 already in use"

```bash
# Mudar porta no frontend
# Editar: frontend/package.json
"dev": "next dev -p 3001"
```

### Erro: "Cannot find module"

```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Recursos Úteis

### Ferramentas de Desenvolvimento

**Backend**:
- Prisma Studio: `npx prisma studio` (http://localhost:5555)
- API Docs: `http://localhost:3001/documentation`
- Bull Board: `http://localhost:3001/admin/queues`

**Database**:
- pgAdmin: `http://localhost:5050`
  - Email: `admin@zyva.com`
  - Senha: `admin123`
- Redis Commander: `http://localhost:8081`

**Frontend**:
- Next.js: `http://localhost:3000`

### Comandos Rápidos

```bash
# Ver todos os containers
docker-compose ps

# Logs em tempo real
docker-compose logs -f

# Parar tudo
docker-compose down

# Resetar banco (CUIDADO!)
cd backend
npx prisma migrate reset
```

---

## 💡 Dicas Importantes

### 1. Commit frequentemente
```bash
git add .
git commit -m "feat: implementa autenticação"
git push
```

### 2. Teste cada feature antes de avançar
- Não avance para próxima fase sem ter certeza que a atual funciona!

### 3. Use o Prisma Studio
- Visualize os dados sendo criados em tempo real
- `npx prisma studio`

### 4. Acompanhe os logs
- Backend: Terminal mostra todas as requisições
- BullMQ: Use o Bull Board para ver filas

### 5. Leia a documentação das bibliotecas
- [Fastify](https://fastify.dev/)
- [Prisma](https://www.prisma.io/docs)
- [Next.js](https://nextjs.org/docs)
- [BullMQ](https://docs.bullmq.io/)

---

## ✅ Você está pronto quando...

- [ ] Docker Compose rodando (postgres + redis)
- [ ] Backend respondendo em `http://localhost:3001/health`
- [ ] Frontend abrindo em `http://localhost:3000`
- [ ] Prisma Studio acessível (`npx prisma studio`)
- [ ] Consegue criar um usuário de teste no banco

---

## 🎯 Próximo Arquivo a Abrir

### **→ PLANO_DESENVOLVIMENTO.md → FASE 0**

Depois de completar a Fase 0:
### **→ PLANO_DESENVOLVIMENTO.md → FASE 1 (Autenticação)**

---

## 🚀 Vamos começar!

Abra um terminal e rode:

```bash
# 1. Verificar se está na pasta certa
pwd  # Deve mostrar: .../Zyvs

# 2. Listar arquivos
ls
# Deve mostrar: frontend/ backend/ docker-compose.yml etc

# 3. Iniciar Docker
docker-compose up -d

# 4. Escolher: backend ou frontend primeiro
cd backend  # OU cd frontend
```

**Boa sorte! 🎉**

Se tiver dúvidas, consulte os documentos na pasta raiz ou abra uma issue no GitHub!
