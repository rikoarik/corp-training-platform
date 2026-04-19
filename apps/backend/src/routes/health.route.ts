import type { FastifyPluginAsync } from 'fastify';
import { sendSuccess } from '../common/utils/api-response';

const healthRoute: FastifyPluginAsync = async (app) => {
  app.get('/', {
    schema: {
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          required: ['success', 'message', 'data'],
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              required: ['status', 'timestamp'],
              properties: {
                status: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  }, async (_request, reply) =>
    sendSuccess(reply, 200, 'Service is healthy', {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }),
  );
};

export default healthRoute;
