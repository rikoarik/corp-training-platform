const categorySchema = {
  type: 'object',
  required: ['id', 'name', 'slug', 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    slug: { type: 'string' },
    description: { type: ['string', 'null'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    _count: {
      type: 'object',
      properties: {
        trainings: { type: 'integer' },
      },
    },
  },
} as const;

export const categoryListQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100 },
  },
} as const;

export const categoryIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const createCategoryBodySchema = {
  type: 'object',
  required: ['name', 'slug'],
  properties: {
    name: { type: 'string', minLength: 2 },
    slug: { type: 'string', minLength: 2 },
    description: { type: 'string' },
  },
} as const;

export const updateCategoryBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2 },
    slug: { type: 'string', minLength: 2 },
    description: { type: 'string' },
  },
  additionalProperties: false,
  minProperties: 1,
} as const;

export const categorySuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: categorySchema,
  },
} as const;

export const categoryListSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: {
      type: 'array',
      items: categorySchema,
    },
  },
} as const;

export const categoryDeleteSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: { type: 'null' },
  },
} as const;
