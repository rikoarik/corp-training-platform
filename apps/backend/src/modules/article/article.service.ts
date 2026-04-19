import { Prisma, PublishStatus } from '@prisma/client';
import { badRequest, conflict, notFound } from '../../common/errors/http-error';
import type { ArticleListQuery, CreateArticleBody, UpdateArticleBody } from './article.types';
import {
  createArticle,
  deleteArticle,
  findArticleById,
  findArticleBySlug,
  findArticles,
  findLatestPublishedArticles,
  findPopularArticles,
  updateArticle,
} from './article.repository';

function parsePublishedAt(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw badRequest('Invalid publishedAt date', 'INVALID_PUBLISHED_AT');
  }

  return parsed;
}

function resolvePublishedAt(status?: PublishStatus, publishedAt?: string): Date | undefined {
  const parsed = parsePublishedAt(publishedAt);
  if (parsed) {
    return parsed;
  }

  if (status === PublishStatus.PUBLISHED) {
    return new Date();
  }

  return undefined;
}

function normalizeLimit(raw?: number, fallback = 10): number {
  if (!raw) {
    return fallback;
  }

  if (!Number.isInteger(raw) || raw <= 0 || raw > 100) {
    throw badRequest('limit must be an integer between 1 and 100', 'INVALID_LIMIT');
  }

  return raw;
}

export async function listArticles(query: ArticleListQuery) {
  return findArticles({
    status: query.status,
    limit: normalizeLimit(query.limit, 50),
  });
}

export async function listLatestArticles(limit?: number) {
  return findLatestPublishedArticles(normalizeLimit(limit, 6));
}

export async function listPopularArticles(limit?: number) {
  return findPopularArticles(normalizeLimit(limit, 6));
}

export async function getArticleBySlug(slug: string) {
  const article = await findArticleBySlug(slug);

  if (!article || article.status !== PublishStatus.PUBLISHED) {
    throw notFound('Article not found', 'ARTICLE_NOT_FOUND');
  }

  return article;
}

export async function createNewArticle(authorId: string, payload: CreateArticleBody) {
  try {
    return await createArticle({
      authorId,
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      content: payload.content,
      status: payload.status ?? PublishStatus.DRAFT,
      publishedAt: resolvePublishedAt(payload.status, payload.publishedAt),
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw conflict('Article slug already exists', 'ARTICLE_SLUG_EXISTS');
    }

    throw error;
  }
}

export async function editArticle(id: string, payload: UpdateArticleBody) {
  const existing = await findArticleById(id);
  if (!existing) {
    throw notFound('Article not found', 'ARTICLE_NOT_FOUND');
  }

  try {
    return await updateArticle(id, {
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      content: payload.content,
      status: payload.status,
      publishedAt:
        typeof payload.publishedAt !== 'undefined' || typeof payload.status !== 'undefined'
          ? resolvePublishedAt(payload.status, payload.publishedAt) ?? null
          : undefined,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw conflict('Article slug already exists', 'ARTICLE_SLUG_EXISTS');
    }

    throw error;
  }
}

export async function publishArticle(id: string) {
  const existing = await findArticleById(id);
  if (!existing) {
    throw notFound('Article not found', 'ARTICLE_NOT_FOUND');
  }

  return updateArticle(id, {
    status: PublishStatus.PUBLISHED,
    publishedAt: existing.publishedAt ?? new Date(),
  });
}

export async function archiveArticle(id: string) {
  const existing = await findArticleById(id);
  if (!existing) {
    throw notFound('Article not found', 'ARTICLE_NOT_FOUND');
  }

  return updateArticle(id, {
    status: PublishStatus.ARCHIVED,
  });
}

export async function removeArticle(id: string) {
  const existing = await findArticleById(id);
  if (!existing) {
    throw notFound('Article not found', 'ARTICLE_NOT_FOUND');
  }

  await deleteArticle(id);
}
