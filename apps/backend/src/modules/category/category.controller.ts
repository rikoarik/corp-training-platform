import type { FastifyReply, FastifyRequest } from 'fastify';
import { sendSuccess } from '../../common/utils/api-response';
import type {
  CategoryIdParams,
  CategoryQuery,
  CreateCategoryBody,
  UpdateCategoryBody,
} from './category.types';
import * as categoryService from './category.service';

export async function list(
  request: FastifyRequest<{ Querystring: CategoryQuery }>,
  reply: FastifyReply,
): Promise<void> {
  const categories = await categoryService.listCategories(request.query);
  sendSuccess(reply, 200, 'Fetch categories success', categories);
}

export async function getById(
  request: FastifyRequest<{ Params: CategoryIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  const category = await categoryService.getCategoryById(request.params.id);
  sendSuccess(reply, 200, 'Fetch category success', category);
}

export async function create(
  request: FastifyRequest<{ Body: CreateCategoryBody }>,
  reply: FastifyReply,
): Promise<void> {
  const category = await categoryService.createCategory(request.body);
  sendSuccess(reply, 201, 'Create category success', category);
}

export async function update(
  request: FastifyRequest<{ Params: CategoryIdParams; Body: UpdateCategoryBody }>,
  reply: FastifyReply,
): Promise<void> {
  const category = await categoryService.updateCategory(request.params.id, request.body);
  sendSuccess(reply, 200, 'Update category success', category);
}

export async function remove(
  request: FastifyRequest<{ Params: CategoryIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  await categoryService.deleteCategory(request.params.id);
  sendSuccess(reply, 200, 'Delete category success', null);
}
