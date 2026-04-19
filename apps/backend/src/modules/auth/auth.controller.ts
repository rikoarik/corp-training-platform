import type { FastifyReply, FastifyRequest } from 'fastify';
import * as authService from './auth.service';
import { sendSuccess } from '../../common/utils/api-response';
import type { LoginBody, RegisterBody } from './auth.types';

export async function register(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply,
): Promise<void> {
  const auth = await authService.register(request.body, (payload) =>
    request.server.jwt.sign(payload, { expiresIn: process.env.JWT_EXPIRES_IN ?? '1d' }),
  );
  sendSuccess(reply, 201, 'Register success', auth);
}

export async function login(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
): Promise<void> {
  const auth = await authService.login(request.body, (payload) =>
    request.server.jwt.sign(payload, { expiresIn: process.env.JWT_EXPIRES_IN ?? '1d' }),
  );
  sendSuccess(reply, 200, 'Login success', auth);
}

export async function me(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const user = await authService.getCurrentUser(request.user.sub);
  sendSuccess(reply, 200, 'Fetch user success', user);
}
