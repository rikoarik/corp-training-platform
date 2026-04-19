import type { FastifyPluginAsync } from 'fastify';
import * as trainingController from '../modules/training/training.controller';
import * as scheduleController from '../modules/schedule/schedule.controller';
import * as participantController from '../modules/participant/participant.controller';
import * as articleController from '../modules/article/article.controller';
import * as categoryController from '../modules/category/category.controller';
import * as publicPageController from '../modules/public-page/public-page.controller';
import * as contactInquiryController from '../modules/contact-inquiry/contact-inquiry.controller';
import {
  participantSuccessSchema,
  registerParticipantBodySchema,
} from '../modules/participant/participant.schema';
import {
  articleListQuerySchema,
  articleListSuccessSchema,
  articleSlugParamsSchema,
  articleSuccessSchema,
} from '../modules/article/article.schema';
import {
  trainingListQuerySchema,
  trainingListSuccessSchema,
  trainingSlugParamsSchema,
  trainingSuccessSchema,
} from '../modules/training/training.schema';
import {
  scheduleIdParamsSchema,
  scheduleListQuerySchema,
  scheduleListSuccessSchema,
  scheduleSuccessSchema,
} from '../modules/schedule/schedule.schema';
import {
  categoryIdParamsSchema,
  categoryListQuerySchema,
  categoryListSuccessSchema,
  categorySuccessSchema,
} from '../modules/category/category.schema';
import { publicPageSlugParamsSchema, publicPageSuccessSchema } from '../modules/public-page/public-page.schema';
import { contactInquirySuccessSchema, createContactInquiryBodySchema } from '../modules/contact-inquiry/contact-inquiry.schema';

const publicRouteGroup: FastifyPluginAsync = async (app) => {
  app.get('/categories', {
    schema: {
      tags: ['public'],
      querystring: categoryListQuerySchema,
      response: { 200: categoryListSuccessSchema },
    },
    handler: categoryController.list,
  });
  app.get('/categories/:id', {
    schema: {
      tags: ['public'],
      params: categoryIdParamsSchema,
      response: { 200: categorySuccessSchema },
    },
    handler: categoryController.getById,
  });

  app.get('/trainings', {
    schema: {
      tags: ['public'],
      querystring: trainingListQuerySchema,
      response: { 200: trainingListSuccessSchema },
    },
    handler: trainingController.listPublic,
  });
  app.get('/trainings/:slug', {
    schema: {
      tags: ['public'],
      params: trainingSlugParamsSchema,
      response: { 200: trainingSuccessSchema },
    },
    handler: trainingController.getPublicBySlug,
  });

  app.get('/schedules', {
    schema: {
      tags: ['public'],
      querystring: scheduleListQuerySchema,
      response: { 200: scheduleListSuccessSchema },
    },
    handler: scheduleController.listPublic,
  });
  app.get('/schedules/:id', {
    schema: {
      tags: ['public'],
      params: scheduleIdParamsSchema,
      response: { 200: scheduleSuccessSchema },
    },
    handler: scheduleController.getPublicById,
  });

  app.post('/participants/register', {
    schema: {
      tags: ['public'],
      body: registerParticipantBodySchema,
      response: { 201: participantSuccessSchema },
    },
    handler: participantController.register,
  });

  app.get('/pages/:slug', {
    schema: {
      tags: ['public'],
      params: publicPageSlugParamsSchema,
      response: { 200: publicPageSuccessSchema },
    },
    handler: publicPageController.getBySlug,
  });

  app.post('/contact-inquiries', {
    schema: {
      tags: ['public'],
      body: createContactInquiryBodySchema,
      response: { 201: contactInquirySuccessSchema },
    },
    handler: contactInquiryController.create,
  });

  app.get('/articles/latest', {
    schema: {
      tags: ['public'],
      querystring: articleListQuerySchema,
      response: { 200: articleListSuccessSchema },
    },
    handler: articleController.latest,
  });

  app.get('/articles/popular', {
    schema: {
      tags: ['public'],
      querystring: articleListQuerySchema,
      response: { 200: articleListSuccessSchema },
    },
    handler: articleController.popular,
  });

  app.get('/articles/:slug', {
    schema: {
      tags: ['public'],
      params: articleSlugParamsSchema,
      response: { 200: articleSuccessSchema },
    },
    handler: articleController.getBySlug,
  });
};

export default publicRouteGroup;
