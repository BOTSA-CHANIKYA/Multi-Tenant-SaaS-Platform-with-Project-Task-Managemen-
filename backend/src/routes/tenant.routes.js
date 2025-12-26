const router = require("express").Router();
const db = require("../config/db");
const auth = require("../middleware/auth.middleware");

router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tenants");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tenants" });
  }
});

module.exports = router;
