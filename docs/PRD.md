# Product Requirements Document

## Objective
Develop a multi-tenant SaaS platform with project and task management.

## Features
1. Multi-tenant support
2. User roles: super_admin, tenant_admin, user
3. JWT authentication
4. CRUD for projects and tasks
5. Audit logging
6. Subscription plans with limitations
7. Health endpoint

## Functional Requirements
- Users can only access their tenant data
- Super admin can access all tenant data
- Passwords stored securely with bcrypt
