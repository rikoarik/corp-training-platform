import '@fastify/jwt';
import type { FastifyRequest } from 'fastify';
import type { AppUserRole } from './user-role';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
      role: AppUserRole;
    };
    user: {
      sub: string;
      email: string;
      role: AppUserRole;
    };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>;
  }
}

export {};
