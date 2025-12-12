# 🗺️ Zyva - Estrutura de Rotas e Navegação

## 📋 Índice
1. [Fluxo Completo do Usuário](#fluxo-completo)
2. [Estrutura de Rotas](#estrutura-de-rotas)
3. [Sistema de Permissões (RBAC)](#sistema-de-permissões)
4. [Dock Navigation (estilo macOS)](#dock-navigation)
5. [Componentes de Layout](#componentes-de-layout)
6. [Implementação Técnica](#implementação-técnica)

---

## 🎯 Fluxo Completo do Usuário

```
┌─────────────────────────────────────────────────────────────┐
│                    JORNADA DO USUÁRIO                       │
└─────────────────────────────────────────────────────────────┘

1. Landing Page (/)
   ↓ Clicar "Começar Agora"

2. Seção de Planos (/#planos)
   ↓ Escolher plano (Free, Pro, Business)

3. Checkout (/checkout?plan=pro)
   ↓ Preencher dados de pagamento

4. Cadastro (/cadastro)
   ↓ Criar conta (nome, email, senha)

5. Login (/login)
   ↓ Autenticar

6. Onboarding (/onboarding) - PRIMEIRA VEZ
   ↓ Tutorial inicial (opcional, pode pular)

7. Dashboard (/dashboard)
   ✅ Usuário autenticado e pronto!
```

---

## 🗂️ Estrutura de Rotas

### Rotas Públicas (não autenticadas)

```
apps/web/src/app/
├── (marketing)/                    # Grupo de rotas públicas
│   ├── layout.tsx                  # Layout com header/footer marketing
│   ├── page.tsx                    # Landing Page (/)
│   │   ├── Hero Section
│   │   ├── Features
│   │   ├── Pricing (#planos)
│   │   ├── Testimonials
│   │   └── CTA
│   │
│   ├── planos/
│   │   └── page.tsx                # Página detalhada de planos (/planos)
│   │
│   ├── sobre/
│   │   └── page.tsx                # Sobre a empresa (/sobre)
│   │
│   └── contato/
│       └── page.tsx                # Formulário de contato (/contato)
│
├── (auth)/                         # Grupo de rotas de autenticação
│   ├── layout.tsx                  # Layout centralizado, sem nav
│   │
│   ├── cadastro/
│   │   └── page.tsx                # Cadastro (/cadastro)
│   │
│   ├── login/
│   │   └── page.tsx                # Login (/login)
│   │
│   ├── esqueci-senha/
│   │   └── page.tsx                # Recuperação (/esqueci-senha)
│   │
│   └── resetar-senha/
│       └── page.tsx                # Reset com token (/resetar-senha?token=xxx)
│
└── checkout/
    └── page.tsx                    # Checkout de pagamento (/checkout?plan=pro)
```

### Rotas Privadas (autenticadas)

```
apps/web/src/app/
└── (app)/                          # Grupo protegido
    ├── layout.tsx                  # Layout com Dock Navigation
    │
    ├── onboarding/
    │   └── page.tsx                # Tutorial inicial (/onboarding)
    │
    ├── dashboard/
    │   └── page.tsx                # Dashboard principal (/dashboard)
    │
    ├── clientes/                   # CLIENTES (Gestão de contatos)
    │   ├── page.tsx                # Lista de clientes (/clientes)
    │   ├── novo/
    │   │   └── page.tsx            # Novo cliente (/clientes/novo)
    │   ├── [id]/
    │   │   ├── page.tsx            # Detalhes (/clientes/abc123)
    │   │   └── editar/
    │   │       └── page.tsx        # Editar (/clientes/abc123/editar)
    │   └── importar/
    │       └── page.tsx            # Importação CSV (/clientes/importar)
    │
    ├── automacoes/                 # AUTOMAÇÕES (Flow Builder)
    │   ├── page.tsx                # Lista de flows (/automacoes)
    │   ├── novo/
    │   │   └── page.tsx            # Criar flow (/automacoes/novo)
    │   └── [id]/
    │       ├── page.tsx            # Editar flow (/automacoes/abc123)
    │       └── execucoes/
    │           └── page.tsx        # Histórico (/automacoes/abc123/execucoes)
    │
    ├── pipeline/                   # PIPELINE (Kanban)
    │   ├── page.tsx                # Kanban board (/pipeline)
    │   └── tags/
    │       └── page.tsx            # Gerenciar tags (/pipeline/tags)
    │
    ├── campanhas/                  # CAMPANHAS (Mensagens e Posts)
    │   ├── page.tsx                # Lista (/campanhas)
    │   ├── nova/
    │   │   ├── mensagem/
    │   │   │   └── page.tsx        # Nova mensagem (/campanhas/nova/mensagem)
    │   │   └── post/
    │   │       └── page.tsx        # Novo post social (/campanhas/nova/post)
    │   └── [id]/
    │       ├── page.tsx            # Detalhes (/campanhas/abc123)
    │       └── metricas/
    │           └── page.tsx        # Métricas (/campanhas/abc123/metricas)
    │
    ├── configuracoes/              # CONFIGURAÇÕES
    │   ├── page.tsx                # Redirect → /configuracoes/perfil
    │   ├── perfil/
    │   │   └── page.tsx            # Dados pessoais (/configuracoes/perfil)
    │   ├── plano/
    │   │   └── page.tsx            # Upgrade/Downgrade (/configuracoes/plano)
    │   ├── integracoes/
    │   │   └── page.tsx            # WhatsApp, Instagram, etc (/configuracoes/integracoes)
    │   ├── notificacoes/
    │   │   └── page.tsx            # Preferências (/configuracoes/notificacoes)
    │   └── faturamento/
    │       └── page.tsx            # Histórico de pagamentos (/configuracoes/faturamento)
    │
    └── admin/                      # APENAS ADMIN (role: ADMIN)
        ├── layout.tsx              # Layout com sidebar admin
        ├── page.tsx                # Dashboard admin (/admin)
        │
        ├── usuarios/
        │   ├── page.tsx            # Listar todos os users (/admin/usuarios)
        │   └── [id]/
        │       └── page.tsx        # Editar usuário (/admin/usuarios/abc123)
        │
        ├── lojas/
        │   ├── page.tsx            # Listar lojas (/admin/lojas)
        │   └── [id]/
        │       └── page.tsx        # Detalhes da loja (/admin/lojas/abc123)
        │
        ├── financeiro/
        │   └── page.tsx            # Receita total (/admin/financeiro)
        │
        └── sistema/
            ├── logs/
            │   └── page.tsx        # Logs de sistema (/admin/sistema/logs)
            └── configuracoes/
                └── page.tsx        # Configs globais (/admin/sistema/configuracoes)
```

---

## 🔐 Sistema de Permissões (RBAC)

### Roles Disponíveis

```typescript
enum UserRole {
  ADMIN = 'ADMIN',      // Acesso total ao sistema
  LOJA = 'LOJA',        // Usuário cliente (loja)
}
```

### Matriz de Permissões

| Rota/Funcionalidade | LOJA | ADMIN |
|---------------------|------|-------|
| **Dashboard** | ✅ | ✅ |
| **Clientes** (CRUD) | ✅ | ✅ (todas as lojas) |
| **Automações** (Flow Builder) | ✅ | ✅ (todas) |
| **Pipeline** (Kanban) | ✅ | ✅ (todas) |
| **Campanhas** | ✅ | ✅ (todas) |
| **Configurações** (próprias) | ✅ | ✅ |
| **Admin - Usuários** | ❌ | ✅ |
| **Admin - Lojas** | ❌ | ✅ |
| **Admin - Financeiro** | ❌ | ✅ |
| **Admin - Sistema** | ❌ | ✅ |

### Schema do Banco (atualização)

```prisma
// Adicionar ao schema.prisma existente

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  avatar        String?

  // Role e permissões
  role          UserRole  @default(LOJA)

  // Plano SaaS (só para LOJA)
  plan          Plan?     @default(FREE)
  planExpiry    DateTime?

  // ... resto igual
}

enum UserRole {
  ADMIN
  LOJA
}

enum Plan {
  FREE
  PRO
  BUSINESS
  ENTERPRISE
}
```

---

## 🎨 Dock Navigation (estilo macOS)

### Visual do Dock

```
┌─────────────────────────────────────────────────────────────┐
│                    ÁREA DE CONTEÚDO                         │
│                                                             │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                         DOCK                                │
│  ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐  │  ┌──┐                   │
│  │📊│  │👥│  │⚡│  │📋│  │📱│  │  │⚙️│                   │
│  └──┘  └──┘  └──┘  └──┘  └──┘  │  └──┘                   │
│  Dash  Cli  Auto  Pipe  Camp  │  Config                   │
└─────────────────────────────────────────────────────────────┘
```

### Especificações do Dock

#### Layout
- **Posição**: Fixo na parte inferior da tela
- **Altura**: 80px
- **Background**: Blur com transparência (backdrop-filter: blur(20px))
- **Cor**: rgba(255, 255, 255, 0.7) no light mode / rgba(30, 30, 30, 0.8) no dark
- **Borda**: Borda superior sutil com sombra

#### Ícones
- **Tamanho base**: 48px x 48px
- **Hover**: Scale(1.2) com transição suave
- **Ativo**: Indicador abaixo do ícone (bolinha roxa)
- **Spacing**: 16px entre cada ícone

#### Comportamento
- **Hover effect**: Ícone cresce e vizinhos levemente também (efeito magnético)
- **Tooltip**: Nome da seção aparece acima ao hover
- **Separador**: Linha vertical entre apps e configurações (como no macOS)

### Estrutura dos Ícones

```typescript
// Configuração do Dock
const dockItems = [
  // Aplicativos principais
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊', // ou componente Lucide: <LayoutDashboard />
    href: '/dashboard',
    color: '#8b5cf6', // roxo
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: '👥', // <Users />
    href: '/clientes',
    color: '#3b82f6', // azul
  },
  {
    id: 'automacoes',
    label: 'Automações',
    icon: '⚡', // <Zap />
    href: '/automacoes',
    color: '#f59e0b', // amarelo
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: '📋', // <Kanban />
    href: '/pipeline',
    color: '#10b981', // verde
  },
  {
    id: 'campanhas',
    label: 'Campanhas',
    icon: '📱', // <MessageSquare />
    href: '/campanhas',
    color: '#ec4899', // rosa
  },

  // Separador
  { type: 'separator' },

  // Configurações (sempre à direita)
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: '⚙️', // <Settings />
    href: '/configuracoes',
    color: '#6b7280', // cinza
  },
];

// Para ADMIN, adicionar:
const adminDockItem = {
  id: 'admin',
  label: 'Admin',
  icon: '🛡️', // <Shield />
  href: '/admin',
  color: '#dc2626', // vermelho
  role: 'ADMIN', // Só aparece para admin
};
```

---

## 🏗️ Componentes de Layout

### 1. Layout da Aplicação

```tsx
// apps/web/src/app/(app)/layout.tsx

import { DockNavigation } from '@/components/navigation/DockNavigation';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirecionar se não autenticado
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Área de conteúdo */}
      <main className="flex-1 overflow-auto pb-20">
        {/* pb-20 para não cobrir o dock */}
        {children}
      </main>

      {/* Dock Navigation */}
      <DockNavigation userRole={session.user.role} />
    </div>
  );
}
```

### 2. Componente DockNavigation

```tsx
// apps/web/src/components/navigation/DockNavigation.tsx

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Zap,
  Kanban,
  MessageSquare,
  Settings,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DockItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  role?: 'ADMIN' | 'LOJA';
}

const dockItems: DockItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-purple-600',
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: Users,
    href: '/clientes',
    color: 'text-blue-600',
  },
  {
    id: 'automacoes',
    label: 'Automações',
    icon: Zap,
    href: '/automacoes',
    color: 'text-amber-600',
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: Kanban,
    href: '/pipeline',
    color: 'text-emerald-600',
  },
  {
    id: 'campanhas',
    label: 'Campanhas',
    icon: MessageSquare,
    href: '/campanhas',
    color: 'text-pink-600',
  },
];

const settingsItem: DockItem = {
  id: 'configuracoes',
  label: 'Configurações',
  icon: Settings,
  href: '/configuracoes',
  color: 'text-gray-600',
};

const adminItem: DockItem = {
  id: 'admin',
  label: 'Admin',
  icon: Shield,
  href: '/admin',
  color: 'text-red-600',
  role: 'ADMIN',
};

export function DockNavigation({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  // Filtrar itens por role
  const visibleItems = [...dockItems];
  if (userRole === 'ADMIN') {
    visibleItems.push(adminItem);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50" />

      {/* Conteúdo do Dock */}
      <div className="relative max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-end justify-center gap-2">
          {/* Aplicativos principais */}
          <div className="flex items-end gap-2">
            {visibleItems.map((item) => (
              <DockIcon
                key={item.id}
                item={item}
                isActive={isActive(item.href)}
              />
            ))}
          </div>

          {/* Separador */}
          <div className="w-px h-12 bg-gray-300 dark:bg-gray-600 mx-2" />

          {/* Configurações */}
          <DockIcon
            item={settingsItem}
            isActive={isActive(settingsItem.href)}
          />
        </div>
      </div>
    </nav>
  );
}

function DockIcon({ item, isActive }: { item: DockItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <Link href={item.href}>
      <motion.div
        className="relative group"
        whileHover={{ scale: 1.2, y: -8 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* Tooltip */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap">
            {item.label}
          </div>
        </div>

        {/* Ícone */}
        <div
          className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center transition-all',
            isActive
              ? 'bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg shadow-purple-500/50'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          <Icon
            className={cn(
              'w-7 h-7',
              isActive ? 'text-white' : item.color
            )}
          />
        </div>

        {/* Indicador de ativo */}
        {isActive && (
          <motion.div
            layoutId="dock-indicator"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
}
```

### 3. Middleware de Autenticação

```typescript
// apps/web/src/middleware.ts

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Rotas que exigem ADMIN
    const adminRoutes = ['/admin'];
    const isAdminRoute = adminRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Bloquear se não for admin
    if (isAdminRoute && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirecionar onboarding se já completou
    if (pathname === '/onboarding' && token?.onboardingCompleted) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Proteger rotas específicas
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/clientes/:path*',
    '/automacoes/:path*',
    '/pipeline/:path*',
    '/campanhas/:path*',
    '/configuracoes/:path*',
    '/admin/:path*',
    '/onboarding',
  ],
};
```

---

## 🚀 Fluxo de Onboarding Detalhado

### Etapa 1: Landing Page

```tsx
// apps/web/src/app/(marketing)/page.tsx

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="text-center max-w-4xl px-4">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Automatize o relacionamento com seus clientes
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Envie mensagens, gerencie pipeline e crie automações inteligentes.
            Tudo em um só lugar.
          </p>
          <a
            href="#planos"
            className="inline-block bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Começar Agora →
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        {/* Grid de features */}
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12">
          Escolha seu plano
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
          {/* Card FREE */}
          <PricingCard
            name="Free"
            price="R$ 0"
            features={[
              '100 contatos',
              '3 automações',
              '500 mensagens/mês',
              'WhatsApp + Email',
            ]}
            cta="Começar Grátis"
            href="/cadastro?plan=free"
          />

          {/* Card PRO */}
          <PricingCard
            name="Pro"
            price="R$ 97"
            features={[
              '1.000 contatos',
              '10 automações',
              '5.000 mensagens/mês',
              'WhatsApp + Email + Instagram',
              'Suporte prioritário',
            ]}
            highlighted
            cta="Assinar Pro"
            href="/checkout?plan=pro"
          />

          {/* Card BUSINESS */}
          <PricingCard
            name="Business"
            price="R$ 297"
            features={[
              'Contatos ilimitados',
              'Automações ilimitadas',
              '50.000 mensagens/mês',
              'Todas as integrações',
              'Suporte 24/7',
              'Gerente de conta dedicado',
            ]}
            cta="Assinar Business"
            href="/checkout?plan=business"
          />
        </div>
      </section>
    </>
  );
}
```

### Etapa 2: Checkout

```tsx
// apps/web/src/app/checkout/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'free';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-8">Finalizar Assinatura</h1>

        {/* Resumo do Plano */}
        <div className="bg-purple-50 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold capitalize">Plano {plan}</h3>
              <p className="text-gray-600">Cobrança mensal</p>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {plan === 'pro' && 'R$ 97'}
              {plan === 'business' && 'R$ 297'}
              {plan === 'free' && 'R$ 0'}
              <span className="text-sm text-gray-600">/mês</span>
            </div>
          </div>
        </div>

        {/* Formulário de Pagamento (se não for free) */}
        {plan !== 'free' && (
          <Elements stripe={stripePromise}>
            <CheckoutForm plan={plan} />
          </Elements>
        )}

        {/* Botão para plano gratuito */}
        {plan === 'free' && (
          <a
            href="/cadastro"
            className="block w-full bg-purple-600 text-white text-center py-4 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Continuar para Cadastro →
          </a>
        )}
      </div>
    </div>
  );
}

function CheckoutForm({ plan }: { plan: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // Criar Payment Intent no backend
    const response = await fetch('/api/checkout/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });

    const { clientSecret } = await response.json();

    // Confirmar pagamento
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else if (paymentIntent.status === 'succeeded') {
      // Redirecionar para cadastro com plano confirmado
      window.location.href = `/cadastro?plan=${plan}&payment=${paymentIntent.id}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Element */}
      <div className="border rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? 'Processando...' : `Assinar por R$ ${plan === 'pro' ? '97' : '297'}/mês`}
      </button>
    </form>
  );
}
```

### Etapa 3: Cadastro

```tsx
// apps/web/src/app/(auth)/cadastro/page.tsx

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function CadastroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'free';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          plan,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message);
        return;
      }

      // Redirecionar para login
      router.push('/login?registered=true');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar conta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Zyva
          </h1>
          <p className="text-gray-600 mt-2">Crie sua conta</p>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome completo
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="João Silva"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="joao@exemplo.com"
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

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar senha
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>

          {/* Link para login */}
          <p className="text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <a href="/login" className="text-purple-600 font-semibold hover:underline">
              Fazer login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
```

### Etapa 4: Login

```tsx
// apps/web/src/app/(auth)/login/page.tsx

'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        alert('Email ou senha incorretos');
        return;
      }

      // Redirecionar para onboarding ou dashboard
      router.push('/onboarding');
    } catch (error) {
      console.error(error);
      alert('Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Zyva
          </h1>
          <p className="text-gray-600 mt-2">Entre na sua conta</p>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="joao@exemplo.com"
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

          {/* Esqueci senha */}
          <div className="text-right">
            <a
              href="/esqueci-senha"
              className="text-sm text-purple-600 hover:underline"
            >
              Esqueci minha senha
            </a>
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

### Etapa 5: Onboarding (primeira vez)

```tsx
// apps/web/src/app/(app)/onboarding/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

const steps = [
  {
    title: 'Bem-vindo ao Zyva! 👋',
    description: 'Vamos configurar sua conta em 3 passos rápidos.',
  },
  {
    title: 'Conecte o WhatsApp',
    description: 'Configure sua conta do WhatsApp Business para enviar mensagens.',
  },
  {
    title: 'Importe seus contatos',
    description: 'Faça upload de um arquivo CSV ou conecte sua base existente.',
  },
  {
    title: 'Tudo pronto! 🎉',
    description: 'Sua conta está configurada. Vamos começar!',
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Marcar onboarding como completo
      fetch('/api/user/complete-onboarding', { method: 'POST' });
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    fetch('/api/user/complete-onboarding', { method: 'POST' });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex justify-center gap-2 mb-12">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-16 rounded-full transition-all ${
                index <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Conteúdo */}
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{steps[currentStep].title}</h1>
          <p className="text-xl text-gray-600 mb-12">
            {steps[currentStep].description}
          </p>

          {/* Conteúdo específico por step */}
          {currentStep === 1 && (
            <div className="mb-8">
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                Conectar WhatsApp
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="mb-8">
              <input
                type="file"
                accept=".csv,.xlsx"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition"
            >
              Pular
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              {currentStep === steps.length - 1 ? 'Começar' : 'Próximo →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📊 Resumo Visual das Rotas

```
PÚBLICO (não autenticado)
├── / (Landing)
├── /#planos (Pricing)
├── /checkout?plan=pro
├── /cadastro
└── /login

PRIVADO (autenticado - LOJA)
├── /onboarding (primeira vez)
├── /dashboard
├── /clientes
├── /automacoes (Flow Builder)
├── /pipeline (Kanban)
├── /campanhas
└── /configuracoes

ADMIN (role: ADMIN)
├── /admin (Dashboard admin)
├── /admin/usuarios
├── /admin/lojas
├── /admin/financeiro
└── /admin/sistema
```

---

**Próximos Passos**:
1. Implementar componentes
2. Configurar NextAuth.js
3. Criar API routes
4. Estilizar com Tailwind
5. Adicionar animações com Framer Motion

Está pronto para começar a implementação! 🚀
