import type { FastifyPluginAsync } from 'fastify';
import * as usersController from './users.controller';
import {
  createUserBodySchema,
  messageOnlySuccessSchema,
  updateUserBodySchema,
  updateUserPasswordBodySchema,
  userSuccessSchema,
  usersListSuccessSchema,
} from './users.schema';

const userIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
} as const;

const usersRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', {
    schema: {
      response: { 200: usersListSuccessSchema },
    },
    handler: usersController.list,
  });

  app.post('/', {
    schema: {
      body: createUserBodySchema,
      response: { 201: userSuccessSchema },
    },
    handler: usersController.create,
  });

  app.patch('/:id', {
    schema: {
      params: userIdParamsSchema,
      body: updateUserBodySchema,
      response: { 200: userSuccessSchema },
    },
    handler: usersController.update,
  });

  app.patch('/:id/password', {
    schema: {
      params: userIdParamsSchema,
      body: updateUserPasswordBodySchema,
      response: { 200: messageOnlySuccessSchema },
    },
    handler: usersController.updatePassword,
  });
};

export default usersRoutes;
