import { z } from 'zod';
import { emailSchema, passwordSchema, nameSchema } from '../../lib/validators';

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  plan: z.enum(['TESTE_A', 'TESTE_B', 'TESTE_C']),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
