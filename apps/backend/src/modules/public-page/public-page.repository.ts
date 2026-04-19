import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';

const publicPageSelect = {
  id: true,
  slug: true,
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PublicPageSelect;

export type PublicPageEntity = Prisma.PublicPageGetPayload<{ select: typeof publicPageSelect }>;

export function findPublicPages(skip: number, take: number) {
  return prisma.publicPage.findMany({
    orderBy: { slug: 'asc' },
    skip,
    take,
    select: publicPageSelect,
  });
}

export function findPublicPageById(id: string) {
  return prisma.publicPage.findUnique({
    where: { id },
    select: publicPageSelect,
  });
}

export function findPublicPageBySlug(slug: string) {
  return prisma.publicPage.findUnique({
    where: { slug },
    select: publicPageSelect,
  });
}

export function updatePublicPage(id: string, data: { title?: string; content?: Prisma.InputJsonValue }) {
  return prisma.publicPage.update({
    where: { id },
    data,
    select: publicPageSelect,
  });
}
