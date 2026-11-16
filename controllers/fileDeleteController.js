const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs/promises");
const File = require("../models/File");

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid file ID",
      });
    }

    const file = await File.findOne({
      _id: id,
      owner: req.user._id,
    });

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      path.basename(file.storedName)
    );

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    await File.deleteOne({
      _id: file._id,
      owner: req.user._id,
    });

    return res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("File deletion failed:", error.message);

    return res.status(500).json({
      message: "Unable to delete file",
    });
  }
};

module.exports = {
  deleteFile,
};