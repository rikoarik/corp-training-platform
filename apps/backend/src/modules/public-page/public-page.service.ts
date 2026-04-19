import { Prisma } from '@prisma/client';
import { badRequest } from '../../common/errors/http-error';
import { findPublicPageById, findPublicPageBySlug, findPublicPages, updatePublicPage } from './public-page.repository';
import type { PublicPageQuery, UpdatePublicPageBody } from './public-page.types';
import { notFound } from '../../common/errors/http-error';

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

function assertContentObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw badRequest('content must be an object', 'INVALID_CONTENT');
  }

  return value as Record<string, unknown>;
}

export async function listPublicPages(query: PublicPageQuery) {
  const pagination = normalizePagination(query.page, query.limit);
  return findPublicPages(pagination.skip, pagination.take);
}

export async function getPublicPageById(id: string) {
  const page = await findPublicPageById(id);

  if (!page) {
    throw notFound('Public page not found', 'PUBLIC_PAGE_NOT_FOUND');
  }

  return page;
}

export async function getPublicPageBySlug(slug: string) {
  const page = await findPublicPageBySlug(slug);

  if (!page) {
    throw notFound('Public page not found', 'PUBLIC_PAGE_NOT_FOUND');
  }

  return page;
}

export async function editPublicPage(id: string, input: UpdatePublicPageBody) {
  await getPublicPageById(id);

  const data: { title?: string; content?: Prisma.InputJsonValue } = {};

  if (typeof input.title !== 'undefined') {
    data.title = assertNonEmptyString(input.title, 'title');
  }

  if (typeof input.content !== 'undefined') {
    data.content = assertContentObject(input.content) as Prisma.InputJsonValue;
  }

  return updatePublicPage(id, data);
}
