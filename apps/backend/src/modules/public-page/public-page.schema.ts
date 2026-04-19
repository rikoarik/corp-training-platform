const publicPageSchema = {
  type: 'object',
  required: ['id', 'slug', 'title', 'content', 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'string' },
    slug: { type: 'string' },
    title: { type: 'string' },
    content: {
      type: 'object',
      additionalProperties: true,
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
} as const;

export const publicPageListQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100 },
  },
} as const;

export const publicPageIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const publicPageSlugParamsSchema = {
  type: 'object',
  required: ['slug'],
  properties: {
    slug: { type: 'string', minLength: 1 },
  },
} as const;

export const updatePublicPageBodySchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    content: {
      type: 'object',
      additionalProperties: true,
    },
  },
  additionalProperties: false,
  minProperties: 1,
} as const;

export const publicPageSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: publicPageSchema,
  },
} as const;

export const publicPageListSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: {
      type: 'array',
      items: publicPageSchema,
    },
  },
} as const;
