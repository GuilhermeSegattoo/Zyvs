import { FastifyRequest, FastifyReply } from 'fastify';
import { BillingService } from './billing.service';
import { z } from 'zod';
import { stripe } from '../../lib/stripe';

const billingService = new BillingService();

const checkoutSchema = z.object({
  plan: z.enum(['FREE', 'TESTE_A', 'TESTE_B', 'TESTE_C', 'PRO', 'BUSINESS', 'ENTERPRISE']),
});

/**
 * POST /api/billing/checkout
 * Cria sessão de checkout
 */
export async function createCheckout(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { plan } = checkoutSchema.parse(req.body);
    const userId = req.user.userId;

    const session = await billingService.createCheckoutSession(userId, plan);

    return reply.send({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    return reply.status(400).send({ error: error.message });
  }
}

/**
 * POST /api/billing/portal
 * Cria sessão do Customer Portal
 */
export async function createPortal(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user.userId;
    const session = await billingService.createPortalSession(userId);

    return reply.send({
      url: session.url,
    });
  } catch (error: any) {
    return reply.status(400).send({ error: error.message });
  }
}

/**
 * POST /api/billing/cancel
 * Cancela assinatura
 */
export async function cancelSubscription(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user.userId;
    const subscription = await billingService.cancelSubscription(userId);

    return reply.send({
      message: 'Assinatura cancelada com sucesso',
      cancelAt: new Date(subscription.cancel_at! * 1000),
    });
  } catch (error: any) {
    return reply.status(400).send({ error: error.message });
  }
}

/**
 * POST /api/billing/webhook
 * Recebe webhooks do Stripe
 */
export async function handleWebhook(req: FastifyRequest, reply: FastifyReply) {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    return reply.status(400).send({ error: 'Stripe signature ausente' });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      (req as any).rawBody as Buffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await billingService.handleWebhook(event);

    return reply.send({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    return reply.status(400).send({ error: error.message });
  }
}
