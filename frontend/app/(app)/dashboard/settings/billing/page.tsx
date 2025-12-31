'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { CreditCard, ExternalLink, AlertCircle } from 'lucide-react';

export default function BillingPage() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/billing/portal');

      // Redirecionar para Stripe Customer Portal
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
      alert('Erro ao abrir portal de assinatura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold uppercase mb-2">Billing</h1>
        <p className="text-gray-600 mb-8 font-medium">
          Gerencie sua assinatura e método de pagamento
        </p>

        {/* Current Plan */}
        <div className="bg-white brutal-border brutal-shadow p-8 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-bold uppercase text-gray-600 mb-1">
                Plano Atual
              </div>
              <div className="text-4xl font-extrabold uppercase mb-2">
                {user?.plan || 'FREE'}
              </div>

              {user?.plan === 'FREE' && (
                <p className="text-gray-600 font-medium">
                  Faça upgrade para desbloquear recursos avançados
                </p>
              )}

              {user?.plan !== 'FREE' && (
                <p className="text-gray-600 font-medium">
                  Próxima cobrança em: {new Date().toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>

            <div className="px-4 py-2 bg-[#00ff88] brutal-border brutal-shadow-sm font-bold uppercase text-sm">
              Ativo
            </div>
          </div>
        </div>

        {/* Manage Subscription */}
        {user?.plan !== 'FREE' && (
          <motion.button
            whileHover={{ x: 4, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleManageSubscription}
            disabled={loading}
            className="w-full px-8 py-4 bg-black text-[#00ff88] brutal-border-thick brutal-shadow font-bold uppercase flex items-center justify-center gap-3 hover:bg-gray-900 transition disabled:opacity-50"
          >
            <CreditCard className="w-5 h-5" strokeWidth={3} />
            {loading ? 'Carregando...' : 'Gerenciar Assinatura'}
            <ExternalLink className="w-4 h-4" strokeWidth={3} />
          </motion.button>
        )}

        {/* Upgrade CTA */}
        {user?.plan === 'FREE' && (
          <div className="mt-6 bg-[#ffeb3b] brutal-border brutal-shadow p-6 -rotate-1">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black brutal-border flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-[#ffeb3b]" strokeWidth={3} />
              </div>
              <div className="flex-1">
                <div className="font-extrabold uppercase mb-2">
                  Desbloqueie todo o potencial
                </div>
                <p className="text-sm font-medium mb-4">
                  Automatize mais, venda mais, trabalhe menos com o plano Pro.
                </p>
                <a href="/pricing">
                  <motion.button
                    whileHover={{ x: 2, y: -2 }}
                    className="px-6 py-3 bg-black text-[#00ff88] brutal-border brutal-shadow-sm font-bold uppercase text-sm"
                  >
                    Ver Planos →
                  </motion.button>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Features by Plan */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            {
              label: 'Contatos',
              value: user?.plan === 'FREE' ? '100'
                   : user?.plan === 'TESTE_A' ? '1,000'
                   : user?.plan === 'TESTE_B' ? '5,000'
                   : user?.plan === 'TESTE_C' ? '10,000'
                   : '5,000'
            },
            {
              label: 'Flows',
              value: user?.plan === 'FREE' ? '2'
                   : user?.plan === 'TESTE_A' ? '5'
                   : user?.plan === 'TESTE_B' ? '15'
                   : user?.plan === 'TESTE_C' ? '30'
                   : '15'
            },
            {
              label: 'Mensagens/mês',
              value: user?.plan === 'FREE' ? '500'
                   : user?.plan === 'TESTE_A' ? '2,000'
                   : user?.plan === 'TESTE_B' ? '10,000'
                   : user?.plan === 'TESTE_C' ? '25,000'
                   : '15,000'
            },
          ].map((item, i) => (
            <div key={i} className={`bg-white brutal-border brutal-shadow p-4 ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
              <div className="text-xs font-bold uppercase text-gray-600 mb-1">
                {item.label}
              </div>
              <div className="text-2xl font-extrabold">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
