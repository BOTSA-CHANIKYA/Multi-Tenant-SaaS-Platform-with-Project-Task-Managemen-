const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const tenantRoutes = require("./routes/tenant.routes");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.get("/api/health", async (req, res) => {
  res.status(200).json({
    status: "ok",
    database: "connected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);

module.exports = app;
