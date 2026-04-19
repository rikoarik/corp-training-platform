export interface PublicPageQuery {
  page?: number;
  limit?: number;
}

export interface PublicPageIdParams {
  id: string;
}

export interface PublicPageSlugParams {
  slug: string;
}

export interface UpdatePublicPageBody {
  title?: string;
  content?: Record<string, unknown>;
}
