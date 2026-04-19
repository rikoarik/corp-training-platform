import { Prisma, type ScheduleStatus } from '@prisma/client';
import prisma from '../../lib/prisma';

const scheduleInclude = {
  training: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
  _count: {
    select: {
      participants: true,
    },
  },
} satisfies Prisma.ScheduleInclude;

export type ScheduleEntity = Prisma.ScheduleGetPayload<{ include: typeof scheduleInclude }>;

export function findSchedules(params: {
  trainingId?: string;
  status?: ScheduleStatus;
  skip: number;
  take: number;
}) {
  return prisma.schedule.findMany({
    where: {
      trainingId: params.trainingId,
      status: params.status,
    },
    include: scheduleInclude,
    orderBy: { startDate: 'asc' },
    skip: params.skip,
    take: params.take,
  });
}

export function findPublicScheduleById(id: string) {
  return prisma.schedule.findFirst({
    where: {
      id,
      status: 'OPEN',
    },
    include: {
      training: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      _count: {
        select: {
          participants: true,
        },
      },
    },
  });
}

export function findAdminScheduleById(id: string) {
  return prisma.schedule.findUnique({
    where: { id },
    include: {
      training: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      participants: {
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          participants: true,
        },
      },
    },
  });
}

export function findTrainingById(id: string) {
  return prisma.training.findUnique({ where: { id } });
}

export function createSchedule(data: {
  trainingId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  quota: number;
  status: ScheduleStatus;
}) {
  return prisma.schedule.create({
    data,
    include: scheduleInclude,
  });
}

export function updateSchedule(
  id: string,
  data: {
    trainingId?: string;
    title?: string;
    startDate?: Date;
    endDate?: Date;
    location?: string;
    quota?: number;
    status?: ScheduleStatus;
  },
) {
  return prisma.schedule.update({
    where: { id },
    data,
    include: scheduleInclude,
  });
}

export function deleteSchedule(id: string) {
  return prisma.schedule.delete({ where: { id } });
}
