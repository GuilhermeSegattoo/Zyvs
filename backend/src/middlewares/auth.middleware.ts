import { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ error: 'Não autenticado' });
  }
}

export function requireRole(role: 'ADMIN' | 'LOJA') {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.user.role !== role) {
      return reply.status(403).send({ error: 'Acesso negado' });
    }
  };
}
