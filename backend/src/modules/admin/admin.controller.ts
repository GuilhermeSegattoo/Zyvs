import { FastifyRequest, FastifyReply } from 'fastify';
import { AdminService } from './admin.service';

const adminService = new AdminService();

/**
 * GET /api/admin/stats
 * Retorna estatísticas globais do sistema
 */
export async function getStats(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await adminService.getStats();
    return reply.send(stats);
  } catch (error: any) {
    return reply.status(500).send({
      error: 'Erro ao buscar estatísticas',
      message: error.message,
    });
  }
}

/**
 * GET /api/admin/users
 * Lista todos os usuários
 */
export async function listUsers(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { page = 1, limit = 10, search } = req.query as any;

    const result = await adminService.listUsers(
      Number(page),
      Number(limit),
      search
    );

    return reply.send(result);
  } catch (error: any) {
    return reply.status(500).send({
      error: 'Erro ao listar usuários',
      message: error.message,
    });
  }
}

/**
 * GET /api/admin/users/:id
 * Busca detalhes de um usuário
 */
export async function getUserById(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const user = await adminService.getUserById(id);
    return reply.send(user);
  } catch (error: any) {
    return reply.status(404).send({
      error: 'Usuário não encontrado',
      message: error.message,
    });
  }
}

/**
 * GET /api/admin/organizations
 * Lista todas as organizações
 */
export async function listOrganizations(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { page = 1, limit = 10 } = req.query as any;

    const result = await adminService.listOrganizations(
      Number(page),
      Number(limit)
    );

    return reply.send(result);
  } catch (error: any) {
    return reply.status(500).send({
      error: 'Erro ao listar organizações',
      message: error.message,
    });
  }
}

/**
 * GET /api/admin/organizations/:id
 * Busca detalhes de uma organização
 */
export async function getOrganizationById(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = req.params as { id: string };
    const organization = await adminService.getOrganizationById(id);
    return reply.send(organization);
  } catch (error: any) {
    return reply.status(404).send({
      error: 'Organização não encontrada',
      message: error.message,
    });
  }
}
