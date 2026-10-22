const RequireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.id) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (!allowedRoles.includes(req.Roles)) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action.",
    });
  }

  return next();
};

export default RequireRole;
