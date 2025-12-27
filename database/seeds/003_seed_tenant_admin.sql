INSERT INTO users (tenant_id, email, password_hash, role)
SELECT id, 'tenantadmin@acme.com', '$2b$10$bUOGiA/2yHmpxI0JovXE2OEo12vwfJzIbMXsiM5lj2f6B9cGjyzpa', 'tenant_admin'
FROM tenants
WHERE name='Acme Corp';
-- Password: "admin123" hashed

