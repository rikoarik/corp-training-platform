# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is an npm workspace monorepo for a corporate training platform with:
- a public marketing site
- an admin CMS/back-office
- a Fastify API backed by Prisma/PostgreSQL

Workspaces:
- `apps/frontend` — Vite + React + TypeScript frontend for both the public site and admin UI
- `apps/backend` — Fastify + Prisma API
- `docs` — backend/API implementation notes and references
- `deployment` — deployment-related assets when present

## Common commands

Run from the repository root unless noted otherwise.

### Install dependencies
- `npm install`

### Start development servers
- `npm run dev:backend`
- `npm run dev:frontend`

Frontend defaults to the backend at `http://localhost:4000/api` via `apps/frontend/src/lib/env.ts`.

### Build
- `npm run build`
- Frontend only: `npm --workspace apps/frontend run build`
- Backend only: `npm --workspace apps/backend run build`

### Typecheck / lint
This repo uses TypeScript compile checks as its lint step.
- `npm run lint`
- Frontend only: `npm --workspace apps/frontend run lint`
- Backend only: `npm --workspace apps/backend run lint`

### Tests
There is currently a backend smoke test suite using Node's test runner through `tsx`.
- All backend smoke tests: `npm --workspace apps/backend run test`
- Single test by name: `npm --workspace apps/backend exec tsx --test --test-name-pattern="GET /api/health returns healthy payload" src/smoke.test.ts`

### Prisma / database
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`

### API docs
When the backend is running, Swagger UI is available at `/docs` and the OpenAPI JSON at `/docs/json`.

## Environment

Backend startup requires at least:
- `DATABASE_URL`
- `JWT_SECRET`

Useful backend defaults defined in `apps/backend/src/config/env.ts`:
- `PORT` defaults to `4000`
- `HOST` defaults to `0.0.0.0`
- `JWT_EXPIRES_IN` defaults to `1d`
- `UPLOAD_DIR` defaults to `./uploads`
- `APP_URL` defaults to `http://127.0.0.1:4174`

Frontend expects:
- `VITE_API_BASE_URL` (defaults to `http://localhost:4000/api` if unset)

## High-level architecture

### Monorepo shape
The root workspace scripts mostly delegate into `apps/frontend` and `apps/backend`. There is no separate admin frontend app: the public website and admin panel live in the same React application and route tree.

### Frontend architecture
- Main route composition lives in `apps/frontend/src/App.tsx`.
- Public pages are nested under `PublicLayout`; admin pages are nested under `AdminLayout` and protected by `AdminRouteGuard`.
- The frontend talks to the backend exclusively through thin service modules:
  - `apps/frontend/src/services/public.ts`
  - `apps/frontend/src/services/admin.ts`
  - `apps/frontend/src/services/auth.ts`
- Shared HTTP behavior is centralized in `apps/frontend/src/lib/api.ts` using Axios and a consistent API envelope.
- Async page loading is typically handled with `useAsyncData` in `apps/frontend/src/hooks/useAsyncData.ts`.

### Public site content model
The public site is split between:
- dynamic content fetched from the API (`/public/pages/:slug`, trainings, schedules, articles)
- a small static branding/contact layer in `apps/frontend/src/lib/site-content.ts`

Important consequence: many "static" marketing pages are actually driven by the `PublicPage` table and seeded JSON content, not hardcoded page copy.

### Admin auth flow
- Login uses `/auth/login` and stores the session in `localStorage`.
- `getStoredSession()` restores the bearer token into the Axios client.
- `AdminRouteGuard` validates the stored token by calling `/auth/me` before allowing access to admin routes.

If admin pages appear logged out unexpectedly, check the frontend auth storage flow in `apps/frontend/src/services/auth.ts` before changing route logic.

### Backend architecture
Backend entry and composition:
- `apps/backend/src/index.ts` — process startup/shutdown
- `apps/backend/src/app.ts` — builds the Fastify instance and registers plugins/routes
- `apps/backend/src/routes/index.ts` — mounts route groups under `/api`

Top-level route groups:
- `/api/health`
- `/api/auth`
- `/api/public`
- `/api/admin`

The backend follows a module-oriented pattern. Most domain areas use:
- `*.route.ts` or route registration in `routes/*.ts`
- `*.controller.ts` for Fastify handlers
- `*.service.ts` for business rules/validation/orchestration
- `*.repository.ts` for Prisma queries
- `*.schema.ts` for request/response schemas
- `*.types.ts` for module-local TypeScript types

This pattern is clearest in modules like training, schedule, participant, article, category, public-page, and contact-inquiry.

### Request lifecycle and API behavior
- Fastify plugins register CORS, JWT, Prisma, multipart/static serving, auth guard support, and Swagger.
- Request validation and documented response schemas are defined close to routes.
- Errors are normalized through the shared error handler in `apps/backend/src/common/errors/error-handler.ts`.
- Frontend clients expect the backend's success/error envelope shape; preserve that contract when adding endpoints.

### Admin vs public backend behavior
The same underlying domain entities often have separate public and admin read paths:
- public endpoints filter toward published/open content
- admin endpoints expose draft/archive states and mutation operations

Example: training and schedule modules expose separate public/admin listing and detail functions instead of one generic handler.

### Data model
Core Prisma entities in `apps/backend/prisma/schema.prisma`:
- `User` — admin/auth accounts
- `Category` → `Training` → `Schedule` — the main training catalog hierarchy
- `Participant` — registrations tied to schedules
- `Article` — content authored by users
- `PublicPage` — JSON-backed CMS-like content for marketing pages
- `ContactInquiry` — submissions from the contact form

Status enums are important to behavior:
- `PublishStatus` controls visibility for trainings/articles/public-facing content flows
- `ScheduleStatus` controls whether a schedule is open or no longer available
- `ParticipantStatus` tracks registration state

### Seed data and local setup assumptions
`apps/backend/prisma/seed.ts` does more than create an admin user. It also seeds:
- a default category/training/schedule
- a published article
- multiple `PublicPage` records with large JSON content blobs

If a public page looks empty locally, check whether migrations and seed data have been run before editing frontend rendering.

## Key references
- `README.md` — setup overview
- `docs/BACKEND_API_REFERENCE.md` — current API surface summary
- `apps/backend/src/smoke.test.ts` — current backend test coverage and example request expectations

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
