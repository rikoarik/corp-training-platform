import type { FastifyReply, FastifyRequest } from 'fastify';
import { sendSuccess } from '../../common/utils/api-response';
import type { PublicPageIdParams, PublicPageQuery, PublicPageSlugParams, UpdatePublicPageBody } from './public-page.types';
import * as publicPageService from './public-page.service';

export async function list(
  request: FastifyRequest<{ Querystring: PublicPageQuery }>,
  reply: FastifyReply,
): Promise<void> {
  const pages = await publicPageService.listPublicPages(request.query);
  sendSuccess(reply, 200, 'Fetch public pages success', pages);
}

export async function getById(
  request: FastifyRequest<{ Params: PublicPageIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  const page = await publicPageService.getPublicPageById(request.params.id);
  sendSuccess(reply, 200, 'Fetch public page success', page);
}

export async function getBySlug(
  request: FastifyRequest<{ Params: PublicPageSlugParams }>,
  reply: FastifyReply,
): Promise<void> {
  const page = await publicPageService.getPublicPageBySlug(request.params.slug);
  sendSuccess(reply, 200, 'Fetch public page success', page);
}

export async function update(
  request: FastifyRequest<{ Params: PublicPageIdParams; Body: UpdatePublicPageBody }>,
  reply: FastifyReply,
): Promise<void> {
  const page = await publicPageService.editPublicPage(request.params.id, request.body);
  sendSuccess(reply, 200, 'Update public page success', page);
}
