# Auth Module Execution Script (Step-by-Step, File-by-File)

Goal: implement authentication first using the current Prisma schema and Fastify stack.

Scope for this script:
- register
- login
- JWT issue
- current user profile endpoint

---

## 0) Pre-flight checks

1. Confirm backend dependencies are installed for:
   - Fastify core
   - JWT plugin
   - Prisma client
   - password hashing package
   - schema validation package (if separate)
2. Confirm environment values exist for:
   - database URL
   - JWT secret
   - JWT expiry
3. Confirm Prisma client generation succeeds before wiring auth logic.

---

## 1) `src/modules/auth/auth.types.ts`

Create request/response type contracts first:

1. Register request contract:
   - name
   - email
   - password
   - role (optional, default editor)
2. Login request contract:
   - email
   - password
3. Shared auth response contract:
   - token payload string
   - expiry
   - public user object (id, name, email, role)
4. Me/profile response contract:
   - id, name, email, role, timestamps if needed

Result checkpoint:
- all downstream files can consume one consistent auth DTO set.

---

## 2) `src/modules/auth/auth.schema.ts`

Define runtime validation rules:

1. Register body validation:
   - name required, minimum length
   - email required, valid format
   - password required, minimum security length
   - role optional and limited to allowed enum values
2. Login body validation:
   - email required, valid format
   - password required
3. Response schema for success shape:
   - success
   - message
   - data object with token + user
4. Error schema shape aligned with global API convention.

Result checkpoint:
- malformed input fails fast at route boundary.

---

## 3) `src/modules/auth/auth.repository.ts`

Implement Prisma-only data access methods:

1. lookup admin user by email.
2. create admin user with hashed password and role.
3. lookup admin user by id for profile endpoint.
4. optional helper to check whether email already exists.

Rules:
- repository should not perform business decisions.
- return only needed fields whenever possible.

Result checkpoint:
- service layer can complete auth flow without direct Prisma calls.

---

## 4) `src/modules/auth/auth.service.ts`

Implement business flow and security behavior:

1. Register flow:
   - check duplicate email
   - hash incoming password
   - persist user via repository
   - issue JWT for new user (optional immediate sign-in)
   - return standardized auth response data
2. Login flow:
   - find user by email
   - compare password against stored hash
   - reject on mismatch with unauthorized error
   - issue JWT with user id + role claims
3. Me/profile flow:
   - read authenticated user id from request context
   - fetch user from repository
   - return not found when record missing

Error behavior:
- conflict for duplicate email
- unauthorized for invalid credentials
- not found for missing profile
- internal error passthrough to global handler

Result checkpoint:
- all auth rules centralized in service layer.

---

## 5) `src/modules/auth/auth.controller.ts`

Implement HTTP adapters only:

1. Register endpoint handler:
   - read validated request body
   - call register service method
   - send normalized success response and status
2. Login endpoint handler:
   - read validated request body
   - call login service method
   - send normalized success response
3. Me endpoint handler:
   - read authenticated principal from request
   - call profile service method
   - send normalized success response

Rules:
- no direct Prisma access
- no password/hash logic in controller

Result checkpoint:
- controller stays thin and predictable.

---

## 6) `src/modules/auth/auth.route.ts`

Wire endpoints + schemas + protection:

1. Public endpoints:
   - register
   - login
2. Protected endpoint:
   - current profile (requires JWT pre-handler)
3. Attach request/response schemas to each route.
4. Ensure route prefixes match project convention under auth namespace.

Result checkpoint:
- auth endpoints reachable with validation and guard behavior.

---

## 7) Route registration integration

Files:
- `src/routes/auth.route.ts`
- `src/routes/index.ts`

Steps:
1. Register auth module router in auth group.
2. Ensure auth group mounted at the expected base path.
3. Verify no duplicate route prefixing.

Result checkpoint:
- final endpoint paths match contract exactly.

---

## 8) Plugin and type integration

Files:
- `src/plugins/jwt.ts`
- `src/plugins/auth-guard.ts`
- `src/types/fastify.d.ts`

Steps:
1. Confirm JWT plugin is registered before routes.
2. Confirm auth guard decorator exists and is reusable.
3. Confirm request typing includes authenticated principal shape.

Result checkpoint:
- protected route can read authenticated principal safely.

---

## 9) Error handling alignment

Files:
- `src/common/errors/http-error.ts`
- `src/common/errors/error-handler.ts`
- `src/common/utils/api-response.ts`

Steps:
1. Ensure auth errors map to correct status codes:
   - duplicate registration → conflict
   - bad login → unauthorized
   - invalid body → bad request
2. Ensure every auth response follows the same success/error envelope.

Result checkpoint:
- consistent API behavior for frontend integration.

---

## 10) Auth module manual verification run

1. Register with a new email → expect success.
2. Register same email again → expect conflict.
3. Login with correct credentials → expect token.
4. Login with wrong password → expect unauthorized.
5. Access profile endpoint without token → expect unauthorized.
6. Access profile endpoint with token → expect user data.

---

## 11) Exit criteria (module complete)

- register endpoint implemented and validated
- login endpoint implemented and validated
- profile endpoint protected and validated
- Prisma repository calls isolated from controller
- all auth responses use standardized envelope
- all expected auth error states verified
