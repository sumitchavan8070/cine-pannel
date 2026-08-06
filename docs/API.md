# CineMarathi API Documentation

## Overview

The CineMarathi API is a RESTful backend built with Express.js. It powers the CineMarathi platform for the Marathi film industry, including user management, casting calls, subscriptions, and admin functionality.

## Swagger (Interactive Documentation)

**Swagger UI** is enabled for interactive API exploration and testing.

- **Local**: http://localhost:3001/api-docs
- **Production**: https://your-api-domain.com/api-docs

In Swagger UI you can:

- Browse all endpoints
- See request/response schemas
- Try out requests with `Authorize` (add Bearer token)
- View responses

---

## Base URL

| Environment | Base URL |
|-------------|----------|
| Local | `http://localhost:3001/api` |
| Production | `https://api.cine.fluttertales.tech/api` |

---

## Authentication

### User Token (JWT)

- Use `POST /api/auth/login` with email and password
- Response includes `token`
- Send as `Authorization: Bearer <token>` for protected endpoints

### Admin Token (JWT)

- Use `POST /api/admin-auth/login` with admin email and password
- Response includes `token`
- Send as `Authorization: Bearer <token>` for admin endpoints

---

## API Endpoints Summary

### Admin Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin-auth/login` | Admin login |
| POST | `/admin-auth/verify` | Verify admin token |
| POST | `/admin-auth/logout` | Admin logout |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Dashboard stats |
| GET | `/admin/users` | List users |
| PUT | `/admin/users/:id/verify` | Verify user |
| PUT | `/admin/users/:id/suspend` | Suspend user |
| DELETE | `/admin/users/:id` | Delete user |
| POST | `/admin/users/:id/assign-premium` | Assign premium |
| DELETE | `/admin/users/:id/remove-premium` | Remove premium |
| GET | `/admin/premium-users` | List premium users |
| GET | `/admin/subscriptions` | List subscriptions |
| POST | `/admin/subscriptions` | Create subscription |
| PUT | `/admin/subscriptions/:id` | Update subscription |
| DELETE | `/admin/subscriptions/:id` | Delete subscription |
| GET | `/admin/casting-calls` | List casting calls |
| GET | `/admin/casting-calls/:id/applications` | List applications |
| PUT | `/admin/casting-calls/:id/approve` | Approve casting |
| PUT | `/admin/casting-calls/:id/reject` | Reject casting |
| DELETE | `/admin/casting-calls/:id` | Delete casting |
| GET | `/admin/news` | List news |
| POST | `/admin/news` | Create news |
| DELETE | `/admin/news/:id` | Delete news |
| GET | `/admin/featured-profiles` | List featured profiles |
| POST | `/admin/featured-profiles` | Feature profile |

### Admin Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/analytics/overview` | Analytics overview |
| GET | `/admin/analytics/stats` | Statistics |
| GET | `/admin/analytics/trends/registrations` | Registration trends |
| GET | `/admin/analytics/analytics/revenue` | Revenue analytics |
| GET | `/admin/analytics/analytics/active-users` | Active users |

### Admin Banners

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/banners` | List banners |
| POST | `/admin/banners` | Upload banner |
| PUT | `/admin/banners/:filename` | Update banner |
| DELETE | `/admin/banners/:filename` | Delete banner |

### Admin Database Backups

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/backups` | List backups (sorted by time, newest first) |
| POST | `/admin/backups` | Upload backup (multipart/form-data, `file` field) |
| GET | `/admin/backups/download/:key` | Get download URL for a backup |
| DELETE | `/admin/backups/:key` | Delete a backup |

**Auth for backups**: Use `Authorization: Bearer <admin_token>` or `X-API-Key: <BACKUP_API_KEY>` (for cron scripts). Set `BACKUP_API_KEY` in `.env` to enable API key auth.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | User login |
| POST | `/auth/change-password` | Change password |
| POST | `/auth/delete-account-request` | Request account deletion |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Get profile |
| PUT | `/users/profile` | Update profile |
| GET | `/users/actors` | List actors |
| GET | `/users/talents` | List talents |
| GET | `/users/dashboard` | User dashboard |

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subscriptions/plans` | Get premium plans |
| GET | `/subscriptions/status` | Get subscription status |
| POST | `/subscriptions/subscribe` | Subscribe to plan |
| POST | `/subscriptions/cancel` | Cancel subscription |

### Casting

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/casting/calls` | List casting calls |
| GET | `/casting/calls/:id` | Get casting call |
| POST | `/casting/calls` | Create casting call |
| POST | `/casting/apply` | Apply to casting |
| GET | `/casting/applications/my` | My applications |
| PUT | `/casting/applications/:id/status` | Update application status |

### Roles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/roles` | List roles |
| GET | `/roles/:id` | Get role |
| POST | `/roles` | Create role |
| PUT | `/roles/:id` | Update role |
| DELETE | `/roles/:id` | Delete role |
| GET | `/roles/:id/users` | Users with role |
| PUT | `/roles/assign` | Assign role |
| PUT | `/roles/bulk-assign` | Bulk assign |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search/casting-calls` | Search casting calls |
| GET | `/search/profiles` | Search profiles |
| GET | `/search/trending` | Trending content |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/events/upcoming` | Upcoming events |
| GET | `/notifications/` | User notifications |
| POST | `/upload/profile` | Upload profile image |
| POST | `/fcm/device/register` | Register FCM device |

---

## OpenAPI Spec

The full OpenAPI 3.0 specification is in `swagger.yaml` at the project root. You can:

- Import it into Postman or Insomnia
- Generate client SDKs
- Use it with API gateways

---

## Running the API

```bash
# Development (with auto-reload)
npm run api:dev

# Production
npm run api
```

Default port: **3001**

---

## Environment Variables

Key variables for the API:

- `PORT` – Server port (default: 3001)
- `JWT_SECRET` – Secret for JWT signing
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` – MySQL connection
- `NODE_ENV` – `development` or `production`

See `.env.example` for a full list.
