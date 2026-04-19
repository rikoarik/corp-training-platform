export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const badRequest = (message: string, code = 'BAD_REQUEST') =>
  new HttpError(400, code, message);
export const unauthorized = (message: string, code = 'UNAUTHORIZED') =>
  new HttpError(401, code, message);
export const forbidden = (message: string, code = 'FORBIDDEN') =>
  new HttpError(403, code, message);
export const notFound = (message: string, code = 'NOT_FOUND') => new HttpError(404, code, message);
export const conflict = (message: string, code = 'CONFLICT') => new HttpError(409, code, message);
