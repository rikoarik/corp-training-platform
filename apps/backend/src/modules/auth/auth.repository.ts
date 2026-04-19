import prisma from '../../lib/prisma';
import type { AppUserRole } from '../../types/user-role';

const userAuthSelect = {
  id: true,
  email: true,
  passwordHash: true,
  role: true,
} as const;

const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export interface AuthUser {
  id: string;
  email: string;
  passwordHash: string;
  role: AppUserRole;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: AppUserRole;
  createdAt: Date;
  updatedAt: Date;
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: userAuthSelect,
  });
}

export function findUserPublicById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userPublicSelect,
  });
}

export function createUser(data: { name: string; email: string; passwordHash: string; role?: AppUserRole }) {
  return prisma.user.create({
    data,
    select: userPublicSelect,
  });
}
