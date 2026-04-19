import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const swaggerPlugin: FastifyPluginAsync = async (app) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Corporate Training Platform API',
        description: 'API documentation for frontend public pages, auth, admin, and training management.',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://127.0.0.1:4000/api',
          description: 'Local development server',
        },
      ],
      tags: [
        { name: 'health', description: 'Service health endpoints' },
        { name: 'auth', description: 'Authentication endpoints' },
        { name: 'public', description: 'Public website endpoints' },
        { name: 'admin', description: 'Admin back office endpoints' },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
};

export default fp(swaggerPlugin);
