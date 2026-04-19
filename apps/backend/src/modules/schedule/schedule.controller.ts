import type { FastifyReply, FastifyRequest } from 'fastify';
import { sendSuccess } from '../../common/utils/api-response';
import type {
  CreateScheduleBody,
  ScheduleIdParams,
  ScheduleQuery,
  UpdateScheduleBody,
} from './schedule.types';
import {
  createNewSchedule,
  editSchedule,
  getAdminScheduleById,
  getPublicScheduleById,
  listAdminSchedules,
  listPublicSchedules,
  removeSchedule,
} from './schedule.service';

export async function listPublic(
  request: FastifyRequest<{ Querystring: ScheduleQuery }>,
  reply: FastifyReply,
): Promise<void> {
  const schedules = await listPublicSchedules(request.query);
  sendSuccess(reply, 200, 'Fetch schedules success', schedules);
}

export async function listAdmin(
  request: FastifyRequest<{ Querystring: ScheduleQuery }>,
  reply: FastifyReply,
): Promise<void> {
  const schedules = await listAdminSchedules(request.query);
  sendSuccess(reply, 200, 'Fetch schedules success', schedules);
}

export async function getPublicById(
  request: FastifyRequest<{ Params: ScheduleIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  const schedule = await getPublicScheduleById(request.params.id);
  sendSuccess(reply, 200, 'Fetch schedule success', schedule);
}

export async function getAdminById(
  request: FastifyRequest<{ Params: ScheduleIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  const schedule = await getAdminScheduleById(request.params.id);
  sendSuccess(reply, 200, 'Fetch schedule success', schedule);
}

export async function create(
  request: FastifyRequest<{ Body: CreateScheduleBody }>,
  reply: FastifyReply,
): Promise<void> {
  const schedule = await createNewSchedule(request.body);
  sendSuccess(reply, 201, 'Create schedule success', schedule);
}

export async function update(
  request: FastifyRequest<{ Params: ScheduleIdParams; Body: UpdateScheduleBody }>,
  reply: FastifyReply,
): Promise<void> {
  const schedule = await editSchedule(request.params.id, request.body);
  sendSuccess(reply, 200, 'Update schedule success', schedule);
}

export async function remove(
  request: FastifyRequest<{ Params: ScheduleIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  await removeSchedule(request.params.id);
  sendSuccess(reply, 200, 'Delete schedule success', null);
}
