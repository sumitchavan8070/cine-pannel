# CineMarathi Admin Panel Documentation

## Overview

The CineMarathi Admin Panel is a Next.js web application for managing the CineMarathi platform. It provides a centralized interface for administrators to manage users, casting calls, subscriptions, banners, and more.

## Access

- **URL**: `/admin` (e.g., `http://localhost:3000/admin` or your deployed URL)
- **Login**: Admin users must log in with credentials stored in the database (`user_type = 'admin'`)

## Authentication

1. Navigate to `/admin/login`
2. Enter admin email and password
3. On success, a JWT token is stored in `localStorage` and used for subsequent API calls
4. Token is verified on each protected page load via `POST /api/admin-auth/verify`
5. Logout clears the token and redirects to login

## Navigation Structure

| Section | Path | Description |
|---------|------|-------------|
| Dashboard | `/admin` | Overview with analytics, charts, and key metrics |
| Users | `/admin/users` | Manage all platform users |
| Premium Users | `/admin/premium-users` | Manage premium subscriptions |
| Casting Calls | `/admin/casting` | Approve, reject, or manage casting calls |
| Subscriptions | `/admin/subscriptions` | View and manage all subscriptions |
| App Banners | `/admin/banners` | Upload and manage app home screen banners |
| Database Backups | `/admin/backups` | View, download, and delete database backup files from S3 |
| Manage Roles | `/admin/roles` | Configure user roles and permissions |
| Settings | `/admin/settings` | Admin settings |

---

## Dashboard (`/admin`)

- **Purpose**: High-level overview of platform activity
- **Features**:
  - Total users, active listings, revenue, growth rate
  - Line chart: User registrations and revenue over time
  - Bar chart: User activity
  - Pie chart: User type distribution (Actors, Technicians, Production Houses)
- **API**: `GET /api/admin/analytics/overview`

---

## Users (`/admin/users`)

- **Purpose**: View and manage all registered users
- **Features**:
  - Search users by name or email
  - Filter by user type (actor, technician, production_house, etc.)
  - Verify users (checkmark badge)
  - Suspend users
  - Delete users
  - Create new users (link to `/admin/users/create`)
- **APIs**:
  - `GET /api/admin/users` – List users (optional `user_type` query)
  - `PUT /api/admin/users/:id/verify` – Verify user
  - `PUT /api/admin/users/:id/suspend` – Suspend user
  - `DELETE /api/admin/users/:id` – Delete user

---

## Premium Users (`/admin/premium-users`)

- **Purpose**: Manage premium and lifetime subscriptions
- **Features**:
  - List all users with active premium subscriptions
  - Search users to assign premium
  - Assign yearly premium (365 days) to any user
  - Remove premium from users
- **APIs**:
  - `GET /api/admin/premium-users` – List premium users
  - `POST /api/admin/users/:id/assign-premium` – Assign premium
  - `DELETE /api/admin/users/:id/remove-premium` – Remove premium

---

## Casting Calls (`/admin/casting`)

- **Purpose**: Moderate casting calls posted by production houses
- **Features**:
  - View all casting calls with application counts
  - Approve or reject casting calls
  - Delete casting calls
  - View applications per casting call
- **APIs**:
  - `GET /api/admin/casting-calls` – List casting calls
  - `GET /api/admin/casting-calls/:id/applications` – List applications
  - `PUT /api/admin/casting-calls/:id/approve` – Approve
  - `PUT /api/admin/casting-calls/:id/reject` – Reject
  - `DELETE /api/admin/casting-calls/:id` – Delete

---

## Subscriptions (`/admin/subscriptions`)

- **Purpose**: Manage all user subscriptions
- **Features**:
  - View subscriptions with user, plan, dates, status
  - Create new subscriptions
  - Update subscription (plan, dates, active status)
  - Delete subscriptions
- **APIs**:
  - `GET /api/admin/subscriptions` – List subscriptions
  - `POST /api/admin/subscriptions` – Create subscription
  - `PUT /api/admin/subscriptions/:id` – Update subscription
  - `DELETE /api/admin/subscriptions/:id` – Delete subscription

---

## App Banners (`/admin/banners`)

- **Purpose**: Manage banners shown on the app home screen
- **Features**:
  - List existing banners
  - Upload new banner (image file)
  - Update banner image
  - Delete banner
- **APIs**:
  - `GET /api/admin/banners` – List banners
  - `POST /api/admin/banners` – Upload banner (multipart/form-data)
  - `PUT /api/admin/banners/:filename` – Update banner
  - `DELETE /api/admin/banners/:filename` – Delete banner

---

## Database Backups (`/admin/backups`)

- **Purpose**: View and manage database backup files stored in S3 (folder: `database-backup/`)
- **Features**:
  - List backups sorted by upload time (newest first)
  - Download backup files
  - Delete backups
- **APIs**:
  - `GET /api/admin/backups` – List backups
  - `POST /api/admin/backups` – Upload backup (multipart/form-data, `file` field)
  - `GET /api/admin/backups/download/:key` – Get download URL
  - `DELETE /api/admin/backups/:key` – Delete backup
- **Cron upload**: Use `X-API-Key: <BACKUP_API_KEY>` header or `Authorization: Bearer <admin_token>`. Set `BACKUP_API_KEY` in `.env` for cron scripts.

---

## Manage Roles (`/admin/roles`)

- **Purpose**: Configure user roles and permissions
- **Features**:
  - List roles
  - Create, update, delete roles
  - Assign roles to users
  - Bulk assign roles
- **APIs**:
  - `GET /api/roles` – List roles
  - `GET /api/roles/:id` – Get role
  - `POST /api/roles` – Create role
  - `PUT /api/roles/:id` – Update role
  - `DELETE /api/roles/:id` – Delete role
  - `GET /api/roles/:id/users` – List users with role
  - `PUT /api/roles/assign` – Assign role to user
  - `PUT /api/roles/bulk-assign` – Bulk assign

---

## Settings (`/admin/settings`)

- **Purpose**: Admin panel and platform settings
- **Features**: Configure various admin preferences (implementation may vary)

---

## API Base URL

The admin panel uses the API base URL from environment variables:

- **Local**: `NEXT_PUBLIC_API_BASE_URL_LOCAL` (default: `http://localhost:3001/api`)
- **Production**: `NEXT_PUBLIC_API_BASE_URL_LIVE` (e.g., `https://api.cine.fluttertales.tech/api`)

When using relative URLs (`/api/...`), Next.js rewrites proxy requests to the API server.

---

## Creating an Admin User

Run the create-admin script:

```bash
npm run create-admin
```

Or use the `scripts/create-admin.js` script to add an admin user to the database.

---

## Security Notes

- Admin routes require a valid JWT with `role: 'admin'`
- Token is sent as `Authorization: Bearer <token>`
- Unverified admin accounts cannot log in
- Always use HTTPS in production
