import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { HttpError } from './http-error';

export function errorHandler(error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);

  if (error instanceof HttpError) {
    return reply.code(error.statusCode).send({
      success: false,
      message: error.message,
      error: {
        code: error.code,
      },
    });
  }

  if ('statusCode' in error && typeof error.statusCode === 'number' && error.statusCode >= 400) {
    return reply.code(error.statusCode).send({
      success: false,
      message: error.message || 'Request failed',
      error: {
        code: 'REQUEST_ERROR',
      },
    });
  }

  if ('code' in error && typeof error.code === 'string' && error.code.startsWith('P10')) {
    return reply.code(503).send({
      success: false,
      message: 'Database connection is unavailable',
      error: {
        code: 'DATABASE_UNAVAILABLE',
      },
    });
  }

  if ('name' in error && error.name === 'PrismaClientInitializationError') {
    return reply.code(503).send({
      success: false,
      message: 'Database connection is unavailable',
      error: {
        code: 'DATABASE_UNAVAILABLE',
      },
    });
  }

  return reply.code(500).send({
    success: false,
    message: 'Internal server error',
    error: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
}
