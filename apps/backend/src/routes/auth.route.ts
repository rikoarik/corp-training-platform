import type { FastifyPluginAsync } from 'fastify';
import authRoutes from '../modules/auth/auth.route';

const authRouteGroup: FastifyPluginAsync = async (app) => {
  await app.register(authRoutes);
};

export default authRouteGroup;
