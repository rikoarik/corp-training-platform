import { Prisma, ParticipantStatus, ScheduleStatus } from '@prisma/client';
import { badRequest, conflict, notFound } from '../../common/errors/http-error';
import type {
  ParticipantAttendanceBody,
  ParticipantCertificateBody,
  ParticipantQuery,
  RegisterParticipantBody,
  UpdateParticipantBody,
} from './participant.types';
import {
  createParticipant,
  findParticipantById,
  findParticipantByScheduleAndEmail,
  findParticipants,
  findScheduleByIdWithCount,
  updateParticipant,
} from './participant.repository';

function normalizePagination(page?: number, limit?: number): { skip: number; take: number } {
  const resolvedPage = page ?? 1;
  const resolvedLimit = limit ?? 20;

  if (!Number.isInteger(resolvedPage) || resolvedPage < 1) {
    throw badRequest('page must be an integer >= 1', 'INVALID_PAGE');
  }

  if (!Number.isInteger(resolvedLimit) || resolvedLimit < 1 || resolvedLimit > 100) {
    throw badRequest('limit must be an integer between 1 and 100', 'INVALID_LIMIT');
  }

  return {
    skip: (resolvedPage - 1) * resolvedLimit,
    take: resolvedLimit,
  };
}

export async function listParticipants(query: ParticipantQuery) {
  const pagination = normalizePagination(query.page, query.limit);

  return findParticipants({
    scheduleId: query.scheduleId,
    status: query.status,
    skip: pagination.skip,
    take: pagination.take,
  });
}

export async function getParticipantById(id: string) {
  const participant = await findParticipantById(id);
  if (!participant) {
    throw notFound('Participant not found', 'PARTICIPANT_NOT_FOUND');
  }

  return participant;
}

export async function registerToTraining(data: RegisterParticipantBody) {
  const schedule = await findScheduleByIdWithCount(data.scheduleId);

  if (!schedule) {
    throw notFound('Schedule not found', 'SCHEDULE_NOT_FOUND');
  }

  if (schedule.status !== ScheduleStatus.OPEN) {
    throw badRequest('Schedule is not open for registration', 'SCHEDULE_NOT_OPEN');
  }

  if (schedule._count.participants >= schedule.quota) {
    throw conflict('Schedule quota is full', 'QUOTA_FULL');
  }

  const duplicateParticipant = await findParticipantByScheduleAndEmail(data.scheduleId, data.email);
  if (duplicateParticipant) {
    throw conflict('Participant is already registered for this schedule', 'DUPLICATE_PARTICIPANT');
  }

  try {
    return await createParticipant({
      scheduleId: data.scheduleId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status ?? ParticipantStatus.REGISTERED,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw conflict('Participant is already registered for this schedule', 'DUPLICATE_PARTICIPANT');
    }

    throw error;
  }
}

export async function editParticipant(id: string, payload: UpdateParticipantBody) {
  const existing = await findParticipantById(id);
  if (!existing) {
    throw notFound('Participant not found', 'PARTICIPANT_NOT_FOUND');
  }

  const nextEmail = payload.email?.trim();
  if (nextEmail && nextEmail !== existing.email) {
    const duplicate = await findParticipantByScheduleAndEmail(existing.scheduleId, nextEmail);
    if (duplicate) {
      throw conflict('Participant with this email already exists in this schedule', 'DUPLICATE_PARTICIPANT');
    }
  }

  try {
    return await updateParticipant(id, {
      name: payload.name?.trim(),
      email: nextEmail,
      phone: typeof payload.phone === 'undefined' ? undefined : payload.phone.trim() || null,
      status: payload.status,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw conflict('Participant with this email already exists in this schedule', 'DUPLICATE_PARTICIPANT');
    }

    throw error;
  }
}

export async function markAttendance(id: string, _payload: ParticipantAttendanceBody) {
  const participant = await findParticipantById(id);
  if (!participant) {
    throw notFound('Participant not found', 'PARTICIPANT_NOT_FOUND');
  }

  return updateParticipant(id, {
    status: ParticipantStatus.CONFIRMED,
  });
}

export async function issueCertificate(id: string, _payload: ParticipantCertificateBody) {
  const participant = await findParticipantById(id);
  if (!participant) {
    throw notFound('Participant not found', 'PARTICIPANT_NOT_FOUND');
  }

  if (participant.status !== ParticipantStatus.CONFIRMED) {
    throw badRequest('Participant must be confirmed before issuing certificate', 'PARTICIPANT_NOT_CONFIRMED');
  }

  return participant;
}
