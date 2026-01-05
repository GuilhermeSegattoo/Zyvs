import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag para evitar múltiplos logouts simultâneos
let isLoggingOut = false;

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('thumdra-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Só fazer logout se:
    // 1. For realmente erro 401
    // 2. Não estiver já fazendo logout (evita race conditions)
    // 3. Erro for especificamente de token inválido/expirado (verificar mensagem do backend)
    if (
      error.response?.status === 401 &&
      !isLoggingOut &&
      typeof window !== 'undefined'
    ) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || '';

      // Verifica se é realmente um erro de autenticação (token expirado/inválido)
      // Se o backend retornar essa mensagem específica, é sessão expirada
      const isAuthError =
        errorMessage.includes('Token inválido') ||
        errorMessage.includes('Token expirado') ||
        errorMessage.includes('Token não fornecido') ||
        errorMessage.includes('Não autorizado') ||
        error.response?.status === 401;

      if (isAuthError) {
        isLoggingOut = true;

        try {
          // Importa dinamicamente o store para evitar circular dependencies
          const { useAuthStore } = await import('@/stores/auth');
          const { logout } = useAuthStore.getState();

          // Usa o método de logout do Zustand que já limpa o estado corretamente
          logout();

          // Pequeno delay antes de redirecionar para garantir que o estado foi limpo
          setTimeout(() => {
            window.location.href = '/login';
            isLoggingOut = false;
          }, 100);
        } catch (err) {
          // Fallback: se algo der errado, limpa manualmente
          localStorage.removeItem('thumdra-token');
          localStorage.removeItem('thumdra-user');
          window.location.href = '/login';
          isLoggingOut = false;
        }
      }
    }

    return Promise.reject(error);
  }
);
