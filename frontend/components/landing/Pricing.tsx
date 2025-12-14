'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfeito para começar',
    features: [
      '100 contatos',
      '2 flows de automação',
      '500 mensagens/mês',
      'WhatsApp integrado',
      'Suporte por email',
      'Aniversários automáticos'
    ],
    cta: 'Começar Grátis',
    popular: false,
    gradient: 'from-gray-600 to-gray-800'
  },
  {
    name: 'Pro',
    price: '97',
    description: 'Para negócios em crescimento',
    features: [
      '5.000 contatos',
      '10 flows de automação',
      '10.000 mensagens/mês',
      'WhatsApp + Instagram + Email',
      'Suporte prioritário',
      'Analytics avançado',
      'Exportação de relatórios',
      'API de integração'
    ],
    cta: 'Começar Teste Grátis',
    popular: true,
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    name: 'Business',
    price: '297',
    description: 'Para empresas estabelecidas',
    features: [
      'Contatos ilimitados',
      'Flows ilimitados',
      '100.000 mensagens/mês',
      'Todas as integrações',
      'Suporte 24/7',
      'Gerente de conta dedicado',
      'White-label',
      'Treinamento personalizado',
      'SLA garantido'
    ],
    cta: 'Falar com Vendas',
    popular: false,
    gradient: 'from-indigo-600 to-purple-600'
  }
];

export default function Pricing() {
  return (
    <section id="planos" className="relative py-32 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Planos{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transparentes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para o tamanho do seu negócio
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative bg-white rounded-2xl p-8 shadow-xl ${
                plan.popular ? 'ring-2 ring-purple-600 shadow-purple-200' : ''
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    Mais Popular
                  </div>
                </div>
              )}

              {/* Plan name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    R${plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">/mês</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center mt-0.5`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/cadastro">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:shadow-xl`
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-gray-500 mt-12"
        >
          Todos os planos incluem 14 dias de teste grátis. Sem cartão de crédito necessário.
        </motion.p>
      </div>
    </section>
  );
}
