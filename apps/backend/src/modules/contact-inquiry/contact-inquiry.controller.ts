import type { FastifyReply, FastifyRequest } from 'fastify';
import { sendSuccess } from '../../common/utils/api-response';
import type { ContactInquiryIdParams, ContactInquiryQuery, CreateContactInquiryBody } from './contact-inquiry.types';
import * as contactInquiryService from './contact-inquiry.service';

export async function list(
  request: FastifyRequest<{ Querystring: ContactInquiryQuery }>,
  reply: FastifyReply,
): Promise<void> {
  const inquiries = await contactInquiryService.listContactInquiries(request.query);
  sendSuccess(reply, 200, 'Fetch contact inquiries success', inquiries);
}

export async function getById(
  request: FastifyRequest<{ Params: ContactInquiryIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  const inquiry = await contactInquiryService.getContactInquiryById(request.params.id);
  sendSuccess(reply, 200, 'Fetch contact inquiry success', inquiry);
}

export async function create(
  request: FastifyRequest<{ Body: CreateContactInquiryBody }>,
  reply: FastifyReply,
): Promise<void> {
  const inquiry = await contactInquiryService.submitContactInquiry(request.body);
  sendSuccess(reply, 201, 'Contact inquiry submitted', inquiry);
}
