import type { FastifyPluginAsync } from 'fastify';
import * as trainingController from './training.controller';
import { authMiddleware } from '../auth/auth.middleware';

const trainingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => trainingController.listPublic(request as never, reply));
  fastify.get('/:slug', async (request, reply) => trainingController.getPublicBySlug(request as never, reply));
  fastify.post('/', { preHandler: [authMiddleware] }, async (request, reply) =>
    trainingController.create(request as never, reply),
  );
  fastify.patch('/:id', { preHandler: [authMiddleware] }, async (request, reply) =>
    trainingController.update(request as never, reply),
  );
  fastify.delete('/:id', { preHandler: [authMiddleware] }, async (request, reply) =>
    trainingController.remove(request as never, reply),
  );
};

export default trainingRoutes;
