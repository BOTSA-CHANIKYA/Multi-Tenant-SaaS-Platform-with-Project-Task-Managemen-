const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");

// allowed statuses per PRD
const ALLOWED_STATUSES = ["PENDING", "IN_PROGRESS", "DONE"];

// Create task
router.post("/", auth, tenant, async (req, res) => {
  const { project_id, name, description, status } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Task name is required" });
  }
  if (name.trim().length > 100) {
    return res
      .status(400)
      .json({ message: "Task name must be at most 100 characters" });
  }
  if (status && !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid task status" });
  }

  try {
    // enforce task limit per tenant
    const limitRes = await db.query(
      "SELECT task_limit FROM tenants WHERE id = $1",
      [req.tenantId]
    );
    const taskLimit = limitRes.rows[0]?.task_limit ?? 50;

    const countRes = await db.query(
      "SELECT COUNT(*) FROM tasks WHERE tenant_id = $1",
      [req.tenantId]
    );
    const currentCount = parseInt(countRes.rows[0].count, 10);

    if (currentCount >= taskLimit) {
      return res
        .status(403)
        .json({ message: "Task limit reached for current plan" });
    }

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

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Task name is required" });
  }
  if (name.trim().length > 100) {
    return res
      .status(400)
      .json({ message: "Task name must be at most 100 characters" });
  }
  if (status && !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid task status" });
  }

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
