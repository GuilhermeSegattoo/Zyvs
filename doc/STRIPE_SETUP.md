# 🎯 Guia Completo de Setup do Stripe

## 📋 Pré-requisitos

- [ ] Conta no Stripe criada (https://dashboard.stripe.com/register)
- [ ] CNPJ cadastrado (necessário para receber no Brasil)
- [ ] Backend e Frontend rodando localmente

---

## 1️⃣ Configurar Stripe Dashboard

### Passo 1: Pegar as API Keys

1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Copie:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

### Passo 2: Criar Produtos e Prices

#### Produto 1: Thumdra Pro
1. Vá em: https://dashboard.stripe.com/test/products/create
2. Preencha:
   - **Nome**: Thumdra Pro
   - **Descrição**: Plano Pro com 5.000 contatos e 15 flows
   - **Pricing model**: Recurring
   - **Price**: R$ 147
   - **Billing period**: Monthly
   - **Currency**: BRL
3. Clique em "Save product"
4. Copie o **Price ID** (começa com `price_...`)

#### Produto 2: Thumdra Business
1. Repita o processo acima com:
   - **Nome**: Thumdra Business
   - **Price**: R$ 497
   - **Billing period**: Monthly
2. Copie o **Price ID**

#### Produto 3: Thumdra Enterprise
1. Repita o processo:
   - **Nome**: Thumdra Enterprise
   - **Price**: Custom (ou R$ 997)
   - **Billing period**: Monthly
2. Copie o **Price ID**

### Passo 3: Configurar Webhook

1. Vá em: https://dashboard.stripe.com/test/webhooks/create
2. Preencha:
   - **Endpoint URL**: `http://localhost:3001/api/billing/webhook`
     > ⚠️ Para desenvolvimento local, use **Stripe CLI** (veja abaixo)
   - **Description**: Thumdra Webhook
   - **Events to send**:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
3. Clique em "Add endpoint"
4. Copie o **Signing secret** (começa com `whsec_...`)

---

## 2️⃣ Configurar Variáveis de Ambiente

### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` e adicione:

```bash
# Stripe
STRIPE_SECRET_KEY="sk_test_SEU_SECRET_KEY_AQUI"
STRIPE_WEBHOOK_SECRET="whsec_SEU_WEBHOOK_SECRET_AQUI"

# Price IDs
STRIPE_PRICE_PRO="price_SEU_PRICE_PRO_AQUI"
STRIPE_PRICE_BUSINESS="price_SEU_PRICE_BUSINESS_AQUI"
STRIPE_PRICE_ENTERPRISE="price_SEU_PRICE_ENTERPRISE_AQUI"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)

```bash
cd ../frontend
cp .env.local.example .env.local
```

Edite o arquivo `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_SEU_PUBLISHABLE_KEY_AQUI
```

---

## 3️⃣ Rodar Migration do Prisma

Os campos do Stripe foram adicionados ao schema. Rode a migration:

```bash
cd backend
npx prisma migrate dev --name add_stripe_fields
npx prisma generate
```

---

## 4️⃣ Registrar Rotas no Server

Adicione as rotas de billing no `backend/src/server.ts`:

```typescript
import { billingRoutes } from './modules/billing/billing.routes';

// ... outras rotas ...

// Billing
fastify.register(billingRoutes, { prefix: '/api/billing' });
```

---

## 5️⃣ Testar Webhooks Localmente (Stripe CLI)

Para testar webhooks em desenvolvimento local, use o Stripe CLI:

### Instalar Stripe CLI

**Windows:**
```bash
# Via Scoop
scoop install stripe
```

**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
# Download direto
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_X.X.X_linux_x86_64.tar.gz
tar -xvf stripe_X.X.X_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

### Configurar e Rodar

```bash
# 1. Fazer login
stripe login

# 2. Encaminhar webhooks para seu localhost
stripe listen --forward-to localhost:3001/api/billing/webhook

# 3. Copie o webhook secret que aparece (whsec_...)
# 4. Adicione no .env:
#    STRIPE_WEBHOOK_SECRET="whsec_..."

# 4. Em outro terminal, rode o backend
cd backend
npm run dev
```

---

## 6️⃣ Testar Fluxo Completo

### Teste 1: Checkout

1. Rode backend + frontend:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev

   # Terminal 3 - Stripe CLI (webhooks)
   stripe listen --forward-to localhost:3001/api/billing/webhook
   ```

2. Acesse: http://localhost:3000/pricing

3. Clique em "Escolher Plano" no plano Pro

4. Use dados de teste:
   - **Card**: `4242 4242 4242 4242`
   - **Data**: Qualquer data futura
   - **CVC**: Qualquer 3 dígitos

5. Complete o checkout

6. Verifique:
   - Webhook recebido no terminal do Stripe CLI
   - Usuário atualizado no banco (plan = PRO)
   - Redirecionado para /dashboard

### Teste 2: Customer Portal

1. Faça login no sistema

2. Vá em: http://localhost:3000/dashboard/settings/billing

3. Clique em "Gerenciar Assinatura"

4. Você será redirecionado para o Stripe Customer Portal

5. Teste:
   - Cancelar assinatura
   - Atualizar método de pagamento
   - Ver histórico de faturas

---

## 7️⃣ Cartões de Teste

Use estes cartões para testar diferentes cenários:

| Cenário | Número | Resultado |
|---------|--------|-----------|
| **Sucesso** | 4242 4242 4242 4242 | Pagamento aprovado |
| **Recusado** | 4000 0000 0000 0002 | Cartão recusado |
| **3D Secure** | 4000 0027 6000 3184 | Requer autenticação |
| **Sem fundos** | 4000 0000 0000 9995 | Fundos insuficientes |

---

## 8️⃣ Produção (Quando for lançar)

### Ativar Modo Produção

1. Complete o onboarding no Stripe Dashboard
2. Ative sua conta (precisa de CNPJ verificado)
3. Crie os produtos/prices em modo produção
4. Troque as keys de test (pk_test_, sk_test_) para produção (pk_live_, sk_live_)
5. Configure webhook em modo produção apontando para sua URL real:
   - `https://api.seudominio.com/api/billing/webhook`

### Variáveis de Ambiente Produção

```bash
# Backend (.env em produção - Railway/Render)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Novo secret do webhook produção
STRIPE_PRICE_PRO="price_..." # IDs de produção
FRONTEND_URL="https://seudominio.com"

# Frontend (.env em produção - Vercel)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 9️⃣ Monitoramento

### Dashboard Stripe

Acesse regularmente:
- https://dashboard.stripe.com/payments - Ver pagamentos
- https://dashboard.stripe.com/subscriptions - Assinaturas ativas
- https://dashboard.stripe.com/webhooks - Status dos webhooks
- https://dashboard.stripe.com/logs - Logs de eventos

### Métricas Importantes

- **MRR (Monthly Recurring Revenue)**: Receita mensal recorrente
- **Churn Rate**: Taxa de cancelamento
- **Failed Payments**: Pagamentos que falharam

---

## 🚨 Troubleshooting

### Webhook não está chegando

```bash
# Verifique se o Stripe CLI está rodando
stripe listen --forward-to localhost:3001/api/billing/webhook

# Teste manualmente
stripe trigger checkout.session.completed
```

### Erro "No such price"

- Verifique se os Price IDs no `.env` estão corretos
- Confirme que criou os produtos no Dashboard

### Pagamento aprovado mas plano não atualiza

- Verifique os logs do webhook no terminal
- Confira se o `userId` está sendo passado corretamente no metadata
- Veja os logs no Stripe Dashboard > Webhooks

---

## ✅ Checklist Final

- [ ] Stripe account criada
- [ ] API keys configuradas (.env)
- [ ] Produtos criados no Dashboard
- [ ] Price IDs adicionados no .env
- [ ] Migration rodada (Prisma)
- [ ] Rotas registradas no server.ts
- [ ] Stripe CLI instalado e rodando
- [ ] Testou checkout com sucesso
- [ ] Testou Customer Portal
- [ ] Testou cancelamento
- [ ] Webhook recebendo eventos

---

## 📚 Recursos

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

**🎉 Setup Completo! Seu sistema de pagamentos está pronto!**
