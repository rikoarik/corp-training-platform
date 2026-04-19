import { Prisma, type PublishStatus } from '@prisma/client';
import prisma from '../../lib/prisma';

const authorSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} satisfies Prisma.UserSelect;

const articleInclude = {
  author: {
    select: authorSelect,
  },
} satisfies Prisma.ArticleInclude;

export type ArticleEntity = Prisma.ArticleGetPayload<{ include: typeof articleInclude }>;

export function findArticles(params: { status?: PublishStatus; limit?: number }) {
  return prisma.article.findMany({
    where: {
      status: params.status,
    },
    include: articleInclude,
    orderBy: { createdAt: 'desc' },
    take: params.limit,
  });
}

export function findLatestPublishedArticles(limit: number) {
  return prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: articleInclude,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
}

export function findPopularArticles(limit: number) {
  return prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: articleInclude,
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  });
}

export function findArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: articleInclude,
  });
}

export function findArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: articleInclude,
  });
}

export function createArticle(data: {
  authorId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: PublishStatus;
  publishedAt?: Date;
}) {
  return prisma.article.create({
    data,
    include: articleInclude,
  });
}

export function updateArticle(
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string | null;
    content?: string;
    status?: PublishStatus;
    publishedAt?: Date | null;
  },
) {
  return prisma.article.update({
    where: { id },
    data,
    include: articleInclude,
  });
}

export function deleteArticle(id: string) {
  return prisma.article.delete({ where: { id } });
}
