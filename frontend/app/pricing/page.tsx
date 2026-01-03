'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'TESTE_A',
    displayName: 'Teste A',
    price: 10,
    period: '/mês',
    features: [
      '1.000 contatos',
      '5 flows de automação',
      '2.000 mensagens/mês',
      'WhatsApp',
      'Instagram',
      'Email',
      'Suporte padrão',
    ],
  },
  {
    name: 'TESTE_B',
    displayName: 'Teste B',
    price: 50,
    period: '/mês',
    popular: true,
    features: [
      '5.000 contatos',
      '15 flows de automação',
      '10.000 mensagens/mês',
      'WhatsApp',
      'Instagram',
      'Email',
      'Suporte prioritário',
      'Analytics avançado',
    ],
  },
  {
    name: 'TESTE_C',
    displayName: 'Teste C',
    price: 100,
    period: '/mês',
    features: [
      '10.000 contatos',
      '30 flows de automação',
      '25.000 mensagens/mês',
      'WhatsApp',
      'Instagram',
      'Email',
      'Suporte premium 24/7',
      'Analytics avançado',
      'API access',
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planName: string) => {
    if (!isAuthenticated) {
      router.push('/cadastro');
      return;
    }

    try {
      setLoading(planName);
      const response = await api.post('/api/billing/checkout', {
        plan: planName,
      });

      // Redirecionar para Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast.error('Erro ao processar pagamento');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white grid-bg py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 -rotate-1"
          >
            <div className="px-5 py-2 bg-[#ffeb3b] brutal-border brutal-shadow-sm font-bold uppercase text-sm">
              <Sparkles className="w-4 h-4 inline mr-2" strokeWidth={3} />
              14 DIAS GRÁTIS
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 uppercase leading-tight"
          >
            PLANOS E
            <br />
            <span className="text-[#00ff88]">PREÇOS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-medium text-gray-700 max-w-2xl mx-auto"
          >
            Escolha o plano ideal para seu negócio. Teste grátis por 14 dias.
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white brutal-border brutal-shadow p-8 ${
                index % 2 === 0 ? 'rotate-1' : '-rotate-1'
              } ${plan.popular ? 'relative' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-1 bg-[#ff3366] text-white brutal-border brutal-shadow-sm font-bold uppercase text-xs">
                    MAIS POPULAR
                  </div>
                </div>
              )}

              <div className="text-sm font-bold uppercase text-gray-600 mb-2">
                {plan.displayName || plan.name}
              </div>

              <div className="mb-6">
                <span className="text-5xl font-extrabold">
                  R$ {plan.price}
                </span>
                <span className="text-gray-600 font-medium ml-2">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#00ff88] brutal-border flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-black" strokeWidth={4} />
                    </div>
                    <span className="font-medium text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ x: 4, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectPlan(plan.name)}
                disabled={loading === plan.name || (user?.plan === plan.name)}
                className={`w-full py-4 brutal-border-thick brutal-shadow font-extrabold uppercase tracking-wide transition disabled:opacity-50 ${
                  plan.popular
                    ? 'bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                {loading === plan.name
                  ? 'PROCESSANDO...'
                  : user?.plan === plan.name
                  ? 'PLANO ATUAL'
                  : 'ESCOLHER PLANO'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center">
          <div className="inline-block bg-white brutal-border brutal-shadow px-6 py-3 rotate-1">
            <p className="text-sm font-bold uppercase">
              14 DIAS GRÁTIS • CANCELE QUANDO QUISER • SUPORTE EM PORTUGUÊS
            </p>
          </div>
        </div>

        {/* Back to Home */}
        {!isAuthenticated && (
          <div className="text-center mt-12">
            <Link href="/">
              <motion.button
                whileHover={{ x: -2, y: -2 }}
                className="px-6 py-3 bg-white brutal-border brutal-shadow-sm font-bold uppercase text-sm hover:bg-gray-50 transition"
              >
                ← Voltar para Home
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
