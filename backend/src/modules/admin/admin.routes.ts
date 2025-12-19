import { FastifyInstance } from 'fastify';
import {
  getStats,
  listUsers,
  getUserById,
  listOrganizations,
  getOrganizationById,
} from './admin.controller';
import { requireAdmin } from '../../middlewares/auth.middleware';

export async function adminRoutes(fastify: FastifyInstance) {
  // Todas as rotas admin requerem autenticação + role ADMIN
  fastify.addHook('preHandler', requireAdmin);

  // Estatísticas
  fastify.get('/stats', getStats);

  // Usuários
  fastify.get('/users', listUsers);
  fastify.get('/users/:id', getUserById);

  // Organizações
  fastify.get('/organizations', listOrganizations);
  fastify.get('/organizations/:id', getOrganizationById);
}
