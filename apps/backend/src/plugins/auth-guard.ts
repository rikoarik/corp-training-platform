import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { unauthorized } from '../common/errors/http-error';

const authGuardPlugin: FastifyPluginAsync = async (app) => {
  app.decorate('authenticate', async (request: FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch {
      throw unauthorized('Unauthorized');
    }
  });
};

export default authGuardPlugin;
