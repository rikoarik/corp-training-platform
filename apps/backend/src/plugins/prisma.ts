import type { FastifyPluginAsync } from 'fastify';
import prisma from '../lib/prisma';

const prismaPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
};

export default prismaPlugin;
