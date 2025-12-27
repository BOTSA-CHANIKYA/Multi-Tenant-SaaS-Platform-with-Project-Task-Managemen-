const db = require('../config/db');

async function logAudit({ tenantId, userId, action, entityType, entityId, metadata }) {
  try {
    await db.query(
      `INSERT INTO audit_logs
       (tenant_id, user_id, action, entity_type, entity_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [tenantId, userId, action, entityType, entityId, metadata || null]
    );
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

module.exports = { logAudit };
