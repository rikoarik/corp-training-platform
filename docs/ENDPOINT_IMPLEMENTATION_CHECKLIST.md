# Endpoint-by-Endpoint Implementation Checklist (Mapped to Files)

Use this while implementing the backend to ensure every endpoint is wired through route, controller, service, repository, schema, and types consistently.

## Mapping Rule (apply to every endpoint)

- [ ] Route registration in `modules/<module>/<module>.route.ts`
- [ ] Request/response schema in `modules/<module>/<module>.schema.ts`
- [ ] Controller method in `modules/<module>/<module>.controller.ts`
- [ ] Service method in `modules/<module>/<module>.service.ts`
- [ ] Repository method in `modules/<module>/<module>.repository.ts` (if DB call needed)
- [ ] DTO/query types in `modules/<module>/<module>.types.ts`

---

## 1) Health + Root Route Aggregation

Files:
- `src/routes/health.route.ts`
- `src/routes/index.ts`

- [ ] `GET /api/health` implemented and returns app status payload
- [ ] Health route registered in `src/routes/index.ts`

---

## 2) Auth Module

Files:
- `src/modules/auth/auth.route.ts`
- `src/modules/auth/auth.schema.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/auth.repository.ts`
- `src/modules/auth/auth.types.ts`

- [ ] `POST /api/auth/login`
  - [ ] route
  - [ ] schema (email/password)
  - [ ] controller (validate + response)
  - [ ] service (credential flow + token issue)
  - [ ] repository (find user by email)
  - [ ] types (LoginBody, LoginResponse)
- [ ] `GET /api/auth/me`
  - [ ] route (auth guard)
  - [ ] schema (auth response)
  - [ ] controller
  - [ ] service
  - [ ] types (MeResponse)

---

## 3) Users Module (Admin)

Files:
- `src/modules/users/users.route.ts`
- `src/modules/users/users.schema.ts`
- `src/modules/users/users.controller.ts`
- `src/modules/users/users.service.ts`
- `src/modules/users/users.repository.ts`
- `src/modules/users/users.types.ts`

- [ ] `GET /api/admin/users`
- [ ] `POST /api/admin/users`
- [ ] `PATCH /api/admin/users/:id`
- [ ] `PATCH /api/admin/users/:id/password`
- [ ] Role guard enforced (`SUPERADMIN` where required)

Per endpoint:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository
- [ ] types

---

## 4) Homepage Module

Files:
- `src/modules/homepage/homepage.route.ts`
- `src/modules/homepage/homepage.schema.ts`
- `src/modules/homepage/homepage.controller.ts`
- `src/modules/homepage/homepage.service.ts`
- `src/modules/homepage/homepage.repository.ts`
- `src/modules/homepage/homepage.types.ts`

Public:
- [ ] `GET /api/public/homepage`

Admin:
- [ ] `GET /api/admin/homepage`
- [ ] `PUT /api/admin/homepage/banner`
- [ ] `POST /api/admin/homepage/featured-services`
- [ ] `PATCH /api/admin/homepage/featured-services/:id`
- [ ] `DELETE /api/admin/homepage/featured-services/:id`
- [ ] `POST /api/admin/homepage/testimonials`
- [ ] `PATCH /api/admin/homepage/testimonials/:id`
- [ ] `DELETE /api/admin/homepage/testimonials/:id`
- [ ] `POST /api/admin/homepage/partner-logos`
- [ ] `DELETE /api/admin/homepage/partner-logos/:id`

For all endpoints:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository
- [ ] types

---

## 5) Company Profile Module

Files:
- `src/modules/company-profile/company-profile.route.ts`
- `src/modules/company-profile/company-profile.schema.ts`
- `src/modules/company-profile/company-profile.controller.ts`
- `src/modules/company-profile/company-profile.service.ts`
- `src/modules/company-profile/company-profile.repository.ts`
- `src/modules/company-profile/company-profile.types.ts`

Public:
- [ ] `GET /api/public/company-profile`

