# Technical Specification

## Backend
- Node.js v18
- Express framework
- Routes: /api/auth, /api/tenants, /api/projects, /api/tasks
- Middleware: auth, tenant isolation

## Database
- PostgreSQL
- Tables: tenants, users, projects, tasks, audit_logs
- Foreign keys and cascade deletes
- Seed data: super_admin, sample tenant, tenant_admin

## Authentication
- JWT for stateless auth
- Role-based access
- Password hashing with bcrypt

## Deployment
- Dockerized backend and frontend
- docker-compose for one-command startup
