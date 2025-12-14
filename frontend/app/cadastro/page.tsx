'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import PasswordStrength, { isPasswordStrong } from '@/components/auth/PasswordStrength';
import { ArrowLeft, Eye, EyeOff, Sparkles, CheckCircle2, Zap } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
}).refine((data) => isPasswordStrong(data.password), {
  message: 'Senha muito fraca. Use letras maiúsculas, minúsculas, números e caracteres especiais',
  path: ['password'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function CadastroPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      setIsLoading(true);

      const { confirmPassword, ...registerData } = data;
      const response = await api.post('/api/auth/register', registerData);
      const { user, token } = response.data;

      setAuth(user, token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-300 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-2xl border border-white/30">
                Z
              </div>
              <span className="text-3xl font-bold text-white">Zyva</span>
            </motion.div>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Comece grátis hoje mesmo
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Junte-se a milhares de empresas que já transformaram seu relacionamento com clientes.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/20">
              <Sparkles className="w-4 h-4" />
              14 dias grátis, sem cartão de crédito
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3 text-white">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-1">Setup em minutos</div>
                <div className="text-purple-100 text-sm">Configure tudo rapidamente e comece a usar hoje</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-1">Suporte dedicado</div>
                <div className="text-purple-100 text-sm">Nossa equipe está sempre pronta para ajudar</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-1">Cancele quando quiser</div>
                <div className="text-purple-100 text-sm">Sem contratos ou taxas de cancelamento</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-purple-100 text-sm">
          © 2024 Zyva. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  Z
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Zyva
                </span>
              </div>
            </Link>
          </div>

          {/* Back button */}
          <Link href="/">
            <motion.button
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Voltar</span>
            </motion.button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Criar sua conta
            </h1>
            <p className="text-gray-600">
              Preencha os dados para começar
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Seu nome"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Crie uma senha forte"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
              <PasswordStrength password={password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Digite a senha novamente"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="text-xs text-gray-500">
              Ao criar uma conta, você concorda com nossos{' '}
              <a href="#" className="text-purple-600 hover:underline">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="#" className="text-purple-600 hover:underline">
                Política de Privacidade
              </a>
              .
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Criando conta...
                </span>
              ) : (
                'Criar conta grátis'
              )}
            </motion.button>

            {/* Login link */}
            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-purple-600 font-semibold hover:text-purple-700 transition">
                Fazer login
              </Link>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
