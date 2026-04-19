const contactInquirySchema = {
  type: 'object',
  required: ['id', 'name', 'email', 'message', 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    phone: { type: ['string', 'null'] },
    company: { type: ['string', 'null'] },
    message: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
} as const;

export const contactInquiryListQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100 },
  },
} as const;

export const contactInquiryIdParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const createContactInquiryBodySchema = {
  type: 'object',
  required: ['name', 'email', 'message'],
  properties: {
    name: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string' },
    company: { type: 'string' },
    message: { type: 'string', minLength: 10 },
  },
} as const;

export const contactInquirySuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: contactInquirySchema,
  },
} as const;

export const contactInquiryListSuccessSchema = {
  type: 'object',
  required: ['success', 'message', 'data'],
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: {
      type: 'array',
      items: contactInquirySchema,
    },
  },
} as const;
