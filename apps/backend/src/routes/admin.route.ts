import type { FastifyPluginAsync } from 'fastify';
import { forbidden, unauthorized } from '../common/errors/http-error';
import * as trainingController from '../modules/training/training.controller';
import * as scheduleController from '../modules/schedule/schedule.controller';
import * as participantController from '../modules/participant/participant.controller';
import * as articleController from '../modules/article/article.controller';
import * as categoryController from '../modules/category/category.controller';
import * as publicPageController from '../modules/public-page/public-page.controller';
import * as contactInquiryController from '../modules/contact-inquiry/contact-inquiry.controller';
import usersRoutes from '../modules/users/users.route';
import {
  contactInquiryIdParamsSchema,
  contactInquiryListQuerySchema,
  contactInquiryListSuccessSchema,
  contactInquirySuccessSchema,
} from '../modules/contact-inquiry/contact-inquiry.schema';
import {
  publicPageIdParamsSchema,
  publicPageListQuerySchema,
  publicPageListSuccessSchema,
  publicPageSuccessSchema,
  updatePublicPageBodySchema,
} from '../modules/public-page/public-page.schema';
import {
  participantIdParamsSchema,
  participantAttendanceBodySchema,
  participantCertificateBodySchema,
  participantListQuerySchema,
  participantListSuccessSchema,
  participantSuccessSchema,
  updateParticipantBodySchema,
} from '../modules/participant/participant.schema';
import {
  createTrainingBodySchema,
  trainingDeleteSuccessSchema,
  trainingIdParamsSchema,
  trainingListQuerySchema,
  trainingListSuccessSchema,
  trainingSuccessSchema,
  updateTrainingBodySchema,
} from '../modules/training/training.schema';
import {
  createScheduleBodySchema,
  scheduleDeleteSuccessSchema,
  scheduleIdParamsSchema,
  scheduleListQuerySchema,
  scheduleListSuccessSchema,
  scheduleSuccessSchema,
  updateScheduleBodySchema,
} from '../modules/schedule/schedule.schema';
import {
  categoryDeleteSuccessSchema,
  categoryIdParamsSchema,
  categoryListQuerySchema,
  categoryListSuccessSchema,
  categorySuccessSchema,
  createCategoryBodySchema,
  updateCategoryBodySchema,
} from '../modules/category/category.schema';

