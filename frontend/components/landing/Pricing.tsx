'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'TESTE A',
    price: '10',
    period: '/MÊS',
    features: [
      '1.000 contatos',
      '5 flows',
      '2.000 msg/mês',
      'WhatsApp',
      'Instagram',
      'Email',
      'Suporte padrão',
    ],
    color: 'bg-white',
    textColor: 'text-black',
  },
  {
    name: 'TESTE B',
    price: '50',
    period: '/MÊS',
    features: [
      '5.000 contatos',
      '15 flows',
      '10.000 msg/mês',
      'WhatsApp',
      'Instagram',
      'Email',
      'Suporte prioritário',
      'Analytics avançado',
    ],
    color: 'bg-[#00ff88]',
    textColor: 'text-black',
    popular: true,
  },
  {
    name: 'TESTE C',
    price: '100',
    period: '/MÊS',
    features: [
      '10.000 contatos',
      '30 flows',
      '25.000 msg/mês',
      'WhatsApp',
      'Instagram',
      'Email',
      'Suporte premium 24/7',
      'Analytics avançado',
      'API access',
    ],
    color: 'bg-black',
    textColor: 'text-white',
  },
];

export default function Pricing() {
  return (
    <section id="planos" className="relative py-32 bg-[#f5f5f5] grid-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-6 rotate-1"
          >
            <div className="px-5 py-2 bg-[#ff3366] text-white brutal-border brutal-shadow-sm font-bold uppercase text-sm">
              PREÇOS TRANSPARENTES
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          >
            SEM PEGADINHA.
            <br />
            SEM TAXAS ESCONDIDAS.
          </motion.h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 -rotate-2">
                  <div className="px-4 py-1.5 bg-[#ffeb3b] brutal-border brutal-shadow-sm font-extrabold text-xs uppercase">
                    MAIS POPULAR
                  </div>
                </div>
              )}

              <div className={`${plan.color} ${plan.textColor} p-10 brutal-border-thick brutal-shadow-lg h-full flex flex-col`}>
                {/* Plan name */}
                <h3 className="text-2xl font-extrabold mb-2 uppercase">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-8">
                  {plan.price === 'CUSTOM' ? (
                    <div className="text-5xl font-extrabold">CUSTOM</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold">R$</span>
                      <span className="text-6xl font-extrabold">{plan.price}</span>
                      <span className="text-sm font-bold opacity-70">{plan.period}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 flex-shrink-0 ${plan.color === 'bg-black' ? 'bg-[#00ff88]' : 'bg-black'}`}>
                        <Check className={`w-5 h-5 ${plan.color === 'bg-black' ? 'text-black' : 'text-white'}`} strokeWidth={4} />
                      </div>
                      <span className="font-bold text-sm uppercase leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/cadastro" className="block mt-auto">
                  <motion.button
                    whileHover={{ x: 4, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 ${
                      plan.color === 'bg-black'
                        ? 'bg-[#00ff88] text-black'
                        : plan.color === 'bg-[#00ff88]'
                        ? 'bg-black text-white'
                        : 'bg-black text-white'
                    } brutal-border-thick brutal-shadow font-extrabold uppercase text-sm tracking-wider`}
                  >
                    COMEÇAR AGORA
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 space-y-4"
        >
          <div className="inline-block px-6 py-3 bg-white brutal-border brutal-shadow rotate-1">
            <p className="font-bold uppercase text-sm">
              ✓ 14 DIAS GRÁTIS • ✓ CANCELE QUANDO QUISER • ✓ SUPORTE EM PORTUGUÊS
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
