import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import { badRequest, conflict, notFound } from '../../common/errors/http-error';
import type { CategoryQuery, CreateCategoryBody, UpdateCategoryBody } from './category.types';

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

function assertNonEmptyString(value: string | undefined, label: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw badRequest(`${label} is required`, `INVALID_${label.toUpperCase()}`);
  }

  return value.trim();
}

export async function listCategories(query: CategoryQuery) {
  const pagination = normalizePagination(query.page, query.limit);

  return prisma.category.findMany({
    include: {
      _count: {
        select: {
          trainings: true,
        },
      },
    },
    orderBy: { name: 'asc' },
    skip: pagination.skip,
    take: pagination.take,
  });
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          trainings: true,
        },
      },
    },
  });

  if (!category) {
    throw notFound('Category not found', 'CATEGORY_NOT_FOUND');
  }

  return category;
}

export async function createCategory(input: CreateCategoryBody) {
  const name = assertNonEmptyString(input.name, 'name');
  const slug = assertNonEmptyString(input.slug, 'slug');

  try {
    return await prisma.category.create({
      data: {
        name,
        slug,
        description: input.description?.trim() || null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw conflict('Category slug already exists', 'CATEGORY_SLUG_EXISTS');
    }

    throw error;
  }
}

export async function updateCategory(id: string, input: UpdateCategoryBody) {
  await getCategoryById(id);

  if (typeof input.name !== 'undefined') {
    assertNonEmptyString(input.name, 'name');
  }

  if (typeof input.slug !== 'undefined') {
    assertNonEmptyString(input.slug, 'slug');
  }

  try {
    return await prisma.category.update({
      where: { id },
      data: {
        name: input.name?.trim(),
        slug: input.slug?.trim(),
        description: typeof input.description === 'undefined' ? undefined : input.description?.trim() || null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw conflict('Category slug already exists', 'CATEGORY_SLUG_EXISTS');
    }

    throw error;
  }
}

export async function deleteCategory(id: string) {
  await getCategoryById(id);

  try {
    await prisma.category.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw conflict('Category cannot be deleted because trainings still reference it', 'CATEGORY_HAS_TRAININGS');
    }

    throw error;
  }
}
