# Thumdra Backend API

Backend do Thumdra CRM desenvolvido com Fastify, Prisma e PostgreSQL.

## ✅ Status

- [x] Setup completo
- [x] Banco de dados PostgreSQL configurado
- [x] Prisma ORM configurado
- [x] Autenticação JWT implementada
- [x] Servidor rodando em http://localhost:3001

## 🚀 Como Rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

O arquivo `.env` já está configurado com:

```env
DATABASE_URL="postgresql://zyva:zyva123@localhost:5432/zyva_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="seu-secret-super-seguro-aqui-trocar-em-producao-abc123xyz"
PORT=3001
NODE_ENV=development
```

### 3. Rodar migrations do Prisma

```bash
npm run prisma:migrate
```

### 4. Iniciar servidor

```bash
npm run dev
```

O servidor estará disponível em: http://localhost:3001

## 📡 Endpoints Disponíveis

### Health Check

```bash
GET /health
```

Resposta:
```json
{
  "status": "ok",
  "timestamp": "2025-12-13T00:37:23.447Z",
  "uptime": 17.88,
  "environment": "development"
}
```

### Autenticação

#### Registro de Usuário

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Seu Nome",
  "email": "seu@email.com",
  "password": "senha123"
}
```

Resposta:
```json
{
  "user": {
    "id": "...",
    "email": "seu@email.com",
    "name": "Seu Nome",
    "role": "LOJA",
    "organizationId": "...",
    "organization": { ... }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "seu@email.com",
  "password": "senha123"
}
```

Resposta: mesma do registro

#### Obter Perfil (rota protegida)

```bash
GET /api/auth/me
Authorization: Bearer SEU_TOKEN_JWT
```

Resposta:
```json
{
  "id": "...",
  "email": "seu@email.com",
  "name": "Seu Nome",
  "avatar": null,
  "role": "LOJA",
  "plan": "FREE",
  "organizationId": "...",
  "organization": {
    "id": "...",
    "name": "Sua Organização",
    "slug": "sua-org",
    "plan": "FREE",
    "maxContacts": 100,
    "maxFlows": 3,
    "maxMessagesPerMonth": 500
  },
  "createdAt": "...",
  "lastLoginAt": "...",
  "onboardingCompleted": false
}
```

## 🧪 Testar com cURL

### Registrar usuário

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@thumdra.com","password":"senha123"}'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@thumdra.com","password":"senha123"}'
```

### Obter perfil

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Iniciar servidor em modo desenvolvimento (watch)
- `npm run build` - Compilar TypeScript para JavaScript
- `npm start` - Iniciar servidor em produção
- `npm run prisma:migrate` - Rodar migrations
- `npm run prisma:generate` - Gerar Prisma Client
- `npm run prisma:studio` - Abrir Prisma Studio (GUI do banco)
- `npm run prisma:reset` - Resetar banco de dados (CUIDADO!)

## 📊 Banco de Dados

Para visualizar os dados no banco:

```bash
npm run prisma:studio
```

Acesse: http://localhost:5555

## 🔐 Segurança

- Senhas são criptografadas com bcrypt (10 rounds)
- JWT expira automaticamente (configure no fastify/jwt)
- CORS configurado para aceitar apenas localhost em desenvolvimento
- Helmet configurado para headers de segurança

## 📁 Estrutura de Pastas

```
backend/
├── src/
│   ├── lib/
│   │   └── prisma.ts           # Cliente Prisma
│   ├── modules/
│   │   └── auth/               # Módulo de autenticação
│   │       ├── auth.schema.ts  # Validação Zod
│   │       ├── auth.service.ts # Lógica de negócio
│   │       ├── auth.controller.ts # Controllers
│   │       └── auth.routes.ts  # Rotas
│   ├── middlewares/
│   │   └── auth.middleware.ts  # Middleware de autenticação
│   └── server.ts               # Entry point
├── prisma/
│   ├── schema.prisma           # Schema do banco
│   └── migrations/             # Migrações
├── .env                        # Variáveis de ambiente
├── package.json
└── tsconfig.json
```

## 🎯 Próximos Passos

Agora que o backend de autenticação está funcionando, você pode:

1. **Testar no Postman/Insomnia** - Importe as rotas e teste
2. **Implementar CRUD de Contatos** - Seguir FASE 2 do plano
3. **Desenvolver o Frontend** - Next.js para consumir esta API
4. **Adicionar mais módulos** - Kanban, Flows, Campanhas, etc.

## 📞 Suporte

Consulte a documentação principal em: `/doc/PLANO_DESENVOLVIMENTO.md`
