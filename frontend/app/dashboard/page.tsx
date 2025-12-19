'use client';

import { useAuthStore } from '@/stores/auth';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  TrendingUp,
  Zap,
  Calendar,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    {
      name: 'Total de Contatos',
      value: user?.organization?.currentContacts || 0,
      max: user?.organization?.maxContacts || 100,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      name: 'Flows Ativos',
      value: user?.organization?.currentFlows || 0,
      max: user?.organization?.maxFlows || 3,
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      name: 'Mensagens Este Mês',
      value: user?.organization?.messagesThisMonth || 0,
      max: user?.organization?.maxMessagesPerMonth || 500,
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      name: 'Taxa de Conversão',
      value: '0%',
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
  ];

  const quickActions = [
    {
      icon: Users,
      title: 'Adicionar Contatos',
      description: 'Importe seus contatos ou adicione manualmente',
      href: '/clientes/novo',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Criar Automação',
      description: 'Configure fluxos inteligentes de mensagens',
      href: '/automacoes/novo',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: MessageSquare,
      title: 'Nova Campanha',
      description: 'Envie mensagens em massa para seus clientes',
      href: '/campanhas/nova/mensagem',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-2">
          Bem-vindo de volta, {user?.name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-purple-100">
          {user?.role === 'ADMIN'
            ? 'Você tem acesso total ao sistema. Use o botão "Painel Admin" na sidebar para gerenciar tudo.'
            : 'Aqui está um resumo do seu negócio hoje.'}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {stat.name}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">
                {typeof stat.value === 'number'
                  ? stat.value.toLocaleString()
                  : stat.value}
              </p>
              {stat.max && (
                <p className="text-sm text-gray-500">/ {stat.max}</p>
              )}
            </div>
            {stat.max && typeof stat.value === 'number' && (
              <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                  style={{
                    width: `${Math.min((stat.value / stat.max) * 100, 100)}%`,
                  }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link key={action.title} href={action.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-300 transition-all cursor-pointer group"
              >
                <div
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${action.color} mb-4`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {action.description}
                </p>
                <span className="text-sm text-purple-600 font-medium group-hover:underline">
                  Em breve →
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Organization Info */}
      {user?.organization && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sua Organização
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Nome</p>
              <p className="font-medium text-gray-900">
                {user.organization.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Plano</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {user.organization.plan || 'FREE'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Slug</p>
              <p className="font-medium text-gray-900">
                {user.organization.slug}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
