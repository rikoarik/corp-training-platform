import { Prisma, type ParticipantStatus } from '@prisma/client';
import prisma from '../../lib/prisma';

const participantInclude = {
  schedule: {
    include: {
      training: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  },
} satisfies Prisma.ParticipantInclude;

export type ParticipantEntity = Prisma.ParticipantGetPayload<{ include: typeof participantInclude }>;

export function findParticipants(params: {
  scheduleId?: string;
  status?: ParticipantStatus;
  skip: number;
  take: number;
}) {
  return prisma.participant.findMany({
    where: {
      scheduleId: params.scheduleId,
      status: params.status,
    },
    include: participantInclude,
    orderBy: { createdAt: 'desc' },
    skip: params.skip,
    take: params.take,
  });
}

export function findParticipantById(id: string) {
  return prisma.participant.findUnique({
    where: { id },
    include: participantInclude,
  });
}

export function findScheduleByIdWithCount(id: string) {
  return prisma.schedule.findUnique({
    where: { id },
    include: {
      _count: { select: { participants: true } },
    },
  });
}

export function findParticipantByScheduleAndEmail(scheduleId: string, email: string) {
  return prisma.participant.findUnique({
    where: {
      scheduleId_email: {
        scheduleId,
        email,
      },
    },
  });
}

export function createParticipant(data: {
  scheduleId: string;
  name: string;
  email: string;
  phone?: string;
  status: ParticipantStatus;
}) {
  return prisma.participant.create({
    data,
    include: participantInclude,
  });
}

export function updateParticipant(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string | null;
    status?: ParticipantStatus;
  },
) {
  return prisma.participant.update({
    where: { id },
    data,
    include: participantInclude,
  });
}
