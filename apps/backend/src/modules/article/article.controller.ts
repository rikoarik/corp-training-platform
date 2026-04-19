import type { FastifyReply, FastifyRequest } from 'fastify';
import { sendSuccess } from '../../common/utils/api-response';
import * as articleService from './article.service';
import type {
  ArticleIdParams,
  ArticleListQuery,
  ArticleSlugParams,
  CreateArticleBody,
  UpdateArticleBody,
} from './article.types';

export async function list(
  request: FastifyRequest<{ Querystring: ArticleListQuery }>,
  reply: FastifyReply,
): Promise<void> {
  const articles = await articleService.listArticles(request.query);
  sendSuccess(reply, 200, 'Fetch articles success', articles);
}

export async function latest(
  request: FastifyRequest<{ Querystring: ArticleListQuery }>,
  reply: FastifyReply,
): Promise<void> {
  const articles = await articleService.listLatestArticles(request.query.limit);
  sendSuccess(reply, 200, 'Fetch latest articles success', articles);
}

export async function popular(
  request: FastifyRequest<{ Querystring: ArticleListQuery }>,
  reply: FastifyReply,
): Promise<void> {
  const articles = await articleService.listPopularArticles(request.query.limit);
  sendSuccess(reply, 200, 'Fetch popular articles success', articles);
}

export async function getBySlug(
  request: FastifyRequest<{ Params: ArticleSlugParams }>,
  reply: FastifyReply,
): Promise<void> {
  const article = await articleService.getArticleBySlug(request.params.slug);
  sendSuccess(reply, 200, 'Fetch article success', article);
}

export async function create(
  request: FastifyRequest<{ Body: CreateArticleBody }>,
  reply: FastifyReply,
): Promise<void> {
  const article = await articleService.createNewArticle(request.user.sub, request.body);
  sendSuccess(reply, 201, 'Create article success', article);
}

export async function update(
  request: FastifyRequest<{ Params: ArticleIdParams; Body: UpdateArticleBody }>,
  reply: FastifyReply,
): Promise<void> {
  const article = await articleService.editArticle(request.params.id, request.body);
  sendSuccess(reply, 200, 'Update article success', article);
}

export async function publish(
  request: FastifyRequest<{ Params: ArticleIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  const article = await articleService.publishArticle(request.params.id);
  sendSuccess(reply, 200, 'Publish article success', article);
}

export async function archive(
  request: FastifyRequest<{ Params: ArticleIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  const article = await articleService.archiveArticle(request.params.id);
  sendSuccess(reply, 200, 'Archive article success', article);
}

export async function remove(
  request: FastifyRequest<{ Params: ArticleIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  await articleService.removeArticle(request.params.id);
  sendSuccess(reply, 200, 'Delete article success', null);
}
