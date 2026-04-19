# Backend Implementation Progress (Core-First)

Last update: 2026-04-17

This report tracks actual implementation status in `apps/backend/src` against `docs/ENDPOINT_IMPLEMENTATION_CHECKLIST.md`.

## Status Legend

- DONE: endpoint + wiring + core layers are implemented
- PARTIAL: endpoint exists but there is a contract/path mismatch or a layer gap
- PENDING: not implemented yet

## 1) Health + Route Aggregation

- DONE `GET /api/health`
- DONE health route registered in `src/routes/index.ts`

## 2) Auth Module

- DONE `POST /api/auth/login`
- DONE `GET /api/auth/me`
- DONE module layers: route/schema/controller/service/repository/types
- Note: `POST /api/auth/register` also exists (extra beyond checklist section)

## 3) Users Module (Admin)

- DONE `GET /api/admin/users`
- DONE `POST /api/admin/users`
- DONE `PATCH /api/admin/users/:id`
- DONE `PATCH /api/admin/users/:id/password`
- PARTIAL role guard note in checklist says `SUPERADMIN`, current schema only supports `ADMIN`/`USER`, guard enforced with `ADMIN`
- DONE module layers: route/schema/controller/service/repository/types

## 4) Homepage Module

- PENDING all endpoints

## 5) Company Profile Module

- PENDING all endpoints

## 6) Categories Module

- DONE `GET /api/public/categories`
- DONE `GET /api/admin/categories`
- DONE `POST /api/admin/categories`
- DONE `PATCH /api/admin/categories/:id`
- DONE `DELETE /api/admin/categories/:id`
- DONE extra `GET /api/public/categories/:id`
- DONE extra `GET /api/admin/categories/:id`
- DONE module layers: schema/controller/service/types
- PARTIAL repository file is not split yet (DB access still inside service)

## 7) Trainings Module

- DONE `GET /api/public/trainings`
- PARTIAL checklist asks `GET /api/public/trainings/:slug`, current path is `GET /api/public/trainings/:id`
- DONE `GET /api/admin/trainings`
- DONE `POST /api/admin/trainings`
- DONE `PATCH /api/admin/trainings/:id`
- DONE `DELETE /api/admin/trainings/:id`
- DONE extra `GET /api/admin/trainings/:id`
- DONE module layers: route/schema/controller/service/repository/types

## 8) Schedules Module

- DONE `GET /api/public/schedules`
- DONE `GET /api/public/schedules/:id`
- DONE `GET /api/admin/schedules`
- DONE `POST /api/admin/schedules`
- DONE `PATCH /api/admin/schedules/:id`
- DONE `DELETE /api/admin/schedules/:id`
- DONE extra `GET /api/admin/schedules/:id`
- DONE module layers: route/schema/controller/service/repository/types

## 9) Participants Module

- DONE `POST /api/public/participants/register`
- DONE `GET /api/admin/participants`
- DONE `GET /api/admin/participants/:id`
- DONE `PATCH /api/admin/participants/:id`
- DONE `POST /api/admin/participants/:id/attendance`
- DONE `POST /api/admin/participants/:id/certificate`
- DONE module layers: route/schema/controller/service/repository/types
- Note: attendance/certificate currently implemented as safe business-flow stubs (no separate certificate table persistence yet)

## 10) Articles Module

- DONE `GET /api/public/articles/latest`
- DONE `GET /api/public/articles/popular`
- DONE `GET /api/public/articles/:slug`
- DONE `GET /api/admin/articles`
- DONE `POST /api/admin/articles`
- DONE `PATCH /api/admin/articles/:id`
- DONE `PATCH /api/admin/articles/:id/publish`
- DONE `PATCH /api/admin/articles/:id/archive`
- DONE `DELETE /api/admin/articles/:id`
- DONE module layers: route/schema/controller/service/repository/types

## 11) Jobs Module

- PENDING all endpoints and module layers

## 12) Applications Module

- PENDING all endpoints and module layers

## 13) Leads Module

- PENDING all endpoints and module layers

## 14) Uploads Module

- PENDING all endpoints and module layers

## 15) Dashboard Module

- PENDING all endpoints and module layers

## 16) Router Wiring Checklist

- DONE auth mounted under `/api/auth`
- DONE public mounted under `/api/public`
- DONE admin mounted under `/api/admin`
- DONE JWT preHandler applied for admin group
- PARTIAL role model mismatch with checklist wording (`SUPERADMIN` vs current Prisma `ADMIN`)

## 17) Current Gap Summary

1. `trainings/:slug` contract mismatch (currently `:id`)
2. categories service still contains DB logic (no dedicated repository file)
3. phase-2 modules (jobs/applications/leads/uploads/dashboard) are still empty
4. checklist module naming uses plural folders while current codebase uses singular active folders for implemented modules

## Recommended Next Implementation Order

1. Fix training public path to slug (`GET /api/public/trainings/:slug`)
2. Add `category.repository.ts` and move Prisma calls out of service
3. Implement Jobs module first (it unlocks Applications)
4. Implement Applications, then Leads, Uploads, Dashboard
