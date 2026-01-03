import { z } from 'zod';

// ============================================
// VALIDADORES BASE REUTILIZÁVEIS
// ============================================

/**
 * Validação de email padronizada
 */
export const emailSchema = z.string().email('Email inválido');

/**
 * Validação de senha com requisitos mínimos
 */
export const passwordSchema = z.string().min(6, 'Senha deve ter no mínimo 6 caracteres');

/**
 * Validação de nome com tamanho mínimo
 */
export const nameSchema = z.string().min(3, 'Nome deve ter no mínimo 3 caracteres');

/**
 * Validação de telefone brasileiro (opcional)
 */
export const phoneSchema = z.string().optional().refine(
  (val) => !val || /^[\d\s\-()+ ]+$/.test(val),
  { message: 'Telefone inválido' }
);

/**
 * Validação de CPF (opcional, apenas formato)
 */
export const cpfSchema = z.string().optional().refine(
  (val) => !val || /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(val),
  { message: 'CPF inválido' }
);

// ============================================
// SCHEMAS DE PAGINAÇÃO REUTILIZÁVEIS
// ============================================

/**
 * Schema base para paginação
 */
export const paginationSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
});

/**
 * Schema de paginação com busca
 */
export const paginationWithSearchSchema = paginationSchema.extend({
  search: z.string().optional(),
});

// ============================================
// SCHEMAS DE RESPOSTA PADRONIZADOS
// ============================================

/**
 * Schema para resposta paginada
 */
export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  });

/**
 * Schema para resposta de erro
 */
export const errorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
});

// ============================================
// HELPERS DE VALIDAÇÃO
// ============================================

/**
 * Valida e transforma query params de paginação
 */
export function parsePaginationParams(query: unknown) {
  const parsed = paginationWithSearchSchema.safeParse(query);
  if (!parsed.success) {
    return { page: 1, limit: 10, search: undefined };
  }
  return parsed.data;
}

/**
 * Calcula metadados de paginação
 */
export function getPaginationMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================
// TYPES EXPORTADOS
// ============================================

export type PaginationInput = z.infer<typeof paginationSchema>;
export type PaginationWithSearchInput = z.infer<typeof paginationWithSearchSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
