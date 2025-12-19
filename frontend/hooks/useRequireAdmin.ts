'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

export function useRequireAdmin() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Aguardar o Zustand carregar do localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);

      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (user?.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  return {
    user,
    isAdmin: user?.role === 'ADMIN',
    isLoading
  };
}
