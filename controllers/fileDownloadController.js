// ===== Dependencies =====
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs/promises");
const File = require("../models/File");
const User = require("../models/User");

// ===== Download File =====
const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    // ===== File ID Validation =====
    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid file ID",
      });
    }

    // ===== Download Permission Check =====
    const file = await File.findOne({
      _id: id,
      $or: [
        { owner: req.user._id },
        {
          sharedWith: {
            $elemMatch: {
              user: req.user._id,
              permission: { $in: ["view", "edit"] },
            },
          },
        },
      ],
    });

    if (!file) {
      return res.status(404).json({
        message: "File not found or download access is unavailable",
      });
    }

    // ===== Shared File Owner Status =====
    if (!file.owner.equals(req.user._id)) {
      const activeOwner = await User.exists({
        _id: file.owner,
        isActive: true,
      });

      if (!activeOwner) {
        return res.status(404).json({
          message: "Shared file is unavailable",
        });
      }
    }

    // ===== Stored File Path =====
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      path.basename(file.storedName)
    );

    // ===== Stored File Check =====
    try {
      await fs.access(filePath);
    } catch (error) {
      if (error.code === "ENOENT") {
        return res.status(404).json({
          message: "File is missing from the server",
        });
      }

      throw error;
    }

    // ===== Send File Download =====
    return res.download(filePath, file.originalName, (error) => {
      if (!error) {
        return;
      }

      console.error("File download failed:", error.message);

      if (!res.headersSent) {
        return res.status(500).json({
          message: "Unable to download file",
        });
      }

      res.destroy();
    });
  } catch (error) {
    console.error("File download failed:", error.message);

    if (!res.headersSent) {
      return res.status(500).json({
        message: "Unable to download file",
      });
    }

    res.destroy();
  }
};

// ===== Controller Exports =====
module.exports = {
  downloadFile,
};