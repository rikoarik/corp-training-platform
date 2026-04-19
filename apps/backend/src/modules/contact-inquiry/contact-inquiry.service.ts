import { badRequest, notFound } from '../../common/errors/http-error';
import { createContactInquiry, findContactInquiryById, findContactInquiries } from './contact-inquiry.repository';
import type { ContactInquiryQuery, CreateContactInquiryBody } from './contact-inquiry.types';

function normalizePagination(page?: number, limit?: number): { skip: number; take: number } {
  const resolvedPage = page ?? 1;
  const resolvedLimit = limit ?? 20;

  if (!Number.isInteger(resolvedPage) || resolvedPage < 1) {
    throw badRequest('page must be an integer >= 1', 'INVALID_PAGE');
  }

  if (!Number.isInteger(resolvedLimit) || resolvedLimit < 1 || resolvedLimit > 100) {
    throw badRequest('limit must be an integer between 1 and 100', 'INVALID_LIMIT');
  }

  return {
    skip: (resolvedPage - 1) * resolvedLimit,
    take: resolvedLimit,
  };
}

function assertNonEmptyString(value: string | undefined, label: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw badRequest(`${label} is required`, `INVALID_${label.toUpperCase()}`);
  }

  return value.trim();
}

export async function listContactInquiries(query: ContactInquiryQuery) {
  const pagination = normalizePagination(query.page, query.limit);
  return findContactInquiries(pagination.skip, pagination.take);
}

export async function getContactInquiryById(id: string) {
  const inquiry = await findContactInquiryById(id);

  if (!inquiry) {
    throw notFound('Contact inquiry not found', 'CONTACT_INQUIRY_NOT_FOUND');
  }

  return inquiry;
}

export async function submitContactInquiry(payload: CreateContactInquiryBody) {
  return createContactInquiry({
    name: assertNonEmptyString(payload.name, 'name'),
    email: assertNonEmptyString(payload.email, 'email'),
    phone: payload.phone?.trim() || null,
    company: payload.company?.trim() || null,
    message: assertNonEmptyString(payload.message, 'message'),
  });
}
