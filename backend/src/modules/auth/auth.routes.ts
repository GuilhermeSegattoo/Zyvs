import { FastifyInstance } from 'fastify';
import { register, login, me } from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

export async function authRoutes(fastify: FastifyInstance) {
  // Públicas
  fastify.post('/register', register);
  fastify.post('/login', login);

  // Protegidas
  fastify.get('/me', { preHandler: [authenticate] }, me);
}
