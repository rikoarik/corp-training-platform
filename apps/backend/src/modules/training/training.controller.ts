import type { FastifyReply, FastifyRequest } from 'fastify';
import { sendSuccess } from '../../common/utils/api-response';
import type {
  CreateTrainingBody,
  TrainingIdParams,
  TrainingQuery,
  TrainingSlugParams,
  UpdateTrainingBody,
} from './training.types';
import {
  createNewTraining,
  editTraining,
  getAdminTrainingById,
  getPublicTrainingBySlug,
  listAdminTrainings,
  listPublicTrainings,
  removeTraining,
} from './training.service';

export async function listPublic(
  request: FastifyRequest<{ Querystring: TrainingQuery }>,
  reply: FastifyReply,
): Promise<void> {
  const trainings = await listPublicTrainings(request.query);
  sendSuccess(reply, 200, 'Fetch trainings success', trainings);
}

export async function listAdmin(
  request: FastifyRequest<{ Querystring: TrainingQuery }>,
  reply: FastifyReply,
): Promise<void> {
  const trainings = await listAdminTrainings(request.query);
  sendSuccess(reply, 200, 'Fetch trainings success', trainings);
}

export async function getPublicBySlug(
  request: FastifyRequest<{ Params: TrainingSlugParams }>,
  reply: FastifyReply,
): Promise<void> {
  const training = await getPublicTrainingBySlug(request.params.slug);
  sendSuccess(reply, 200, 'Fetch training success', training);
}

export async function getAdminById(
  request: FastifyRequest<{ Params: TrainingIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  const training = await getAdminTrainingById(request.params.id);
  sendSuccess(reply, 200, 'Fetch training success', training);
}

export async function create(
  request: FastifyRequest<{ Body: CreateTrainingBody }>,
  reply: FastifyReply,
): Promise<void> {
  const training = await createNewTraining(request.body);
  sendSuccess(reply, 201, 'Create training success', training);
}

export async function update(
  request: FastifyRequest<{ Params: TrainingIdParams; Body: UpdateTrainingBody }>,
  reply: FastifyReply,
): Promise<void> {
  const training = await editTraining(request.params.id, request.body);
  sendSuccess(reply, 200, 'Update training success', training);
}

export async function remove(
  request: FastifyRequest<{ Params: TrainingIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  await removeTraining(request.params.id);
  sendSuccess(reply, 200, 'Delete training success', null);
}
