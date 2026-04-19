import { Prisma, type PublishStatus } from '@prisma/client';
import prisma from '../../lib/prisma';

const trainingInclude = {
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  _count: {
    select: {
      schedules: true,
    },
  },
} satisfies Prisma.TrainingInclude;

export type TrainingEntity = Prisma.TrainingGetPayload<{ include: typeof trainingInclude }>;

export function findTrainings(params: {
  categoryId?: string;
  status?: PublishStatus;
  skip: number;
  take: number;
}) {
  return prisma.training.findMany({
    where: {
      categoryId: params.categoryId,
      status: params.status,
    },
    include: trainingInclude,
    orderBy: { createdAt: 'desc' },
    skip: params.skip,
    take: params.take,
  });
}

export function findPublicTrainingById(id: string) {
  return prisma.training.findFirst({
    where: {
      id,
      status: 'PUBLISHED',
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      schedules: {
        where: {
          status: 'OPEN',
        },
        orderBy: { startDate: 'asc' },
      },
    },
  });
}

export function findPublicTrainingBySlug(slug: string) {
  return prisma.training.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      schedules: {
        where: {
          status: 'OPEN',
        },
        orderBy: { startDate: 'asc' },
      },
    },
  });
}

export function findAdminTrainingById(id: string) {
  return prisma.training.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      schedules: {
        orderBy: { startDate: 'asc' },
      },
    },
  });
}

export function findCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export function createTraining(data: {
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  price: Prisma.Decimal;
  status: PublishStatus;
}) {
  return prisma.training.create({
    data,
    include: trainingInclude,
  });
}

export function updateTraining(
  id: string,
  data: {
    categoryId?: string;
    title?: string;
    slug?: string;
    description?: string;
    price?: Prisma.Decimal;
    status?: PublishStatus;
  },
) {
  return prisma.training.update({
    where: { id },
    data,
    include: trainingInclude,
  });
}

export function deleteTraining(id: string) {
  return prisma.training.delete({ where: { id } });
}
