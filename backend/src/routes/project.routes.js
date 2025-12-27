const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");
const { logAudit } = require("../utils/audit");

// Create project
router.post("/", auth, tenant, async (req, res) => {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Project name is required" });
  }
  if (name.trim().length > 100) {
    return res
      .status(400)
      .json({ message: "Project name must be at most 100 characters" });
  }

  try {
    // enforce project limit per tenant
    const limitRes = await db.query(
      "SELECT project_limit FROM tenants WHERE id = $1",
      [req.tenantId]
    );
    const projectLimit = limitRes.rows[0]?.project_limit ?? 5;

    const countRes = await db.query(
      "SELECT COUNT(*) FROM projects WHERE tenant_id = $1",
      [req.tenantId]
    );
    const currentCount = parseInt(countRes.rows[0].count, 10);

    if (currentCount >= projectLimit) {
      return res
        .status(403)
        .json({ message: "Project limit reached for current plan" });
    }

    const result = await db.query(
      "INSERT INTO projects (tenant_id, name, description) VALUES ($1, $2, $3) RETURNING *",
      [req.tenantId, name, description || null]
    );
    const project = result.rows[0];

    await logAudit({
      tenantId: req.tenantId,
      userId: req.user.userId,
      action: "project_created",
      entityType: "project",
      entityId: project.id,
      metadata: { name: project.name },
    });

    res.json(project);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
});

// Get all projects for tenant
router.get("/", auth, tenant, async (req, res) => {
  try {
    console.log("GET /projects user:", req.user);
    console.log("GET /projects tenantId:", req.tenantId);

    if (!req.tenantId) {
      return res.json([]);
    }

    const result = await db.query(
      "SELECT * FROM projects WHERE tenant_id = $1",
      [req.tenantId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// Update project
router.put("/:id", auth, tenant, async (req, res) => {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Project name is required" });
  }
  if (name.trim().length > 100) {
    return res
      .status(400)
      .json({ message: "Project name must be at most 100 characters" });
  }

  try {
    const result = await db.query(
      "UPDATE projects SET name = $1, description = $2 WHERE id = $3 AND tenant_id = $4 RETURNING *",
      [name, description || null, req.params.id, req.tenantId]
    );

    const project = result.rows[0];
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await logAudit({
      tenantId: req.tenantId,
      userId: req.user.userId,
      action: "project_updated",
      entityType: "project",
      entityId: project.id,
      metadata: { name: project.name },
    });

    res.json(project);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ message: "Failed to update project" });
  }
});

// Delete project
router.delete("/:id", auth, tenant, async (req, res) => {
  try {
    await db.query(
      "DELETE FROM projects WHERE id = $1 AND tenant_id = $2",
      [req.params.id, req.tenantId]
    );

    await logAudit({
      tenantId: req.tenantId,
      userId: req.user.userId,
      action: "project_deleted",
      entityType: "project",
      entityId: req.params.id,
      metadata: null,
    });

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Failed to delete project" });
  }
});

module.exports = router;
