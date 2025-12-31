'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  LogOut,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { useRequireAdmin } from '@/hooks/useRequireAdmin';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Usuários', href: '/admin/users', icon: Users },
  { name: 'Organizações', href: '/admin/organizations', icon: Building2 },
  { name: 'Logs', href: '/admin/logs', icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { isAdmin, isLoading } = useRequireAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-[#ff3366] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-sm">
            {isLoading ? 'Carregando...' : 'Verificando permissões...'}
          </p>
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-black transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b-2 border-black">
          <Link href="/admin/dashboard">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <span className="text-[#ff3366] font-bold text-lg">T</span>
              </div>
              <div>
                <span className="text-lg font-bold text-black">
                  Thumdra
                </span>
                <span className="block text-xs font-bold text-gray-600 uppercase">
                  Admin
                </span>
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-600 hover:text-black transition"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                    isActive
                      ? 'bg-[#ff3366] text-white border-l-4 border-black'
                      : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
                  }`}
                >
                  <item.icon className="w-5 h-5" strokeWidth={2} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-black bg-white">
          <div className="mb-4 px-2">
            <p className="text-sm font-bold text-black truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs font-bold bg-[#ff3366] text-white">
              ADMIN
            </span>
          </div>

          <div className="space-y-2">
            <Link href="/dashboard">
              <button className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2 font-medium justify-center">
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                Dashboard Normal
              </button>
            </Link>

            <button
              onClick={logout}
              className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2 font-medium justify-center"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-16 bg-white border-b-2 border-black flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-black transition"
          >
            <Menu className="w-6 h-6" strokeWidth={2} />
          </button>

          <div className="flex-1 lg:flex-none">
            <h1 className="text-lg font-bold text-black">
              Painel Administrativo
            </h1>
          </div>

          {/* Admin Badge */}
          <div className="hidden lg:block">
            <span className="px-3 py-1 bg-[#ff3366] text-white text-xs font-bold uppercase">
              ADMIN
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
