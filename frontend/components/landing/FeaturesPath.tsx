'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Users, Workflow, Zap, Calendar, BarChart3, Globe, Shield } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'WhatsApp Business',
    description: 'API oficial integrada. Mensagens em massa sem bloqueio.',
    color: 'bg-[#25d366]',
  },
  {
    icon: Users,
    title: 'CRM Completo',
    description: 'Gestão de contatos, tags, histórico e campos customizáveis.',
    color: 'bg-[#00ff88]',
  },
  {
    icon: Workflow,
    title: 'Flow Builder',
    description: 'Automações visuais. Drag & drop. Sem código.',
    color: 'bg-[#9333ea]',
  },
  {
    icon: Zap,
    title: 'Automações',
    description: 'Disparos automáticos, follow-ups e nutrição de leads.',
    color: 'bg-[#ffeb3b]',
  },
  {
    icon: Calendar,
    title: 'Aniversários',
    description: 'Mensagens automáticas personalizadas todo dia.',
    color: 'bg-[#ff3366]',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Métricas em tempo real. ROI, conversão, engajamento.',
    color: 'bg-[#3b82f6]',
  },
  {
    icon: Globe,
    title: 'Multi-Canal',
    description: 'WhatsApp, Instagram, Email, SMS integrados.',
    color: 'bg-[#ec4899]',
  },
  {
    icon: Shield,
    title: 'Segurança',
    description: 'LGPD, criptografia E2E, backup diário automático.',
    color: 'bg-black',
  },
];

export default function FeaturesPath() {
  return (
    <section id="funcionalidades" className="relative py-32 bg-white grid-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header - asymmetric */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-6 -rotate-1"
          >
            <div className="px-5 py-2 bg-black text-[#00ff88] brutal-border brutal-shadow-sm font-bold uppercase text-sm">
              FUNCIONALIDADES
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight max-w-4xl"
          >
            TUDO QUE VOCÊ PRECISA.
            <br />
            <span className="text-[#00ff88]">NADA A MAIS.</span>
          </motion.h2>
        </div>

        {/* Features Grid - asymmetric */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const rotation = index % 3 === 0 ? 'rotate-1' : index % 2 === 0 ? '-rotate-1' : '';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4, y: -4 }}
                className={`group bg-white brutal-border brutal-shadow hover:brutal-shadow-lg p-8 transition-all ${rotation}`}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 mb-6 ${feature.color} ${feature.color === 'bg-black' ? 'text-[#00ff88]' : 'text-black'} brutal-border brutal-shadow-sm`}>
                  <Icon className="w-7 h-7" strokeWidth={2.5} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-extrabold mb-3 uppercase">
                  {feature.title}
                </h3>
                <p className="text-gray-700 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <a href="/cadastro">
            <motion.button
              whileHover={{ x: 6, y: -6 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-[#ff3366] text-white brutal-border-thick brutal-shadow-lg font-extrabold text-lg uppercase tracking-wide hover:bg-[#ff3366]/90 transition-colors"
            >
              TESTAR GRÁTIS →
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