Admin:
- [ ] `GET /api/admin/company-profile`
- [ ] `PUT /api/admin/company-profile`
- [ ] `POST /api/admin/company-profile/team`
- [ ] `PATCH /api/admin/company-profile/team/:id`
- [ ] `DELETE /api/admin/company-profile/team/:id`
- [ ] `POST /api/admin/company-profile/projects`
- [ ] `PATCH /api/admin/company-profile/projects/:id`
- [ ] `DELETE /api/admin/company-profile/projects/:id`
- [ ] `POST /api/admin/company-profile/legal-documents`
- [ ] `DELETE /api/admin/company-profile/legal-documents/:id`

For all endpoints:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository
- [ ] types

---

## 6) Categories Module

Files:
- `src/modules/categories/categories.route.ts`
- `src/modules/categories/categories.schema.ts`
- `src/modules/categories/categories.controller.ts`
- `src/modules/categories/categories.service.ts`
- `src/modules/categories/categories.repository.ts`
- `src/modules/categories/categories.types.ts`

Public:
- [ ] `GET /api/public/categories`

Admin:
- [ ] `GET /api/admin/categories`
- [ ] `POST /api/admin/categories`
- [ ] `PATCH /api/admin/categories/:id`
- [ ] `DELETE /api/admin/categories/:id`

For all endpoints:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository
- [ ] types

---

## 7) Trainings Module

Files:
- `src/modules/trainings/trainings.route.ts`
- `src/modules/trainings/trainings.schema.ts`
- `src/modules/trainings/trainings.controller.ts`
- `src/modules/trainings/trainings.service.ts`
- `src/modules/trainings/trainings.repository.ts`
- `src/modules/trainings/trainings.types.ts`

Public:
- [ ] `GET /api/public/trainings`
- [ ] `GET /api/public/trainings/:slug`

Admin:
- [ ] `GET /api/admin/trainings`
- [ ] `POST /api/admin/trainings`
- [ ] `PATCH /api/admin/trainings/:id`
- [ ] `DELETE /api/admin/trainings/:id`

For all endpoints:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository
- [ ] types

---

## 8) Schedules Module

Files:
- `src/modules/schedules/schedules.route.ts`
- `src/modules/schedules/schedules.schema.ts`
- `src/modules/schedules/schedules.controller.ts`
- `src/modules/schedules/schedules.service.ts`
- `src/modules/schedules/schedules.repository.ts`
- `src/modules/schedules/schedules.types.ts`

Public:
- [ ] `GET /api/public/schedules`
- [ ] `GET /api/public/schedules/:id`

Admin:
- [ ] `GET /api/admin/schedules`
- [ ] `POST /api/admin/schedules`
- [ ] `PATCH /api/admin/schedules/:id`
- [ ] `DELETE /api/admin/schedules/:id`

For all endpoints:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository
- [ ] types

---

## 9) Participants Module

Files:
- `src/modules/participants/participants.route.ts`
- `src/modules/participants/participants.schema.ts`
- `src/modules/participants/participants.controller.ts`
- `src/modules/participants/participants.service.ts`
- `src/modules/participants/participants.repository.ts`
- `src/modules/participants/participants.types.ts`

Public:
- [ ] `POST /api/public/participants/register`

Admin:
- [ ] `GET /api/admin/participants`
- [ ] `GET /api/admin/participants/:id`
- [ ] `PATCH /api/admin/participants/:id`
- [ ] `POST /api/admin/participants/:id/attendance`
- [ ] `POST /api/admin/participants/:id/certificate`

For all endpoints:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository
- [ ] types

---

## 10) Articles Module

Files:
- `src/modules/articles/articles.route.ts`
- `src/modules/articles/articles.schema.ts`
- `src/modules/articles/articles.controller.ts`
- `src/modules/articles/articles.service.ts`
- `src/modules/articles/articles.repository.ts`
- `src/modules/articles/articles.types.ts`

Public:
- [ ] `GET /api/public/articles/latest`
- [ ] `GET /api/public/articles/popular`
- [ ] `GET /api/public/articles/:slug`

Admin:
- [ ] `GET /api/admin/articles`
- [ ] `POST /api/admin/articles`
- [ ] `PATCH /api/admin/articles/:id`
- [ ] `PATCH /api/admin/articles/:id/publish`
- [ ] `PATCH /api/admin/articles/:id/archive`
- [ ] `DELETE /api/admin/articles/:id`

