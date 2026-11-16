"use strict";

// ===== Dependencies =====
const express = require("express");

// ===== Controllers =====
const {
  getDashboard,
  getUsers,
  updateUserStatus,
} = require("../controllers/adminController");

// ===== Access Middleware =====
const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/adminMiddleware");

// ===== Router Setup =====
const router = express.Router();

// ===== Protect All Admin Routes =====
router.use(protect, requireAdmin);

// ===== Dashboard Statistics =====
router.get("/dashboard", getDashboard);

// ===== Users Management =====
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);

// ===== Router Export =====
module.exports = router;