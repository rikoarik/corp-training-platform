import { Prisma, ScheduleStatus } from '@prisma/client';
import { badRequest, conflict, notFound } from '../../common/errors/http-error';
import type { CreateScheduleBody, ScheduleQuery, UpdateScheduleBody } from './schedule.types';
import {
  createSchedule,
  deleteSchedule,
  findAdminScheduleById,
  findPublicScheduleById,
  findSchedules,
  findTrainingById,
  updateSchedule,
} from './schedule.repository';

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

function parseDate(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw badRequest('Invalid schedule date', 'INVALID_DATE');
  }
  return parsed;
}

function validateQuota(quota: number): void {
  if (!Number.isInteger(quota) || quota <= 0) {
    throw badRequest('Quota must be a positive integer', 'INVALID_QUOTA');
  }
}

function validateDateRange(startDate: Date, endDate: Date): void {
  if (endDate < startDate) {
    throw badRequest('endDate must be greater than or equal to startDate', 'INVALID_DATE_RANGE');
  }
}

async function ensureTrainingExists(trainingId: string): Promise<void> {
  const training = await findTrainingById(trainingId);
  if (!training) {
    throw notFound('Training not found', 'TRAINING_NOT_FOUND');
  }
}

export async function listPublicSchedules(query: ScheduleQuery) {
  const pagination = normalizePagination(query.page, query.limit);

  return findSchedules({
    trainingId: query.trainingId,
    status: query.status ?? ScheduleStatus.OPEN,
    skip: pagination.skip,
    take: pagination.take,
  });
}

export async function listAdminSchedules(query: ScheduleQuery) {
  const pagination = normalizePagination(query.page, query.limit);

  return findSchedules({
    trainingId: query.trainingId,
    status: query.status,
    skip: pagination.skip,
    take: pagination.take,
  });
}

export async function getPublicScheduleById(id: string) {
  const schedule = await findPublicScheduleById(id);
  if (!schedule) {
    throw notFound('Schedule not found', 'SCHEDULE_NOT_FOUND');
  }

  return schedule;
}

export async function getAdminScheduleById(id: string) {
  const schedule = await findAdminScheduleById(id);
  if (!schedule) {
    throw notFound('Schedule not found', 'SCHEDULE_NOT_FOUND');
  }

  return schedule;
}

export async function createNewSchedule(data: CreateScheduleBody) {
  await ensureTrainingExists(data.trainingId);
  validateQuota(data.quota);

  const startDate = parseDate(data.startDate);
  const endDate = parseDate(data.endDate);
  validateDateRange(startDate, endDate);

  return createSchedule({
    trainingId: data.trainingId,
    title: data.title,
    startDate,
    endDate,
    location: data.location,
    quota: data.quota,
    status: data.status ?? ScheduleStatus.OPEN,
  });
}

export async function editSchedule(id: string, data: UpdateScheduleBody) {
  const existing = await findAdminScheduleById(id);
  if (!existing) {
    throw notFound('Schedule not found', 'SCHEDULE_NOT_FOUND');
  }

  if (data.trainingId) {
    await ensureTrainingExists(data.trainingId);
  }

  if (typeof data.quota === 'number') {
    validateQuota(data.quota);
  }

  const startDate = data.startDate ? parseDate(data.startDate) : existing.startDate;
  const endDate = data.endDate ? parseDate(data.endDate) : existing.endDate;
  validateDateRange(startDate, endDate);

  return updateSchedule(id, {
    trainingId: data.trainingId,
    title: data.title,
    startDate,
    endDate,
    location: data.location,
    quota: data.quota,
    status: data.status,
  });
}

export async function removeSchedule(id: string) {
  const existing = await findAdminScheduleById(id);
  if (!existing) {
    throw notFound('Schedule not found', 'SCHEDULE_NOT_FOUND');
  }

  try {
    await deleteSchedule(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw conflict('Schedule cannot be deleted due to related records', 'SCHEDULE_DELETE_CONFLICT');
    }

    throw error;
  }
}
