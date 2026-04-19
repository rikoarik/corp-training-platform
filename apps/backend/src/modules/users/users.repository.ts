import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import type { AppUserRole } from '../../types/user-role';

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export function findAllUsers() {
  return prisma.user.findMany({
    select: userSelect,
    orderBy: { createdAt: 'desc' },
  });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function createUser(data: { name: string; email: string; passwordHash: string; role: AppUserRole }) {
  return prisma.user.create({
    data,
    select: userSelect,
  });
}

export function updateUser(id: string, data: { name?: string; email?: string; role?: AppUserRole }) {
  return prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });
}

export function updateUserPassword(id: string, passwordHash: string) {
  return prisma.user.update({
    where: { id },
    data: { passwordHash },
    select: userSelect,
  });
}
