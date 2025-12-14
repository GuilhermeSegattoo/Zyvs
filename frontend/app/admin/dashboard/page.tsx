'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  MessageSquare,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';
import { api } from '@/lib/api';

interface Stats {
  totalUsers: number;
  totalOrganizations: number;
  totalContacts: number;
  totalMessages: number;
  activeFlows: number;
  activeCampaigns: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrganizations: 0,
    totalContacts: 0,
    totalMessages: 0,
    activeFlows: 0,
    activeCampaigns: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total de Usuários',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      name: 'Organizações',
      value: stats.totalOrganizations,
      icon: Building2,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      name: 'Contatos',
      value: stats.totalContacts,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      name: 'Mensagens Enviadas',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      name: 'Flows Ativos',
      value: stats.activeFlows,
      icon: Zap,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
    },
    {
      name: 'Campanhas Ativas',
      value: stats.activeCampaigns,
      icon: Activity,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">
          Visão geral do sistema
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Atividades Recentes
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Sistema operando normalmente</p>
              <p className="text-xs text-gray-500">Todos os serviços ativos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.a
            href="/admin/users"
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition cursor-pointer"
          >
            <Users className="w-6 h-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">Gerenciar Usuários</p>
            <p className="text-sm text-gray-600">Ver e editar usuários</p>
          </motion.a>

          <motion.a
            href="/admin/organizations"
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
          >
            <Building2 className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Organizações</p>
            <p className="text-sm text-gray-600">Gerenciar organizações</p>
          </motion.a>

          <motion.a
            href="/admin/logs"
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition cursor-pointer"
          >
            <Activity className="w-6 h-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">Logs do Sistema</p>
            <p className="text-sm text-gray-600">Auditoria e logs</p>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
