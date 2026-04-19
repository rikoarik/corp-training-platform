import type { FastifyReply, FastifyRequest } from 'fastify';
import { sendSuccess } from '../../common/utils/api-response';
import type {
  CreateUserBody,
  UpdateUserBody,
  UpdateUserPasswordBody,
  UserIdParams,
} from './users.types';
import { changeUserPassword, createNewUser, editUser, listUsers } from './users.service';

export async function list(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const users = await listUsers();
  sendSuccess(reply, 200, 'Fetch users success', users);
}

export async function create(
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply,
): Promise<void> {
  const user = await createNewUser(request.body);
  sendSuccess(reply, 201, 'Create user success', user);
}

export async function update(
  request: FastifyRequest<{ Params: UserIdParams; Body: UpdateUserBody }>,
  reply: FastifyReply,
): Promise<void> {
  const user = await editUser(request.params.id, request.body);
  sendSuccess(reply, 200, 'Update user success', user);
}

export async function updatePassword(
  request: FastifyRequest<{ Params: UserIdParams; Body: UpdateUserPasswordBody }>,
  reply: FastifyReply,
): Promise<void> {
  await changeUserPassword(request.params.id, request.body.password);
  sendSuccess(reply, 200, 'Update password success', null);
}
