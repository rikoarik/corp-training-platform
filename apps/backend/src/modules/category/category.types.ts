export interface CategoryQuery {
  page?: number;
  limit?: number;
}

export interface CategoryIdParams {
  id: string;
}

export interface CreateCategoryBody {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryBody {
  name?: string;
  slug?: string;
  description?: string;
}
