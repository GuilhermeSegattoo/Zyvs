import { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch (err: any) {
    // Padronizar mensagens de erro para o frontend identificar corretamente
    let errorMessage = 'Token inválido ou expirado';

    // Verificar o tipo específico de erro JWT
    if (err.message?.includes('expired')) {
      errorMessage = 'Token expirado';
    } else if (err.message?.includes('invalid')) {
      errorMessage = 'Token inválido';
    } else if (err.message?.includes('malformed')) {
      errorMessage = 'Token inválido';
    } else if (!req.headers.authorization) {
      errorMessage = 'Token não fornecido';
    }

    return reply.status(401).send({
      error: errorMessage,
      message: errorMessage, // Enviar em ambos os campos para compatibilidade
    });
  }
}

/**
 * Middleware específico para proteger rotas de administrador
 */
export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();

    // Verificar se é ADMIN
    if (req.user.role !== 'ADMIN') {
      return reply.status(403).send({
        error: 'Acesso negado. Apenas administradores podem acessar este recurso.',
      });
    }
  } catch (err: any) {
    // Padronizar mensagens de erro
    let errorMessage = 'Token inválido ou expirado';

    if (err.message?.includes('expired')) {
      errorMessage = 'Token expirado';
    } else if (err.message?.includes('invalid')) {
      errorMessage = 'Token inválido';
    } else if (err.message?.includes('malformed')) {
      errorMessage = 'Token inválido';
    } else if (!req.headers.authorization) {
      errorMessage = 'Token não fornecido';
    }

    return reply.status(401).send({
      error: errorMessage,
      message: errorMessage,
    });
  }
}

export function requireRole(role: 'ADMIN' | 'LOJA') {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.user.role !== role) {
      return reply.status(403).send({ error: 'Acesso negado' });
    }
  };
}
