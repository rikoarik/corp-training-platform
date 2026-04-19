import { Prisma, PublishStatus } from '@prisma/client';
import { badRequest, conflict, notFound } from '../../common/errors/http-error';
import type { CreateTrainingBody, TrainingQuery, UpdateTrainingBody } from './training.types';
import {
  createTraining,
  deleteTraining,
  findAdminTrainingById,
  findCategoryById,
  findPublicTrainingById,
  findPublicTrainingBySlug,
  findTrainings,
  updateTraining,
} from './training.repository';

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

function validatePrice(price: number): void {
  if (!Number.isFinite(price) || price < 0) {
    throw badRequest('Price must be zero or positive', 'INVALID_PRICE');
  }
}

async function ensureCategoryExists(categoryId: string): Promise<void> {
  const category = await findCategoryById(categoryId);
  if (!category) {
    throw notFound('Category not found', 'CATEGORY_NOT_FOUND');
  }
}

export async function listPublicTrainings(query: TrainingQuery) {
  const pagination = normalizePagination(query.page, query.limit);

  return findTrainings({
    categoryId: query.categoryId,
    status: query.status ?? PublishStatus.PUBLISHED,
    skip: pagination.skip,
    take: pagination.take,
  });
}

export async function listAdminTrainings(query: TrainingQuery) {
  const pagination = normalizePagination(query.page, query.limit);

  return findTrainings({
    categoryId: query.categoryId,
    status: query.status,
    skip: pagination.skip,
    take: pagination.take,
  });
}

export async function getPublicTrainingById(id: string) {
  const training = await findPublicTrainingById(id);
  if (!training) {
    throw notFound('Training not found', 'TRAINING_NOT_FOUND');
  }

  return training;
}

export async function getPublicTrainingBySlug(slug: string) {
  const training = await findPublicTrainingBySlug(slug);
  if (!training) {
    throw notFound('Training not found', 'TRAINING_NOT_FOUND');
  }

  return training;
}

export async function getAdminTrainingById(id: string) {
  const training = await findAdminTrainingById(id);
  if (!training) {
    throw notFound('Training not found', 'TRAINING_NOT_FOUND');
  }

  return training;
}

export async function createNewTraining(data: CreateTrainingBody) {
  validatePrice(data.price);
  await ensureCategoryExists(data.categoryId);

  try {
    return await createTraining({
      categoryId: data.categoryId,
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: new Prisma.Decimal(data.price),
      status: data.status ?? PublishStatus.DRAFT,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw conflict('Training slug already exists', 'TRAINING_SLUG_EXISTS');
    }

    throw error;
  }
}

export async function editTraining(id: string, data: UpdateTrainingBody) {
  const existing = await findAdminTrainingById(id);
  if (!existing) {
    throw notFound('Training not found', 'TRAINING_NOT_FOUND');
  }

  if (data.categoryId) {
    await ensureCategoryExists(data.categoryId);
  }

  if (typeof data.price === 'number') {
    validatePrice(data.price);
  }

  try {
    return await updateTraining(id, {
      categoryId: data.categoryId,
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: typeof data.price === 'number' ? new Prisma.Decimal(data.price) : undefined,
      status: data.status,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw conflict('Training slug already exists', 'TRAINING_SLUG_EXISTS');
    }

    throw error;
  }
}

export async function removeTraining(id: string) {
  const existing = await findAdminTrainingById(id);
  if (!existing) {
    throw notFound('Training not found', 'TRAINING_NOT_FOUND');
  }

  try {
    await deleteTraining(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw conflict('Training cannot be deleted because schedules still reference it', 'TRAINING_HAS_SCHEDULES');
    }

    throw error;
  }
}
