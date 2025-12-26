CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    user_id UUID,
    action VARCHAR(255),
    entity VARCHAR(100),
    entity_id UUID,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
