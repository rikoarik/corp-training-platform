import Fastify from 'fastify';
import { apiPrefix } from './config/constants';
import { errorHandler } from './common/errors/error-handler';
import corsPlugin from './plugins/cors';
import jwtPlugin from './plugins/jwt';
import authGuardPlugin from './plugins/auth-guard';
import prismaPlugin from './plugins/prisma';
import multipartPlugin from './plugins/multipart';
import staticPlugin from './plugins/static';
import swaggerPlugin from './plugins/swagger';
import routes from './routes/index';

export function buildApp() {
  const app = Fastify({ logger: true });

  void app.register(corsPlugin);
  void app.register(swaggerPlugin);
  void app.register(jwtPlugin);
  void app.register(prismaPlugin);
  void app.register(multipartPlugin);
  void app.register(staticPlugin);
  void app.register(authGuardPlugin);
  void app.register(routes, { prefix: apiPrefix });

  app.setErrorHandler(errorHandler);

  return app;
}
