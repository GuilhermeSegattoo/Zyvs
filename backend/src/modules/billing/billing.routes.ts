import { FastifyInstance } from 'fastify';
import {
  createCheckout,
  createPortal,
  cancelSubscription,
  handleWebhook,
} from './billing.controller';
import { authenticate } from '../../middlewares/auth.middleware';

export async function billingRoutes(fastify: FastifyInstance) {
  // Rotas protegidas
  fastify.post('/checkout', { preHandler: [authenticate] }, createCheckout);
  fastify.post('/portal', { preHandler: [authenticate] }, createPortal);
  fastify.post('/cancel', { preHandler: [authenticate] }, cancelSubscription);

  // Webhook público (sem autenticação)
  fastify.post('/webhook', handleWebhook);
}
