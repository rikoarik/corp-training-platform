const scheduleSchema = {
  type: 'object',
  required: [
    'id',
    'trainingId',
    'title',
    'startDate',
    'endDate',
    'location',
    'quota',
    'status',
    'createdAt',
    'updatedAt',
    'training',
  ],
  properties: {
    id: { type: 'string' },
    trainingId: { type: 'string' },
    title: { type: 'string' },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
    location: { type: 'string' },
    quota: { type: 'integer' },
    status: { type: 'string', enum: ['DRAFT', 'OPEN', 'CLOSED', 'COMPLETED', 'CANCELLED'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    training: {
      type: 'object',
      required: ['id', 'title', 'slug'],
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        slug: { type: 'string' },
      },
    },
    _count: {
      type: 'object',
      properties: {
        participants: { type: 'integer' },
      },
    },
  },
} as const;

export const scheduleListQuerySchema = {
  type: 'object',
  properties: {
    trainingId: { type: 'string' },
    status: { type: 'string', enum: ['DRAFT', 'OPEN', 'CLOSED', 'COMPLETED', 'CANCELLED'] },
    page: { type: 'integer', minimum: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100 },
  },
} as const;

export const scheduleIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const createScheduleBodySchema = {
  type: 'object',
  required: ['trainingId', 'title', 'startDate', 'endDate', 'location', 'quota'],
  properties: {
    trainingId: { type: 'string' },
    title: { type: 'string', minLength: 3 },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
    location: { type: 'string', minLength: 1 },
    quota: { type: 'integer', minimum: 1 },
    status: { type: 'string', enum: ['DRAFT', 'OPEN', 'CLOSED', 'COMPLETED', 'CANCELLED'] },
  },
} as const;

export const updateScheduleBodySchema = {
  type: 'object',
  properties: {
    trainingId: { type: 'string' },
    title: { type: 'string', minLength: 3 },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
    location: { type: 'string', minLength: 1 },
    quota: { type: 'integer', minimum: 1 },
    status: { type: 'string', enum: ['DRAFT', 'OPEN', 'CLOSED', 'COMPLETED', 'CANCELLED'] },
  },
  additionalProperties: false,
  minProperties: 1,
} as const;

export const scheduleSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: scheduleSchema,
  },
} as const;

export const scheduleListSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: {
      type: 'array',
      items: scheduleSchema,
    },
  },
} as const;

export const scheduleDeleteSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: { type: 'null' },
  },
} as const;
