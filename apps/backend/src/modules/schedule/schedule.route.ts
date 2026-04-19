import type { FastifyPluginAsync } from 'fastify';
import * as scheduleController from './schedule.controller';
import { authMiddleware } from '../auth/auth.middleware';

const scheduleRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => scheduleController.listPublic(request as never, reply));
  fastify.get('/:id', async (request, reply) => scheduleController.getPublicById(request as never, reply));
  fastify.post('/', { preHandler: [authMiddleware] }, async (request, reply) =>
    scheduleController.create(request as never, reply),
  );
  fastify.patch('/:id', { preHandler: [authMiddleware] }, async (request, reply) =>
    scheduleController.update(request as never, reply),
  );
  fastify.delete('/:id', { preHandler: [authMiddleware] }, async (request, reply) =>
    scheduleController.remove(request as never, reply),
  );
};

export default scheduleRoutes;
