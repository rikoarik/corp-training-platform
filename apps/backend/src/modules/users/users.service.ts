import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { badRequest, conflict, notFound } from '../../common/errors/http-error';
import type { AppUserRole } from '../../types/user-role';
import type { CreateUserBody, UpdateUserBody } from './users.types';
import {
  createUser,
  findAllUsers,
  findUserByEmail,
  findUserById,
  updateUser,
  updateUserPassword,
} from './users.repository';

const SALT_ROUNDS = 10;

function assertNonEmpty(value: string | undefined, label: string): string {
  if (!value || value.trim().length === 0) {
    throw badRequest(`${label} is required`, `INVALID_${label.toUpperCase()}`);
  }

  return value.trim();
}

function toRole(role?: AppUserRole): AppUserRole {
  return role ?? 'USER';
}

export async function listUsers() {
  return findAllUsers();
}

export async function createNewUser(payload: CreateUserBody) {
  const name = assertNonEmpty(payload.name, 'name');
  const email = assertNonEmpty(payload.email, 'email');

  const existing = await findUserByEmail(email);
  if (existing) {
    throw conflict('Email is already registered', 'EMAIL_ALREADY_REGISTERED');
  }

  const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);
  return createUser({
    name,
    email,
    passwordHash,
    role: toRole(payload.role),
  });
}

export async function editUser(id: string, payload: UpdateUserBody) {
  const existing = await findUserById(id);
  if (!existing) {
    throw notFound('User not found', 'USER_NOT_FOUND');
  }

  const email = payload.email?.trim();
  if (email && email !== existing.email) {
    const conflictUser = await findUserByEmail(email);
    if (conflictUser) {
      throw conflict('Email is already registered', 'EMAIL_ALREADY_REGISTERED');
    }
  }

  try {
    return await updateUser(id, {
      name: payload.name?.trim(),
      email,
      role: payload.role,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw conflict('Email is already registered', 'EMAIL_ALREADY_REGISTERED');
    }

    throw error;
  }
}

export async function changeUserPassword(id: string, password: string) {
  const existing = await findUserById(id);
  if (!existing) {
    throw notFound('User not found', 'USER_NOT_FOUND');
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return updateUserPassword(id, hash);
}
