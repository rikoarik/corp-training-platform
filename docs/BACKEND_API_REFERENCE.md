# Backend API Reference

Base URL: `/api`

## Health

- `GET /health`
  - Auth: none
  - Response: service status and timestamp

## Auth

- `POST /auth/register`
  - Auth: none
  - Body: `name`, `email`, `password`, optional `role`
  - Response: `token`, `expiresIn`, `user`
- `POST /auth/login`
  - Auth: none
  - Body: `email`, `password`
  - Response: `token`, `expiresIn`, `user`
- `GET /auth/me`
  - Auth: Bearer token
  - Response: current authenticated user

## Public

- `GET /public/trainings`
- `GET /public/trainings/:id`
- `GET /public/schedules`
- `GET /public/schedules/:id`
- `POST /public/participants/register`
- `GET /public/articles`
- `GET /public/articles/:id`

All public endpoints use the same response envelope:

```json
{
  "success": true,
  "message": "Operation success",
  "data": {}
}
```

## Admin

All `/admin/*` endpoints require Bearer token.

- Trainings
  - `GET /admin/trainings`
  - `POST /admin/trainings`
  - `PUT /admin/trainings/:id`
  - `DELETE /admin/trainings/:id`
- Schedules
  - `GET /admin/schedules`
  - `GET /admin/schedules/:id`
  - `POST /admin/schedules`
  - `PUT /admin/schedules/:id`
  - `DELETE /admin/schedules/:id`
- Participants
  - `GET /admin/participants`
- Articles
  - `GET /admin/articles`
  - `POST /admin/articles`
  - `PUT /admin/articles/:id`
  - `DELETE /admin/articles/:id`

## Error Envelope

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE"
  }
}
```