const adminRouteGroup: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (request) => {
    try {
      await request.jwtVerify();
    } catch {
      throw unauthorized('Unauthorized');
    }

    if (request.user.role !== 'ADMIN') {
      throw forbidden('Forbidden');
    }
  });

  await app.register(usersRoutes, { prefix: '/users' });

  app.get('/trainings', {
    schema: {
      tags: ['admin'],
      querystring: trainingListQuerySchema,
      response: { 200: trainingListSuccessSchema },
    },
    handler: trainingController.listAdmin,
  });
  app.get('/trainings/:id', {
    schema: {
      tags: ['admin'],
      params: trainingIdParamsSchema,
      response: { 200: trainingSuccessSchema },
    },
    handler: trainingController.getAdminById,
  });
  app.post('/trainings', {
    schema: {
      tags: ['admin'],
      body: createTrainingBodySchema,
      response: { 201: trainingSuccessSchema },
    },
    handler: trainingController.create,
  });
  app.patch('/trainings/:id', {
    schema: {
      tags: ['admin'],
      params: trainingIdParamsSchema,
      body: updateTrainingBodySchema,
      response: { 200: trainingSuccessSchema },
    },
    handler: trainingController.update,
  });
  app.delete('/trainings/:id', {
    schema: {
      tags: ['admin'],
      params: trainingIdParamsSchema,
      response: { 200: trainingDeleteSuccessSchema },
    },
    handler: trainingController.remove,
  });

  app.get('/categories', {
    schema: {
      tags: ['admin'],
      querystring: categoryListQuerySchema,
      response: { 200: categoryListSuccessSchema },
    },
    handler: categoryController.list,
  });
  app.get('/categories/:id', {
    schema: {
      tags: ['admin'],
      params: categoryIdParamsSchema,
      response: { 200: categorySuccessSchema },
    },
    handler: categoryController.getById,
  });
  app.post('/categories', {
    schema: {
      tags: ['admin'],
      body: createCategoryBodySchema,
      response: { 201: categorySuccessSchema },
    },
    handler: categoryController.create,
  });
  app.patch('/categories/:id', {
    schema: {
      tags: ['admin'],
      params: categoryIdParamsSchema,
      body: updateCategoryBodySchema,
      response: { 200: categorySuccessSchema },
    },
    handler: categoryController.update,
  });
  app.delete('/categories/:id', {
    schema: {
      tags: ['admin'],
      params: categoryIdParamsSchema,
      response: { 200: categoryDeleteSuccessSchema },
    },
    handler: categoryController.remove,
  });

  app.get('/schedules', {
    schema: {
      tags: ['admin'],
      querystring: scheduleListQuerySchema,
      response: { 200: scheduleListSuccessSchema },
    },
    handler: scheduleController.listAdmin,
  });
  app.get('/schedules/:id', {
    schema: {
      tags: ['admin'],
      params: scheduleIdParamsSchema,
      response: { 200: scheduleSuccessSchema },
    },
    handler: scheduleController.getAdminById,
  });
  app.post('/schedules', {
    schema: {
      tags: ['admin'],
      body: createScheduleBodySchema,
      response: { 201: scheduleSuccessSchema },
    },
    handler: scheduleController.create,
  });
  app.patch('/schedules/:id', {
    schema: {
      tags: ['admin'],
      params: scheduleIdParamsSchema,
      body: updateScheduleBodySchema,
      response: { 200: scheduleSuccessSchema },
    },
    handler: scheduleController.update,
  });
  app.delete('/schedules/:id', {
    schema: {
      tags: ['admin'],
      params: scheduleIdParamsSchema,
      response: { 200: scheduleDeleteSuccessSchema },
    },
    handler: scheduleController.remove,
  });

  app.get('/participants', {
    schema: {
      tags: ['admin'],
      querystring: participantListQuerySchema,
      response: { 200: participantListSuccessSchema },
    },
    handler: participantController.list,
  });

  app.get('/public-pages', {
    schema: {
      tags: ['admin'],
      querystring: publicPageListQuerySchema,
      response: { 200: publicPageListSuccessSchema },
    },
    handler: publicPageController.list,
  });
  app.get('/public-pages/:id', {
    schema: {
      tags: ['admin'],
      params: publicPageIdParamsSchema,
      response: { 200: publicPageSuccessSchema },
    },
    handler: publicPageController.getById,
  });
  app.patch('/public-pages/:id', {
    schema: {
      tags: ['admin'],
      params: publicPageIdParamsSchema,
      body: updatePublicPageBodySchema,
      response: { 200: publicPageSuccessSchema },
    },
    handler: publicPageController.update,
  });

  app.get('/contact-inquiries', {
    schema: {
      tags: ['admin'],
      querystring: contactInquiryListQuerySchema,
      response: { 200: contactInquiryListSuccessSchema },
    },
    handler: contactInquiryController.list,
  });
  app.get('/contact-inquiries/:id', {
    schema: {
      tags: ['admin'],
      params: contactInquiryIdParamsSchema,
      response: { 200: contactInquirySuccessSchema },
    },
    handler: contactInquiryController.getById,
  });
  app.get('/participants/:id', {
    schema: {
      tags: ['admin'],
      params: participantIdParamsSchema,
      response: { 200: participantSuccessSchema },
    },
    handler: participantController.getById,
  });
  app.patch('/participants/:id', {
    schema: {
      tags: ['admin'],
      params: participantIdParamsSchema,
      body: updateParticipantBodySchema,
      response: { 200: participantSuccessSchema },
    },
    handler: participantController.update,
  });
  app.post('/participants/:id/attendance', {
    schema: {
      tags: ['admin'],
      params: participantIdParamsSchema,
      body: participantAttendanceBodySchema,
      response: { 200: participantSuccessSchema },
    },
    handler: participantController.attendance,
  });
  app.post('/participants/:id/certificate', {
    schema: {
      tags: ['admin'],
      params: participantIdParamsSchema,
      body: participantCertificateBodySchema,
      response: { 200: participantSuccessSchema },
    },
    handler: participantController.certificate,
  });

  app.get('/articles', {
    schema: {
      tags: ['admin'],
    },
    handler: articleController.list,
  });
  app.post('/articles', {
    schema: {
      tags: ['admin'],
    },
    handler: articleController.create,
  });
  app.patch('/articles/:id', {
    schema: {
      tags: ['admin'],
    },
    handler: articleController.update,
  });
  app.patch('/articles/:id/publish', {
    schema: {
      tags: ['admin'],
    },
    handler: articleController.publish,
  });
  app.patch('/articles/:id/archive', {
    schema: {
      tags: ['admin'],
    },
    handler: articleController.archive,
  });
  app.delete('/articles/:id', {
    schema: {
      tags: ['admin'],
    },
    handler: articleController.remove,
  });
};

export default adminRouteGroup;
