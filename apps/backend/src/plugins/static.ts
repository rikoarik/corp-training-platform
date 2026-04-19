import type { FastifyPluginAsync } from 'fastify';
import fastifyStatic from '@fastify/static';
import { resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
import { env } from '../config/env';

const staticPlugin: FastifyPluginAsync = async (app) => {
  mkdirSync(resolve(env.uploadDir), { recursive: true });
  await app.register(fastifyStatic, {
    root: resolve(env.uploadDir),
    prefix: '/uploads/',
  });
};

export default staticPlugin;
