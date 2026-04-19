import type { PublishStatus } from '@prisma/client';

export interface ArticleListQuery {
  status?: PublishStatus;
  limit?: number;
}

export interface ArticleSlugParams {
  slug: string;
}

export interface ArticleIdParams {
  id: string;
}

export interface CreateArticleBody {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status?: PublishStatus;
  publishedAt?: string;
}

export interface UpdateArticleBody {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  status?: PublishStatus;
  publishedAt?: string;
}
