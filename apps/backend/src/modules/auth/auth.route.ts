import type { FastifyPluginAsync } from 'fastify';
import * as authController from './auth.controller';
import { unauthorized } from '../../common/errors/http-error';
import {
  authSuccessSchema,
  loginBodySchema,
  meSuccessSchema,
  registerBodySchema,
} from './auth.schema';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/register', {
    schema: {
      body: registerBodySchema,
      response: { 201: authSuccessSchema },
    },
    handler: authController.register,
  });

  fastify.post('/login', {
    schema: {
      body: loginBodySchema,
      response: { 200: authSuccessSchema },
    },
    handler: authController.login,
  });

  fastify.get('/me', {
    preHandler: [
      async (request) => {
        try {
          await request.jwtVerify();
        } catch {
          throw unauthorized('Unauthorized');
        }
      },
    ],
    schema: {
      response: { 200: meSuccessSchema },
    },
    handler: authController.me,
  });
};

export default authRoutes;
