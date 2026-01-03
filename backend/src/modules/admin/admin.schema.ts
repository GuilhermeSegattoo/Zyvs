import { z } from 'zod';
import { paginationWithSearchSchema, paginationSchema } from '../../lib/validators';

// Schema para filtros de listagem - usando schemas compartilhados
export const listUsersSchema = paginationWithSearchSchema;
export const listOrganizationsSchema = paginationSchema;

export type ListUsersInput = z.infer<typeof listUsersSchema>;
export type ListOrganizationsInput = z.infer<typeof listOrganizationsSchema>;
