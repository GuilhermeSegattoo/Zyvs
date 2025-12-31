import { stripe, STRIPE_PRICES } from '../../lib/stripe';
import { prisma } from '../../lib/prisma';
import { Plan } from '@prisma/client';

export class BillingService {
  /**
   * Cria Customer no Stripe quando usuário registra
   */
  async createCustomer(userId: string, email: string, name: string) {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    // Salvar Stripe Customer ID no banco
    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: customer.id,
      },
    });

    return customer;
  }

  /**
   * Cria sessão de checkout para upgrade de plano
   */
  async createCheckoutSession(userId: string, plan: Plan) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Criar customer se não existir
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await this.createCustomer(userId, user.email, user.name);
      customerId = customer.id;
    }

    // Pegar Price ID do plano
    const priceId = STRIPE_PRICES[plan];
    if (!priceId) {
      throw new Error('Plano inválido');
    }

    // Criar checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/login?checkout=success`,
      cancel_url: `${process.env.FRONTEND_URL}/cadastro?checkout=canceled`,
      metadata: {
        userId,
        plan,
      },
      subscription_data: {
        metadata: {
          userId,
          plan,
        },
        trial_period_days: 14, // 14 dias grátis
      },
    });

    return session;
  }

  /**
   * Cria Customer Portal para gerenciar assinatura
   */
  async createPortalSession(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.stripeCustomerId) {
      throw new Error('Cliente Stripe não encontrado');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard/settings`,
    });

    return session;
  }

  /**
   * Cancela assinatura
   */
  async cancelSubscription(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.stripeSubscriptionId) {
      throw new Error('Assinatura não encontrada');
    }

    // Cancelar no final do período
    const subscription = await stripe.subscriptions.update(
      user.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    return subscription;
  }

  /**
   * Atualiza plano do usuário após pagamento confirmado
   */
  async updateUserPlan(userId: string, plan: Plan, subscriptionId: string) {
    // Definir limites baseado no plano
    const limits = {
      FREE: { maxContacts: 100, maxFlows: 2, maxMessages: 500 },
      TESTE_A: { maxContacts: 1000, maxFlows: 5, maxMessages: 2000 },
      TESTE_B: { maxContacts: 5000, maxFlows: 15, maxMessages: 10000 },
      TESTE_C: { maxContacts: 10000, maxFlows: 30, maxMessages: 25000 },
      // Manter compatibilidade com planos antigos
      PRO: { maxContacts: 5000, maxFlows: 15, maxMessages: 15000 },
      BUSINESS: { maxContacts: 50000, maxFlows: 50, maxMessages: 100000 },
      ENTERPRISE: { maxContacts: 999999, maxFlows: 999, maxMessages: 999999 },
    };

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan,
        stripeSubscriptionId: subscriptionId,
        planExpiry: null, // Subscription ativa não expira até cancelar
        ...limits[plan],
      },
    });
  }

  /**
   * Processa webhook do Stripe
   */
  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan as Plan;
        const subscriptionId = session.subscription as string;

        if (userId && plan && subscriptionId) {
          await this.updateUserPlan(userId, plan, subscriptionId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          // Verificar se foi cancelada
          if (subscription.cancel_at_period_end) {
            // Agendar downgrade para FREE na data de cancelamento
            const cancelAt = new Date(subscription.cancel_at! * 1000);
            await prisma.user.update({
              where: { id: userId },
              data: {
                planExpiry: cancelAt,
              },
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          // Downgrade para FREE
          await this.updateUserPlan(userId, 'FREE', '');
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Buscar usuário pelo customer ID
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          // TODO: Enviar email avisando sobre falha no pagamento
          console.log(`❌ Pagamento falhou para usuário ${user.email}`);
        }
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }
  }
}
