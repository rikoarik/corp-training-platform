# Prisma Schema Verification Checklist

Use this checklist to verify your Prisma schema for **relations, constraints, and indexes** before migrating to production.

Schema reviewed: `apps/backend/prisma/schema.prisma`

---

## A) Required Models Coverage (from project requirements)

- [x] `User` (admin users)
- [x] `Training`
- [x] `Category`
- [x] `Schedule`
- [x] `Participant`
- [x] `Article`
- [x] `Job`
- [x] `Application`

Additional supporting models found (good for feature completeness):
- [x] `Trainer`, `Attendance`, `TrainingMaterial`, `Certificate`
- [x] CMS/content models (`CompanyProfile`, `HomepageBanner`, `FeaturedService`, etc.)
- [x] `Lead`

---

## B) Relation Integrity Checklist

### Core business relations
- [x] `Category 1 - n Training`
- [x] `Training 1 - n Schedule`
- [x] `Schedule 1 - n Participant`
- [x] `Participant 1 - n Attendance`
- [x] `Participant 1 - n Certificate` (confirm if this should be 1-1)
- [x] `Job 1 - n Application`
- [x] `User 1 - n Article`
- [x] `User 1 - n Job`

### Relation delete policies
- [x] Cascade where child records should be removed (e.g. `Schedule -> Participant`, `Job -> Application`)
- [x] Restrict where parent must be preserved (e.g. `Article.author`, `Job.author`)
- [x] SetNull where optional reference is acceptable (`Schedule.trainer`, `LegalDocument.certification`)

### Optional architectural confirmations
- [ ] Confirm if `CompanyProfile` is intended as singleton (single row only)
- [ ] Confirm if `HomepageBanner` should allow only one active banner at a time

---

## C) Uniqueness & Conflict Constraints

Already present:
- [x] `User.email` unique
- [x] `Category.slug` unique
- [x] `Training.slug` unique
- [x] `Article.slug` unique
- [x] `Job.slug` unique

Recommended to add (important):
- [ ] Prevent duplicate participant registration per schedule: `@@unique([scheduleId, email])` on `Participant`
- [ ] If one certificate per participant is required: `@unique` on `Certificate.participantId`
- [ ] If one attendance record per participant per day/session is required, add suitable composite unique key

---

## D) Index Coverage Checklist

Already present:
- [x] `Schedule`: `@@index([startDate])`
- [x] `Schedule`: `@@index([method])`
- [x] `Participant`: `@@index([scheduleId, paymentStatus])`
- [x] `Article`: `@@index([status, publishedAt])`
- [x] `Application`: `@@index([jobId, status])`

Recommended indexes for query-heavy endpoints:
- [ ] `Training`: add `@@index([categoryId, status])`
- [ ] `Schedule`: add `@@index([trainingId])`
- [ ] `Schedule`: add `@@index([location])` (if location filter is common)
- [ ] `Schedule`: consider composite `@@index([method, startDate])` for calendar/filter queries
- [ ] `Participant`: add `@@index([email])` for participant search/history
- [ ] `Job`: add `@@index([status, publishedAt])`
- [ ] `Lead`: add `@@index([createdAt])` and optionally `@@index([source])`

---

## E) Data Type & Domain Rules

- [x] Price fields use decimal (`@db.Decimal(10, 2)`) for financial precision
- [x] Enums used for controlled states (`PublishStatus`, `ScheduleMethod`, etc.)
- [x] Audit fields present (`createdAt`, `updatedAt`) on most entities

Recommended checks:
- [ ] Ensure service-layer validation enforces non-negative `price` and `quota`
- [ ] Ensure service-layer validation enforces `endDate >= startDate`
- [ ] Ensure publish-state transitions are controlled in service layer
- [ ] Ensure quota logic blocks overbooking during participant registration

---

## F) Operational Readiness

- [ ] Run `npm --workspace apps/backend run prisma:generate`
- [ ] Run `npm --workspace apps/backend run prisma:migrate -- --name init`
- [ ] Run `npm --workspace apps/backend run prisma:seed`
- [ ] Run `npm --workspace apps/backend run prisma:studio` and manually inspect relations

---

## G) Pre-Production Sign-off

- [ ] All required uniqueness constraints added and tested
- [ ] All high-frequency query indexes added and verified via explain/analyze
- [ ] Referential actions validated against expected business behavior
- [ ] Seed data includes realistic fixtures for public pages + admin dashboard
- [ ] Migration tested on fresh database and on staging-like data
