# System Architecture

## Overview
- Single database for all tenants
- Backend: Node.js + Express
- Frontend: React
- Dockerized for deployment

## Component Diagram
- PostgreSQL database
- Express server with middleware
- JWT-based authentication
- Tenant isolation middleware
- Project & Task API routes
- Audit logging

## Flow
1. User logs in → JWT issued
2. API request → Auth middleware verifies JWT
3. Tenant middleware enforces isolation
4. Controller executes CRUD operations
5. Audit logs recorded