For all endpoints:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository
- [ ] types

---

## 11) Jobs Module

Files:
- `src/modules/jobs/jobs.route.ts`
- `src/modules/jobs/jobs.schema.ts`
- `src/modules/jobs/jobs.controller.ts`
- `src/modules/jobs/jobs.service.ts`
- `src/modules/jobs/jobs.repository.ts`
- `src/modules/jobs/jobs.types.ts`

Public:
- [ ] `GET /api/public/jobs`
- [ ] `GET /api/public/jobs/:slug`

Admin:
- [ ] `GET /api/admin/jobs`
- [ ] `POST /api/admin/jobs`
- [ ] `PATCH /api/admin/jobs/:id`
- [ ] `PATCH /api/admin/jobs/:id/publish`
- [ ] `PATCH /api/admin/jobs/:id/archive`
- [ ] `DELETE /api/admin/jobs/:id`

For all endpoints:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository
- [ ] types

---

## 12) Applications Module

Files:
- `src/modules/applications/applications.route.ts`
- `src/modules/applications/applications.schema.ts`
- `src/modules/applications/applications.controller.ts`
- `src/modules/applications/applications.service.ts`
- `src/modules/applications/applications.repository.ts`
- `src/modules/applications/applications.types.ts`

Public:
- [ ] `POST /api/public/jobs/:jobId/applications`

Admin:
- [ ] `GET /api/admin/applications`
- [ ] `GET /api/admin/applications/:id`
- [ ] `PATCH /api/admin/applications/:id/status`

For all endpoints:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository
- [ ] types

---

## 13) Leads Module

Files:
- `src/modules/leads/leads.route.ts`
- `src/modules/leads/leads.schema.ts`
- `src/modules/leads/leads.controller.ts`
- `src/modules/leads/leads.service.ts`
- `src/modules/leads/leads.repository.ts`
- `src/modules/leads/leads.types.ts`

Public:
- [ ] `POST /api/public/leads`

Admin:
- [ ] `GET /api/admin/leads`
- [ ] `GET /api/admin/leads/:id`

For all endpoints:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository
- [ ] types

---

## 14) Uploads Module

Files:
- `src/modules/uploads/uploads.route.ts`
- `src/modules/uploads/uploads.schema.ts`
- `src/modules/uploads/uploads.controller.ts`
- `src/modules/uploads/uploads.service.ts`
- `src/modules/uploads/uploads.repository.ts` (optional)
- `src/modules/uploads/uploads.types.ts`

Admin:
- [ ] `POST /api/admin/uploads`

Optional split:
- [ ] `POST /api/admin/uploads/images`
- [ ] `POST /api/admin/uploads/documents`
- [ ] `POST /api/admin/uploads/certificates`

For all endpoints:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository (if metadata persistence)
- [ ] types

---

## 15) Dashboard Module

Files:
- `src/modules/dashboard/dashboard.route.ts`
- `src/modules/dashboard/dashboard.schema.ts`
- `src/modules/dashboard/dashboard.controller.ts`
- `src/modules/dashboard/dashboard.service.ts`
- `src/modules/dashboard/dashboard.repository.ts`
- `src/modules/dashboard/dashboard.types.ts`

Admin:
- [ ] `GET /api/admin/dashboard/summary`

For endpoint:
- [ ] route
- [ ] schema
- [ ] controller
- [ ] service
- [ ] repository
- [ ] types

---

## 16) Router wiring checklist

Files:
- `src/routes/auth.route.ts`
- `src/routes/public.route.ts`
- `src/routes/admin.route.ts`
- `src/routes/index.ts`

- [ ] Auth module mounted under `/api/auth`
- [ ] Public modules mounted under `/api/public`
- [ ] Admin modules mounted under `/api/admin`
- [ ] JWT preHandler applied for all admin routers
- [ ] Role guards applied where needed

---

## 17) Cross-cutting verification per endpoint

- [ ] Input validation present in schema
- [ ] Error mapping uses consistent response shape
- [ ] Pagination applied on list endpoints
- [ ] Search/filter support implemented where required
- [ ] Slug uniqueness and conflict handling implemented
- [ ] Quota and business-rule validation implemented
- [ ] Auth + role restrictions enforced
