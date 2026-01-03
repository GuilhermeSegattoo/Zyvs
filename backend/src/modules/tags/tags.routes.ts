import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/auth.middleware';
import {
  listTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  addTagToContact,
  removeTagFromContact,
} from './tags.controller';

export async function tagsRoutes(fastify: FastifyInstance) {
  // CRUD de tags (requer autenticação)
  fastify.get('/', { preHandler: authenticate }, listTags);
  fastify.get('/:id', { preHandler: authenticate }, getTag);
  fastify.post('/', { preHandler: authenticate }, createTag);
  fastify.put('/:id', { preHandler: authenticate }, updateTag);
  fastify.delete('/:id', { preHandler: authenticate }, deleteTag);
}

export async function contactTagsRoutes(fastify: FastifyInstance) {
  // Gerenciar tags de contatos (requer autenticação)
  fastify.post('/:contactId/tags', { preHandler: authenticate }, addTagToContact);
  fastify.delete('/:contactId/tags/:tagId', { preHandler: authenticate }, removeTagFromContact);
}
