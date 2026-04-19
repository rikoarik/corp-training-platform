import type { FastifyPluginAsync } from 'fastify';
import * as participantController from './participant.controller';
import { authMiddleware } from '../auth/auth.middleware';

const participantRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/register', async (request, reply) =>
    participantController.register(request as never, reply),
  );
  fastify.get('/', { preHandler: [authMiddleware] }, async (request, reply) =>
    participantController.list(request as never, reply),
  );
};

export default participantRoutes;
