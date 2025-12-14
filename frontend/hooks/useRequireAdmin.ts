'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

export function useRequireAdmin() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  return { user, isAdmin: user?.role === 'ADMIN' };
}
