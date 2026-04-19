import type { FastifyPluginAsync } from 'fastify';
import cors from '@fastify/cors';
import { env } from '../config/env';

const allowedOrigins = new Set([
  env.appUrl,
  'http://127.0.0.1:4173',
  'http://127.0.0.1:4174',
  'http://localhost:4173',
  'http://localhost:4174',
  'http://127.0.0.1:5173',
  'http://localhost:5173',
]);

const corsPlugin: FastifyPluginAsync = async (app) => {
  await app.register(cors, {
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'), false);
    },
    credentials: true,
  });
};

export default corsPlugin;
