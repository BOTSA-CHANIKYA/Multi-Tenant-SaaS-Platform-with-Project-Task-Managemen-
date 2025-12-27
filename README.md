# Multi-Tenant SaaS Platform with Project & Task Management

## Description
A multi-tenant SaaS platform that allows multiple tenants to manage projects and tasks with role-based access control and subscription limits.

## Features
- Multi-tenant support with shared PostgreSQL database and tenant isolation middleware.
- User roles: super_admin, tenant_admin, user.
- JWT authentication for securing API access.
- CRUD operations for projects and tasks scoped per tenant.
- Audit logging for project create, update, and delete actions.
- Subscription-based restrictions (project_limit, task_limit) per tenant.
- Dockerized deployment for backend, frontend, and database.
- Health endpoint at `/api/health` for basic service monitoring.

## Tech Stack
- Backend: Node.js, Express
- Database: PostgreSQL
- Frontend: React
- Authentication: JWT
- Containerization: Docker

## Running the Project

### 1. Using Docker

From the project root:


docker-compose up -d

Services:

- Backend API: http://localhost:5000
- Health check: http://localhost:5000/api/health
- Frontend app: http://localhost:3000

### 2. Environment Configuration

Docker uses the provided `docker-compose.yml` and `file.env` files to configure services. [file:59][file:37]

Key variables:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` for PostgreSQL.
- `JWT_SECRET` for signing authentication tokens.
- `REACT_APP_BACKEND_URL` (frontend) pointing to `http://localhost:5000`.

## Database Seeding & Test Users

The database is initialized with migration and seed SQL files under `backend/db/migrations` and `backend/db/seeds`. [file:80][file:81][file:82][file:83][file:77][file:76][file:78]

### Super Admin

Defined in `001_seed_super_admin.sql`. [file:77]

- Email: `superadmin@system.com`
- Password: `Admin123`
- Role: `super_admin`
- Access: Global admin (manage tenants and configuration via backend APIs).

### Sample Tenant & Tenant Admin

Defined in `002_seed_sample_tenant.sql` and `003_seed_tenant_admin.sql`. [file:78][file:76]

- Tenant name: `Demo Corp` (sample tenant).
- Tenant admin email: `admin@demo.com`
- Tenant admin password: `Demo123`
- Role: `tenant_admin`
- Access: Manage projects and tasks for this tenant through the React dashboard.

Standard users under the sample tenant are created via `002_create_users.sql`. [file:82]

## API Overview

Key endpoints (all under `/api`):

- `POST /auth/login` – Authenticate user and return JWT plus role/tenant info. [file:38]
- `GET /projects` – List projects for current tenant.
- `POST /projects` – Create project (validates name and enforces per-tenant project_limit). [file:39]
- `PUT /projects/:id` – Update project details.
- `DELETE /projects/:id` – Delete project.
- `GET /tasks` – List tasks for current tenant.
- `POST /tasks` – Create task (validates name/status and enforces per-tenant task_limit). [file:36]
- `PUT /tasks/:id` – Update task name/description/status.
- `DELETE /tasks/:id` – Delete task.
- `GET /health` – Basic health status `{ "status": "ok" }`. [file:33]

Most endpoints require a `Bearer <token>` Authorization header issued by the login endpoint and validated by `auth.middleware.js` and `tenant.middleware.js`. [file:34][file:35]

## Frontend Usage

The React dashboard is available at `http://localhost:3000` once Docker containers are running. [file:59][file:48]

Main capabilities:

- Login with seeded tenant admin (`admin@demo.com` / `Demo123`) to access the dashboard.
- Create, list, search, paginate, and delete projects and tasks per tenant. [file:49]
- Update task status between `PENDING`, `IN_PROGRESS`, and `DONE`.
- View current role and tenant in the dashboard header.
- Logout, which clears JWT and role/tenant info from local storage. [file:64][file:49]
