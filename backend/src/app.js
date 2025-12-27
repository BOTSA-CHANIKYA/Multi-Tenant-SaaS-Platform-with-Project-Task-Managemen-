const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const tenantRoutes = require("./routes/tenant.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");
// Remove this if health.routes.js is empty or unused
// const healthRoutes = require("./routes/health.routes");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

// Single health endpoint per PRD
app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Remove duplicate mounting
// app.use("/api/health", healthRoutes);

module.exports = app;
