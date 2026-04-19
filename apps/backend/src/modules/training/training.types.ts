import type { PublishStatus } from '@prisma/client';

export interface TrainingQuery {
  categoryId?: string;
  status?: PublishStatus;
  page?: number;
  limit?: number;
}

export interface TrainingIdParams {
  id: string;
}

export interface TrainingSlugParams {
  slug: string;
}

export interface CreateTrainingBody {
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  status?: PublishStatus;
}

export interface UpdateTrainingBody {
  categoryId?: string;
  title?: string;
  slug?: string;
  description?: string;
  price?: number;
  status?: PublishStatus;
}
