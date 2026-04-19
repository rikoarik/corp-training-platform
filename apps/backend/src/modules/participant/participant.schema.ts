const participantSchema = {
  type: 'object',
  required: ['id', 'scheduleId', 'name', 'email', 'status', 'createdAt', 'updatedAt', 'schedule'],
  properties: {
    id: { type: 'string' },
    scheduleId: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    phone: { type: ['string', 'null'] },
    status: { type: 'string', enum: ['REGISTERED', 'CONFIRMED', 'CANCELLED'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    schedule: {
      type: 'object',
      required: ['id', 'trainingId', 'title', 'startDate', 'endDate', 'location', 'quota', 'status', 'training'],
      properties: {
        id: { type: 'string' },
        trainingId: { type: 'string' },
        title: { type: 'string' },
        startDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', format: 'date-time' },
        location: { type: 'string' },
        quota: { type: 'integer' },
        status: { type: 'string' },
        training: {
          type: 'object',
          required: ['id', 'title', 'slug'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            slug: { type: 'string' },
          },
        },
      },
    },
  },
} as const;

export const participantListQuerySchema = {
  type: 'object',
  properties: {
    scheduleId: { type: 'string' },
    status: { type: 'string', enum: ['REGISTERED', 'CONFIRMED', 'CANCELLED'] },
    page: { type: 'integer', minimum: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100 },
  },
} as const;

export const participantIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const registerParticipantBodySchema = {
  type: 'object',
  required: ['scheduleId', 'name', 'email'],
  properties: {
    scheduleId: { type: 'string' },
    name: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string' },
    status: { type: 'string', enum: ['REGISTERED', 'CONFIRMED', 'CANCELLED'] },
  },
} as const;

export const updateParticipantBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string' },
    status: { type: 'string', enum: ['REGISTERED', 'CONFIRMED', 'CANCELLED'] },
  },
  additionalProperties: false,
  minProperties: 1,
} as const;

export const participantAttendanceBodySchema = {
  type: 'object',
  properties: {
    attendedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
} as const;

export const participantCertificateBodySchema = {
  type: 'object',
  properties: {
    issuedBy: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;

export const participantSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: participantSchema,
  },
} as const;

export const participantListSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: {
      type: 'array',
      items: participantSchema,
    },
  },
} as const;
