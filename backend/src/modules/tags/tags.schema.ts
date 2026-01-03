import { z } from 'zod';
import { paginationWithSearchSchema } from '../../lib/validators';

// Schema para criar/atualizar tag
export const tagSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome muito longo'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida (use formato hex: #RRGGBB)'),
  description: z.string().max(255).optional(),
});

// Schema para listagem
export const listTagsSchema = paginationWithSearchSchema;

// Types
export type TagInput = z.infer<typeof tagSchema>;
export type ListTagsInput = z.infer<typeof listTagsSchema>;
