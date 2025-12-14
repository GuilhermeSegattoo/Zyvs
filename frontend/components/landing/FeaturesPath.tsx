'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, Users, Zap, BarChart3, Calendar, Workflow } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'WhatsApp Integrado',
    description: 'Conecte sua conta do WhatsApp Business e automatize conversas com seus clientes.',
    color: 'from-green-500 to-emerald-500',
    position: 'left'
  },
  {
    icon: Users,
    title: 'Gestão de Contatos',
    description: 'Organize todos os seus clientes em um CRM completo com tags e filtros inteligentes.',
    color: 'from-blue-500 to-cyan-500',
    position: 'right'
  },
  {
    icon: Workflow,
    title: 'Flow Builder Visual',
    description: 'Crie automações complexas com drag-and-drop. Sem código, sem complicação.',
    color: 'from-purple-500 to-pink-500',
    position: 'left'
  },
  {
    icon: Zap,
    title: 'Automações Inteligentes',
    description: 'Disparos automáticos de mensagens, follow-ups e nutrição de leads.',
    color: 'from-yellow-500 to-orange-500',
    position: 'right'
  },
  {
    icon: Calendar,
    title: 'Aniversários Automáticos',
    description: 'Nunca mais esqueça um aniversário. Mensagens personalizadas enviadas automaticamente.',
    color: 'from-red-500 to-pink-500',
    position: 'left'
  },
  {
    icon: BarChart3,
    title: 'Analytics e Relatórios',
    description: 'Acompanhe métricas em tempo real e tome decisões baseadas em dados.',
    color: 'from-indigo-500 to-purple-500',
    position: 'right'
  }
];

interface FeatureCardProps {
  feature: typeof features[0];
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: feature.position === 'left' ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`flex ${feature.position === 'right' ? 'justify-end' : 'justify-start'} mb-32`}
    >
      <div className={`w-full md:w-1/2 ${feature.position === 'right' ? 'md:pr-12' : 'md:pl-12'}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
        >
          {/* Icon */}
          <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed">
            {feature.description}
          </p>

          {/* Decorative gradient line */}
          <div className={`mt-6 h-1 w-20 rounded-full bg-gradient-to-r ${feature.color}`} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function FeaturesPath() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!pathRef.current) return;

      const element = pathRef.current;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calculate progress (0 to 1)
      const start = elementTop - windowHeight;
      const end = elementTop + elementHeight;
      const progress = Math.max(0, Math.min(1, (scrollY - start) / (end - start)));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="funcionalidades" className="relative py-32 bg-gradient-to-b from-white to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Funcionalidades
            </span>{' '}
            que Transformam
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar seu negócio em um só lugar
          </p>
        </motion.div>

        {/* Features with Path */}
        <div ref={pathRef} className="relative">
          {/* Animated Path */}
          <svg
            className="absolute left-1/2 top-0 transform -translate-x-1/2 hidden md:block"
            width="4"
            height="100%"
            style={{ zIndex: 0 }}
          >
            {/* Background path */}
            <line
              x1="2"
              y1="0"
              x2="2"
              y2="100%"
              stroke="#e5e7eb"
              strokeWidth="4"
            />
            {/* Animated glowing path */}
            <motion.line
              x1="2"
              y1="0"
              x2="2"
              y2="100%"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeDasharray="100%"
              initial={{ strokeDashoffset: "100%" }}
              style={{
                strokeDashoffset: `${100 - scrollProgress * 100}%`,
                filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.8))'
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
          </svg>

          {/* Nodes on path */}
          {features.map((_, index) => (
            <motion.div
              key={index}
              className="absolute left-1/2 transform -translate-x-1/2 hidden md:block"
              style={{
                top: `${(index / (features.length - 1)) * 100}%`,
                zIndex: 1
              }}
              initial={{ scale: 0 }}
              animate={{
                scale: scrollProgress * features.length > index ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-4 h-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-lg" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full"
                animate={{
                  scale: scrollProgress * features.length > index ? [1, 1.5, 1] : 1,
                  opacity: scrollProgress * features.length > index ? [1, 0, 1] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}

          {/* Feature Cards */}
          <div className="relative z-10">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
