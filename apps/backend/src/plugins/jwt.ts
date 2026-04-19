import type { FastifyPluginAsync } from 'fastify';
import jwt from '@fastify/jwt';
import { env } from '../config/env';

const jwtPlugin: FastifyPluginAsync = async (app) => {
  await app.register(jwt, {
    secret: env.jwtSecret,
  });
};

export default jwtPlugin;
