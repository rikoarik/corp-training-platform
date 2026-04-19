import type { FastifyPluginAsync } from 'fastify';
import multipart from '@fastify/multipart';

const multipartPlugin: FastifyPluginAsync = async (app) => {
  await app.register(multipart);
};

export default multipartPlugin;
