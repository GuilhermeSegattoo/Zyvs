'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Zap,
  Columns3,
  MessageSquare,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Automações', href: '/automacoes', icon: Zap },
  { name: 'Pipeline', href: '/pipeline', icon: Columns3 },
  { name: 'Campanhas', href: '/campanhas', icon: MessageSquare },
];

const settingsItem = {
  name: 'Configurações',
  href: '/configuracoes',
  icon: Settings,
};

const adminItem = {
  name: 'Painel Admin',
  href: '/admin/dashboard',
  icon: Shield,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link href="/dashboard">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                T
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Thumdra
                </span>
                <span className="block text-xs text-gray-500">
                  {user.organization?.name || 'Dashboard'}
                </span>
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}

          {/* Separador */}
          <div className="my-4 border-t border-gray-200"></div>

          {/* Configurações */}
          <Link href={settingsItem.href}>
            <motion.div
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname.startsWith(settingsItem.href)
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <settingsItem.icon className="w-5 h-5" />
              <span className="font-medium">{settingsItem.name}</span>
            </motion.div>
          </Link>
        </nav>

        {/* User info and admin/logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                  {user.role === 'ADMIN' ? 'Administrador' : 'Lojista'}
                </span>
                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                  {user.plan || 'FREE'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {/* Botão Admin - só aparece para ADMIN */}
            {user.role === 'ADMIN' && (
              <Link href={adminItem.href}>
                <button className="w-full px-4 py-2 text-sm text-left bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg transition hover:shadow-lg flex items-center gap-2 font-medium">
                  <Shield className="w-4 h-4" />
                  {adminItem.name}
                </button>
              </Link>
            )}

            <button
              onClick={logout}
              className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 lg:flex-none">
            <h1 className="text-xl font-semibold text-gray-900">
              {navigation.find((item) => pathname === item.href)?.name ||
                'Dashboard'}
            </h1>
          </div>

          {/* User avatar (mobile) */}
          <div className="lg:hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
