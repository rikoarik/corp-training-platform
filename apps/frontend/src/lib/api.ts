import axios from 'axios';
import { env } from './env';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types/api';

export class ApiRequestError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.status = status;
  }
}

type RequestValue = string | number | boolean | null | undefined;
type RequestParams = Record<string, RequestValue>;

const client = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
});

let authToken = '';

export function setAuthToken(token: string | null | undefined) {
  authToken = token?.trim() ?? '';
}

client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

function unwrapResponse<T>(payload: ApiSuccessResponse<T> | ApiErrorResponse): T {
  if (payload.success) {
    return payload.data;
  }

  throw new ApiRequestError(payload.message, payload.error.code);
}

function toApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorResponse | undefined;

    return new ApiRequestError(
      payload?.message || error.message || 'Terjadi kesalahan saat menghubungi server.',
      payload?.error?.code,
      error.response?.status,
    );
  }

  if (error instanceof Error) {
    return new ApiRequestError(error.message);
  }

  return new ApiRequestError('Terjadi kesalahan yang tidak diketahui.');
}

export async function getData<T>(path: string, params?: RequestParams): Promise<T> {
  try {
    const response = await client.get<ApiSuccessResponse<T> | ApiErrorResponse>(path, {
      params,
    });

    return unwrapResponse(response.data);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function postData<T, TPayload>(path: string, payload: TPayload): Promise<T> {
  try {
    const response = await client.post<ApiSuccessResponse<T> | ApiErrorResponse>(path, payload);
    return unwrapResponse(response.data);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function patchData<T, TPayload>(path: string, payload: TPayload): Promise<T> {
  try {
    const response = await client.patch<ApiSuccessResponse<T> | ApiErrorResponse>(path, payload);
    return unwrapResponse(response.data);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteData<T>(path: string): Promise<T> {
  try {
    const response = await client.delete<ApiSuccessResponse<T> | ApiErrorResponse>(path);
    return unwrapResponse(response.data);
  } catch (error) {
    throw toApiError(error);
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi kesalahan yang tidak diketahui.';
}
