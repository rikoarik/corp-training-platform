import type { FastifyPluginAsync } from 'fastify';
import { routePrefix } from '../config/constants';
import healthRoute from './health.route';
import authRouteGroup from './auth.route';
import publicRouteGroup from './public.route';
import adminRouteGroup from './admin.route';

const routes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(healthRoute, { prefix: routePrefix.health });
  await fastify.register(authRouteGroup, { prefix: routePrefix.auth });
  await fastify.register(publicRouteGroup, { prefix: routePrefix.public });
  await fastify.register(adminRouteGroup, { prefix: routePrefix.admin });
};

export default routes;
