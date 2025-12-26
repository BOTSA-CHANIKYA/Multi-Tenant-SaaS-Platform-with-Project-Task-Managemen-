const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");

// Create task
router.post("/", auth, tenant, async (req, res) => {
  const { project_id, name, description, status } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO tasks (project_id, tenant_id, name, description, status) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [project_id, req.tenantId, name, description, status || "PENDING"]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to create task" });
  }
});

// Get all tasks for tenant
router.get("/", auth, tenant, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM tasks WHERE tenant_id=$1",
      [req.tenantId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// Update task
router.put("/:id", auth, tenant, async (req, res) => {
  const { name, description, status } = req.body;
  try {
    const result = await db.query(
      "UPDATE tasks SET name=$1, description=$2, status=$3 WHERE id=$4 AND tenant_id=$5 RETURNING *",
      [name, description, status, req.params.id, req.tenantId]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to update task" });
  }
});

// Delete task
router.delete("/:id", auth, tenant, async (req, res) => {
  try {
    await db.query(
      "DELETE FROM tasks WHERE id=$1 AND tenant_id=$2",
      [req.params.id, req.tenantId]
    );
    res.json({ message: "Task deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

module.exports = router;
