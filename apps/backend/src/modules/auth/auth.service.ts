import bcrypt from 'bcryptjs';
import { env } from '../../config/env';
import { conflict, notFound, unauthorized } from '../../common/errors/http-error';
import type { AppUserRole } from '../../types/user-role';
import type { AuthResult, LoginBody, RegisterBody } from './auth.types';
import { createUser, findUserByEmail, findUserPublicById } from './auth.repository';

const SALT_ROUNDS = 10;

function toRole(role?: AppUserRole): AppUserRole {
  return role ?? 'USER';
}

export async function register(
  payload: RegisterBody,
  signToken: (input: { sub: string; email: string; role: AppUserRole }) => string | Promise<string>,
): Promise<AuthResult> {
  const existing = await findUserByEmail(payload.email);
  if (existing) {
    throw conflict('Email is already registered', 'EMAIL_ALREADY_REGISTERED');
  }

  const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const user = await createUser({
    name: payload.name,
    email: payload.email,
    passwordHash,
    role: toRole(payload.role),
  });

  const token = await signToken({ sub: user.id, email: user.email, role: user.role });
  return { token, expiresIn: env.jwtExpiresIn, user };
}

export async function login(
  payload: LoginBody,
  signToken: (input: { sub: string; email: string; role: AppUserRole }) => string | Promise<string>,
): Promise<AuthResult> {
  const user = await findUserByEmail(payload.email);
  if (!user) {
    throw unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const valid = await bcrypt.compare(payload.password, user.passwordHash);
  if (!valid) {
    throw unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const publicUser = await findUserPublicById(user.id);
  if (!publicUser) {
    throw notFound('User not found', 'USER_NOT_FOUND');
  }

  const token = await signToken({ sub: publicUser.id, email: publicUser.email, role: publicUser.role });
  return { token, expiresIn: env.jwtExpiresIn, user: publicUser };
}

export async function getCurrentUser(userId: string) {
  const user = await findUserPublicById(userId);
  if (!user) {
    throw notFound('User not found', 'USER_NOT_FOUND');
  }
  return user;
}
