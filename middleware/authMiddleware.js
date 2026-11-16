"use strict";

// ===== Dependencies =====
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===== Protect Authenticated Routes =====
const protect = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (
      typeof authorizationHeader !== "string" ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Access denied. No token provided",
      });
    }

    const token = authorizationHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided",
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      }
    );

    if (
      typeof decodedToken !== "object" ||
      decodedToken === null ||
      typeof decodedToken.userId !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(
      decodedToken.userId
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "This account is inactive",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// ===== Protect Admin Routes =====
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Access denied. No token provided",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access is required",
    });
  }

  return next();
};

// ===== Exports =====
module.exports = {
  protect,
  adminOnly,
};