"use strict";

// ===== Admin Access =====
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Please sign in to continue",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access is required",
    });
  }

  next();
};

// ===== Middleware Exports =====
module.exports = {
  requireAdmin,
};