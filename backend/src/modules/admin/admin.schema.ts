import { z } from 'zod';

// Schema para filtros de listagem
export const listUsersSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  search: z.string().optional(),
});

export const listOrganizationsSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});

export type ListUsersInput = z.infer<typeof listUsersSchema>;
export type ListOrganizationsInput = z.infer<typeof listOrganizationsSchema>;
