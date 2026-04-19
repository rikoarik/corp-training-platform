import 'dotenv/config';
import prisma from './lib/prisma';
import { env } from './config/env';
import { buildApp } from './app';

const app = buildApp();

async function startServer() {
  try {
    await app.listen({ port: env.port, host: env.host });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

async function shutdown(signal: string) {
  app.log.info(`Received ${signal}. Closing server...`);

  await app.close();
  await prisma.$disconnect();

  process.exit(0);
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

void startServer();
