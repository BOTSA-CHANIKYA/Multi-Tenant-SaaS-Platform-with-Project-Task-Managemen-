module.exports = (req, res, next) => {
  // super admin can access all tenants
  if (req.user.role === "super_admin") {
    return next();
  }

  // other users must belong to a tenant
  if (!req.user.tenantId) {
    return res.status(403).json({
      success: false,
      message: "Tenant access denied",
    });
  }

  // lock request to tenant
  req.tenantId = req.user.tenantId;
  next();
};
