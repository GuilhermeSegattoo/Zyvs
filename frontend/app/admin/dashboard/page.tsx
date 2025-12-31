'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  MessageSquare,
  TrendingUp,
  Activity,
  Zap,
  ArrowRight
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
      name: 'Usuários',
      value: stats.totalUsers,
      icon: Users,
      color: '#00ff88',
    },
    {
      name: 'Organizações',
      value: stats.totalOrganizations,
      icon: Building2,
      color: '#ff3366',
    },
    {
      name: 'Contatos',
      value: stats.totalContacts,
      icon: Users,
      color: '#ffeb3b',
    },
    {
      name: 'Mensagens',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: '#00ff88',
    },
    {
      name: 'Flows',
      value: stats.activeFlows,
      icon: Zap,
      color: '#ff3366',
    },
    {
      name: 'Campanhas',
      value: stats.activeCampaigns,
      icon: Activity,
      color: '#ffeb3b',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-[#00ff88] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-sm">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-black mb-2">
          Painel Admin
        </h1>
        <p className="text-gray-600 font-medium">
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
            className="bg-white border-2 border-black p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: stat.color }}
              >
                <stat.icon className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                {stat.name}
              </p>
            </div>
            <p className="text-3xl font-bold text-black">
              {stat.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white border-2 border-black p-6">
        <h2 className="text-2xl font-bold text-black mb-6">
          Atividades Recentes
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-gray-50">
            <div className="w-3 h-3 bg-[#00ff88] rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-black">Sistema operando normalmente</p>
              <p className="text-xs text-gray-600">Todos os serviços ativos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.a
            href="/admin/users"
            whileHover={{ y: -4 }}
            className="bg-white border-2 border-gray-200 hover:border-black p-6 transition cursor-pointer group"
          >
            <Users className="w-8 h-8 text-black mb-4" strokeWidth={2} />
            <p className="font-bold text-black mb-2">Gerenciar Usuários</p>
            <p className="text-sm text-gray-600 mb-4">Ver e editar usuários</p>
            <span className="text-sm font-bold text-black group-hover:text-[#00ff88] transition flex items-center gap-2">
              Acessar
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </span>
          </motion.a>

          <motion.a
            href="/admin/organizations"
            whileHover={{ y: -4 }}
            className="bg-white border-2 border-gray-200 hover:border-black p-6 transition cursor-pointer group"
          >
            <Building2 className="w-8 h-8 text-black mb-4" strokeWidth={2} />
            <p className="font-bold text-black mb-2">Organizações</p>
            <p className="text-sm text-gray-600 mb-4">Gerenciar organizações</p>
            <span className="text-sm font-bold text-black group-hover:text-[#00ff88] transition flex items-center gap-2">
              Acessar
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </span>
          </motion.a>

          <motion.a
            href="/admin/logs"
            whileHover={{ y: -4 }}
            className="bg-white border-2 border-gray-200 hover:border-black p-6 transition cursor-pointer group"
          >
            <Activity className="w-8 h-8 text-black mb-4" strokeWidth={2} />
            <p className="font-bold text-black mb-2">Logs do Sistema</p>
            <p className="text-sm text-gray-600 mb-4">Auditoria e logs</p>
            <span className="text-sm font-bold text-black group-hover:text-[#00ff88] transition flex items-center gap-2">
              Acessar
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </span>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
