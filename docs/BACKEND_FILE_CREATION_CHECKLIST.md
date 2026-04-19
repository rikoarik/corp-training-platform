# Backend File Creation Checklist (Fastify + Prisma)

Use this as a copy-paste execution checklist while creating the backend structure.

## 0) Core backend root

- [ ] Create `apps/backend/src/index.ts` (server start, graceful shutdown)
- [ ] Create `apps/backend/src/app.ts` (build app, register plugins/routes/error handler)
- [ ] Create `apps/backend/src/types/fastify.d.ts` (Fastify type augmentation)

## 1) Config layer

- [ ] Create `apps/backend/src/config/env.ts`
- [ ] Create `apps/backend/src/config/constants.ts`
- [ ] Create `apps/backend/src/config/security.ts`

## 2) Common shared layer

- [ ] Create `apps/backend/src/common/errors/app-error.ts`
- [ ] Create `apps/backend/src/common/errors/http-error.ts`
- [ ] Create `apps/backend/src/common/errors/error-handler.ts`
- [ ] Create `apps/backend/src/common/utils/api-response.ts`
- [ ] Create `apps/backend/src/common/utils/pagination.ts`
- [ ] Create `apps/backend/src/common/utils/slug.ts`
- [ ] Create `apps/backend/src/common/utils/password.ts`
- [ ] Create `apps/backend/src/common/utils/auth.ts`
- [ ] Create `apps/backend/src/common/utils/date.ts`

## 3) Plugin layer

- [ ] Create `apps/backend/src/plugins/cors.ts`
- [ ] Create `apps/backend/src/plugins/jwt.ts`
- [ ] Create `apps/backend/src/plugins/prisma.ts`
- [ ] Create `apps/backend/src/plugins/multipart.ts`
- [ ] Create `apps/backend/src/plugins/static.ts`
- [ ] Create `apps/backend/src/plugins/auth-guard.ts`

## 4) Route aggregators

- [ ] Create `apps/backend/src/routes/index.ts`
- [ ] Create `apps/backend/src/routes/health.route.ts`
- [ ] Create `apps/backend/src/routes/auth.route.ts`
- [ ] Create `apps/backend/src/routes/public.route.ts`
- [ ] Create `apps/backend/src/routes/admin.route.ts`

## 5) Module template (repeat for each module)

For each module below, create the same file set:

- [ ] `*.route.ts`
- [ ] `*.controller.ts`
- [ ] `*.service.ts`
- [ ] `*.repository.ts`
- [ ] `*.schema.ts`
- [ ] `*.types.ts`

## 6) Auth module

- [ ] Create `apps/backend/src/modules/auth/auth.route.ts`
- [ ] Create `apps/backend/src/modules/auth/auth.controller.ts`
- [ ] Create `apps/backend/src/modules/auth/auth.service.ts`
- [ ] Create `apps/backend/src/modules/auth/auth.repository.ts`
- [ ] Create `apps/backend/src/modules/auth/auth.schema.ts`
- [ ] Create `apps/backend/src/modules/auth/auth.types.ts`

## 7) Users module

- [ ] Create `apps/backend/src/modules/users/users.route.ts`
- [ ] Create `apps/backend/src/modules/users/users.controller.ts`
- [ ] Create `apps/backend/src/modules/users/users.service.ts`
- [ ] Create `apps/backend/src/modules/users/users.repository.ts`
- [ ] Create `apps/backend/src/modules/users/users.schema.ts`
- [ ] Create `apps/backend/src/modules/users/users.types.ts`

## 8) Homepage module

- [ ] Create `apps/backend/src/modules/homepage/homepage.route.ts`
- [ ] Create `apps/backend/src/modules/homepage/homepage.controller.ts`
- [ ] Create `apps/backend/src/modules/homepage/homepage.service.ts`
- [ ] Create `apps/backend/src/modules/homepage/homepage.repository.ts`
- [ ] Create `apps/backend/src/modules/homepage/homepage.schema.ts`
- [ ] Create `apps/backend/src/modules/homepage/homepage.types.ts`

## 9) Company profile module

- [ ] Create `apps/backend/src/modules/company-profile/company-profile.route.ts`
- [ ] Create `apps/backend/src/modules/company-profile/company-profile.controller.ts`
- [ ] Create `apps/backend/src/modules/company-profile/company-profile.service.ts`
- [ ] Create `apps/backend/src/modules/company-profile/company-profile.repository.ts`
- [ ] Create `apps/backend/src/modules/company-profile/company-profile.schema.ts`
- [ ] Create `apps/backend/src/modules/company-profile/company-profile.types.ts`

## 10) Categories module

- [ ] Create `apps/backend/src/modules/categories/categories.route.ts`
- [ ] Create `apps/backend/src/modules/categories/categories.controller.ts`
- [ ] Create `apps/backend/src/modules/categories/categories.service.ts`
- [ ] Create `apps/backend/src/modules/categories/categories.repository.ts`
- [ ] Create `apps/backend/src/modules/categories/categories.schema.ts`
- [ ] Create `apps/backend/src/modules/categories/categories.types.ts`

## 11) Trainings module

