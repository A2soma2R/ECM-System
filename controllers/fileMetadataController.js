// ===== Dependencies =====
const mongoose = require("mongoose");
const File = require("../models/File");
const User = require("../models/User");

// ===== Update File Category =====
const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body || {};

    // ===== File ID Validation =====
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid file ID",
      });
    }

    // ===== Category Validation =====
    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        message: "Category is required and must be text",
      });
    }

    // ===== Edit Permission Filter =====
    const accessFilter = {
      _id: id,
      $or: [
        { owner: req.user._id },
        {
          sharedWith: {
            $elemMatch: {
              user: req.user._id,
              permission: "edit",
            },
          },
        },
      ],
    };

    // ===== Edit Permission Check =====
    const accessibleFile = await File.findOne(accessFilter)
      .select("owner");

    if (!accessibleFile) {
      return res.status(404).json({
        message: "File not found or edit access is unavailable",
      });
    }

    // ===== Shared File Owner Status =====
    if (!accessibleFile.owner.equals(req.user._id)) {
      const activeOwner = await User.exists({
        _id: accessibleFile.owner,
        isActive: true,
      });

      if (!activeOwner) {
        return res.status(404).json({
          message: "Shared file is unavailable",
        });
      }
    }

    // ===== Save Category With Permission Check =====
    const file = await File.findOneAndUpdate(
      accessFilter,
      {
        $set: {
          category: category.trim(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select(
      "originalName mimeType size folder owner category createdAt updatedAt"
    );

    if (!file) {
      return res.status(404).json({
        message: "File not found or edit access is unavailable",
      });
    }

    // ===== Update Response =====
    return res.status(200).json({
      message: "File updated successfully",
      file,
    });
  } catch (error) {
    console.error("File update failed:", error.message);

    return res.status(500).json({
      message: "Unable to update file",
    });
  }
};

// ===== Controller Exports =====
module.exports = {
  updateFile,
};