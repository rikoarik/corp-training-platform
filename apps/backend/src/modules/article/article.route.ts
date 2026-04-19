import type { FastifyPluginAsync } from 'fastify';
import * as articleController from './article.controller';
import { authMiddleware } from '../auth/auth.middleware';

const articleRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => articleController.list(request as never, reply));
  fastify.get('/latest', async (request, reply) => articleController.latest(request as never, reply));
  fastify.get('/popular', async (request, reply) => articleController.popular(request as never, reply));
  fastify.get('/:slug', async (request, reply) => articleController.getBySlug(request as never, reply));
  fastify.post('/', { preHandler: [authMiddleware] }, async (request, reply) =>
    articleController.create(request as never, reply),
  );
  fastify.patch('/:id', { preHandler: [authMiddleware] }, async (request, reply) =>
    articleController.update(request as never, reply),
  );
  fastify.patch('/:id/publish', { preHandler: [authMiddleware] }, async (request, reply) =>
    articleController.publish(request as never, reply),
  );
  fastify.patch('/:id/archive', { preHandler: [authMiddleware] }, async (request, reply) =>
    articleController.archive(request as never, reply),
  );
  fastify.delete('/:id', { preHandler: [authMiddleware] }, async (request, reply) =>
    articleController.remove(request as never, reply),
  );
};

export default articleRoutes;
