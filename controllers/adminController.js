"use strict";

// ===== Dependencies =====
const mongoose = require("mongoose");
const User = require("../models/User");
const File = require("../models/File");
const Folder = require("../models/Folder");

// ===== Dashboard Statistics =====
const getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalFiles,
      totalFolders,
      storage,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      File.countDocuments(),
      Folder.countDocuments(),
      File.aggregate([
        {
          $group: {
            _id: null,
            totalBytes: { $sum: "$size" },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      statistics: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalFiles,
        totalFolders,
        totalBytes: storage[0]?.totalBytes || 0,
      },
    });
  } catch (error) {
    console.error("Dashboard loading failed:", error.message);

    return res.status(500).json({
      message: "Unable to load dashboard statistics",
    });
  }
};

// ===== Users List =====
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("_id name email role isActive createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Users loading failed:", error.message);

    return res.status(500).json({
      message: "Unable to load users",
    });
  }
};

// ===== Update Employee Account Status =====
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body || {};

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "Account status must be true or false",
      });
    }

    if (req.user._id.equals(id)) {
      return res.status(400).json({
        message: "You cannot change your own account status",
      });
    }

    const existingUser = await User.findById(id)
      .select("_id role")
      .lean();

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (existingUser.role !== "employee") {
      return res.status(403).json({
        message: "Only employee account status can be changed",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        _id: id,
        role: "employee",
      },
      {
        $set: { isActive },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("_id name email role isActive createdAt");

    if (!user) {
      return res.status(409).json({
        message: "The account changed. Refresh the users list and try again",
      });
    }

    return res.status(200).json({
      message: isActive
        ? "User account activated successfully"
        : "User account deactivated successfully",
      user,
    });
  } catch (error) {
    console.error("Account status update failed:", error.message);

    return res.status(500).json({
      message: "Unable to update account status",
    });
  }
};

// ===== Controller Exports =====
module.exports = {
  getDashboard,
  getUsers,
  updateUserStatus,
};