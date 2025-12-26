INSERT INTO users (tenant_id, email, password_hash, role)
SELECT id, 'tenantadmin@acme.com', '$2b$10$eIXQh0TefbCE9H1ixKfZReF1A5D0k/5LxIh9W2H1U4q1S3U4vX6tW', 'tenant_admin'
FROM tenants
WHERE name='Acme Corp';
-- Password: "admin123" hashed