- [ ] Create `apps/backend/src/modules/trainings/trainings.route.ts`
- [ ] Create `apps/backend/src/modules/trainings/trainings.controller.ts`
- [ ] Create `apps/backend/src/modules/trainings/trainings.service.ts`
- [ ] Create `apps/backend/src/modules/trainings/trainings.repository.ts`
- [ ] Create `apps/backend/src/modules/trainings/trainings.schema.ts`
- [ ] Create `apps/backend/src/modules/trainings/trainings.types.ts`

## 12) Schedules module

- [ ] Create `apps/backend/src/modules/schedules/schedules.route.ts`
- [ ] Create `apps/backend/src/modules/schedules/schedules.controller.ts`
- [ ] Create `apps/backend/src/modules/schedules/schedules.service.ts`
- [ ] Create `apps/backend/src/modules/schedules/schedules.repository.ts`
- [ ] Create `apps/backend/src/modules/schedules/schedules.schema.ts`
- [ ] Create `apps/backend/src/modules/schedules/schedules.types.ts`

## 13) Participants module

- [ ] Create `apps/backend/src/modules/participants/participants.route.ts`
- [ ] Create `apps/backend/src/modules/participants/participants.controller.ts`
- [ ] Create `apps/backend/src/modules/participants/participants.service.ts`
- [ ] Create `apps/backend/src/modules/participants/participants.repository.ts`
- [ ] Create `apps/backend/src/modules/participants/participants.schema.ts`
- [ ] Create `apps/backend/src/modules/participants/participants.types.ts`

## 14) Articles module

- [ ] Create `apps/backend/src/modules/articles/articles.route.ts`
- [ ] Create `apps/backend/src/modules/articles/articles.controller.ts`
- [ ] Create `apps/backend/src/modules/articles/articles.service.ts`
- [ ] Create `apps/backend/src/modules/articles/articles.repository.ts`
- [ ] Create `apps/backend/src/modules/articles/articles.schema.ts`
- [ ] Create `apps/backend/src/modules/articles/articles.types.ts`

## 15) Jobs module

- [ ] Create `apps/backend/src/modules/jobs/jobs.route.ts`
- [ ] Create `apps/backend/src/modules/jobs/jobs.controller.ts`
- [ ] Create `apps/backend/src/modules/jobs/jobs.service.ts`
- [ ] Create `apps/backend/src/modules/jobs/jobs.repository.ts`
- [ ] Create `apps/backend/src/modules/jobs/jobs.schema.ts`
- [ ] Create `apps/backend/src/modules/jobs/jobs.types.ts`

## 16) Applications module

- [ ] Create `apps/backend/src/modules/applications/applications.route.ts`
- [ ] Create `apps/backend/src/modules/applications/applications.controller.ts`
- [ ] Create `apps/backend/src/modules/applications/applications.service.ts`
- [ ] Create `apps/backend/src/modules/applications/applications.repository.ts`
- [ ] Create `apps/backend/src/modules/applications/applications.schema.ts`
- [ ] Create `apps/backend/src/modules/applications/applications.types.ts`

## 17) Leads module

- [ ] Create `apps/backend/src/modules/leads/leads.route.ts`
- [ ] Create `apps/backend/src/modules/leads/leads.controller.ts`
- [ ] Create `apps/backend/src/modules/leads/leads.service.ts`
- [ ] Create `apps/backend/src/modules/leads/leads.repository.ts`
- [ ] Create `apps/backend/src/modules/leads/leads.schema.ts`
- [ ] Create `apps/backend/src/modules/leads/leads.types.ts`

## 18) Uploads module

- [ ] Create `apps/backend/src/modules/uploads/uploads.route.ts`
- [ ] Create `apps/backend/src/modules/uploads/uploads.controller.ts`
- [ ] Create `apps/backend/src/modules/uploads/uploads.service.ts`
- [ ] Create `apps/backend/src/modules/uploads/uploads.repository.ts` (optional)
- [ ] Create `apps/backend/src/modules/uploads/uploads.schema.ts`
- [ ] Create `apps/backend/src/modules/uploads/uploads.types.ts`

## 19) Dashboard module

- [ ] Create `apps/backend/src/modules/dashboard/dashboard.route.ts`
- [ ] Create `apps/backend/src/modules/dashboard/dashboard.controller.ts`
- [ ] Create `apps/backend/src/modules/dashboard/dashboard.service.ts`
- [ ] Create `apps/backend/src/modules/dashboard/dashboard.repository.ts`
- [ ] Create `apps/backend/src/modules/dashboard/dashboard.schema.ts`
- [ ] Create `apps/backend/src/modules/dashboard/dashboard.types.ts`

## 20) Final integration checklist

- [ ] Register all plugins in `src/app.ts`
- [ ] Register all route groups in `src/routes/index.ts`
- [ ] Apply auth guard for `/api/admin/*`
- [ ] Ensure public routes mounted under `/api/public/*`
- [ ] Ensure auth routes mounted under `/api/auth/*`
- [ ] Ensure health endpoint mounted under `/api/health`
- [ ] Validate `.env.example` includes all required runtime keys
- [ ] Confirm `npm --workspace apps/backend run build` passes
- [ ] Confirm `npm --workspace apps/backend run prisma:generate` passes
