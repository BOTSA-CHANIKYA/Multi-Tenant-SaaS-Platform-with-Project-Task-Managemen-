const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");

// Create project
router.post("/", auth, tenant, async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO projects (tenant_id, name, description) VALUES ($1,$2,$3) RETURNING *",
      [req.tenantId, name, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to create project" });
  }
});

// Get all projects for tenant
router.get("/", auth, tenant, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM projects WHERE tenant_id = $1",
      [req.tenantId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// Update project
router.put("/:id", auth, tenant, async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await db.query(
      "UPDATE projects SET name=$1, description=$2 WHERE id=$3 AND tenant_id=$4 RETURNING *",
      [name, description, req.params.id, req.tenantId]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to update project" });
  }
});

// Delete project
router.delete("/:id", auth, tenant, async (req, res) => {
  try {
    await db.query(
      "DELETE FROM projects WHERE id=$1 AND tenant_id=$2",
      [req.params.id, req.tenantId]
    );
    res.json({ message: "Project deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete project" });
  }
});

module.exports = router;
