const articleAuthorSchema = {
  type: 'object',
  required: ['id', 'name', 'email', 'role'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['ADMIN', 'USER'] },
  },
} as const;

const articleDataSchema = {
  type: 'object',
  required: [
    'id',
    'authorId',
    'title',
    'slug',
    'content',
    'status',
    'createdAt',
    'updatedAt',
    'author',
  ],
  properties: {
    id: { type: 'string' },
    authorId: { type: 'string' },
    title: { type: 'string' },
    slug: { type: 'string' },
    excerpt: { type: ['string', 'null'] },
    content: { type: 'string' },
    status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
    publishedAt: { type: ['string', 'null'], format: 'date-time' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    author: articleAuthorSchema,
  },
} as const;

export const articleListQuerySchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
    limit: { type: 'integer', minimum: 1, maximum: 100 },
  },
} as const;

export const articleSlugParamsSchema = {
  type: 'object',
  required: ['slug'],
  properties: {
    slug: { type: 'string', minLength: 1 },
  },
} as const;

export const articleIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const createArticleBodySchema = {
  type: 'object',
  required: ['title', 'slug', 'content'],
  properties: {
    title: { type: 'string', minLength: 3 },
    slug: { type: 'string', minLength: 3 },
    excerpt: { type: 'string' },
    content: { type: 'string', minLength: 1 },
    status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
    publishedAt: { type: 'string', format: 'date-time' },
  },
} as const;

export const updateArticleBodySchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 3 },
    slug: { type: 'string', minLength: 3 },
    excerpt: { type: 'string' },
    content: { type: 'string', minLength: 1 },
    status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
    publishedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  minProperties: 1,
} as const;

export const articleSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: articleDataSchema,
  },
} as const;

export const articleListSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: {
      type: 'array',
      items: articleDataSchema,
    },
  },
} as const;

export const articleDeleteSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: { type: 'null' },
  },
} as const;
