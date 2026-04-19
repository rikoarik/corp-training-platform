"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await bcryptjs_1.default.hash(process.env.ADMIN_PASSWORD ?? 'ChangeMe123!', 10);
    const admin = await prisma.user.upsert({
        where: { email: process.env.ADMIN_EMAIL ?? 'admin@example.com' },
        update: {},
        create: {
            name: 'System Admin',
            email: process.env.ADMIN_EMAIL ?? 'admin@example.com',
            passwordHash,
            role: client_1.UserRole.ADMIN,
        },
    });
    const category = await prisma.category.upsert({
        where: { slug: 'software-engineering' },
        update: {},
        create: {
            name: 'Software Engineering',
            slug: 'software-engineering',
            description: 'Backend and architecture training tracks.',
        },
    });
    const training = await prisma.training.upsert({
        where: { slug: 'nodejs-fastify-prisma' },
        update: {},
        create: {
            categoryId: category.id,
            title: 'Node.js API with Fastify and Prisma',
            slug: 'nodejs-fastify-prisma',
            description: 'Build production-grade backend APIs using Fastify and Prisma.',
            price: 2500000,
            status: client_1.PublishStatus.PUBLISHED,
        },
    });
    await prisma.schedule.create({
        data: {
            trainingId: training.id,
            title: 'Batch May 2026',
            startDate: new Date('2026-05-12T09:00:00.000Z'),
            endDate: new Date('2026-05-13T17:00:00.000Z'),
            location: 'Jakarta',
            quota: 30,
            status: client_1.ScheduleStatus.OPEN,
        },
    });
    await prisma.article.upsert({
        where: { slug: 'why-fastify-for-backend' },
        update: {},
        create: {
            authorId: admin.id,
            title: 'Why Fastify for Backend Services',
            slug: 'why-fastify-for-backend',
            excerpt: 'Fast startup, low overhead, and excellent plugin system.',
            content: 'Fastify is a strong option for high-performance Node.js APIs with robust type support.',
            status: client_1.PublishStatus.PUBLISHED,
            publishedAt: new Date(),
        },
    });
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
