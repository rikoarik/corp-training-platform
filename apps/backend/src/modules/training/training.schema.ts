const trainingSchema = {
  type: 'object',
  required: [
    'id',
    'categoryId',
    'title',
    'slug',
    'description',
    'price',
    'status',
    'createdAt',
    'updatedAt',
    'category',
  ],
  properties: {
    id: { type: 'string' },
    categoryId: { type: 'string' },
    title: { type: 'string' },
    slug: { type: 'string' },
    description: { type: 'string' },
    price: { type: ['number', 'string'] },
    status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    category: {
      type: 'object',
      required: ['id', 'name', 'slug'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        slug: { type: 'string' },
      },
    },
    _count: {
      type: 'object',
      properties: {
        schedules: { type: 'integer' },
      },
    },
  },
} as const;

export const trainingListQuerySchema = {
  type: 'object',
  properties: {
    categoryId: { type: 'string' },
    status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
    page: { type: 'integer', minimum: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100 },
  },
} as const;

export const trainingIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const trainingSlugParamsSchema = {
  type: 'object',
  required: ['slug'],
  properties: {
    slug: { type: 'string', minLength: 1 },
  },
} as const;

export const createTrainingBodySchema = {
  type: 'object',
  required: ['categoryId', 'title', 'slug', 'description', 'price'],
  properties: {
    categoryId: { type: 'string' },
    title: { type: 'string', minLength: 3 },
    slug: { type: 'string', minLength: 3 },
    description: { type: 'string', minLength: 1 },
    price: { type: 'number', minimum: 0 },
    status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
  },
} as const;

export const updateTrainingBodySchema = {
  type: 'object',
  properties: {
    categoryId: { type: 'string' },
    title: { type: 'string', minLength: 3 },
    slug: { type: 'string', minLength: 3 },
    description: { type: 'string', minLength: 1 },
    price: { type: 'number', minimum: 0 },
    status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
  },
  additionalProperties: false,
  minProperties: 1,
} as const;

export const trainingSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: trainingSchema,
  },
} as const;

export const trainingListSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: {
      type: 'array',
      items: trainingSchema,
    },
  },
} as const;

export const trainingDeleteSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: { type: 'null' },
  },
} as const;
