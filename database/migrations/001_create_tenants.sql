CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    subscription_plan VARCHAR(20) NOT NULL CHECK (subscription_plan IN ('FREE', 'PRO', 'ENTERPRISE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
