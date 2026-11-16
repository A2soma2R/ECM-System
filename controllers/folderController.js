"use strict";

// ===== Dependencies =====
const mongoose = require("mongoose");
const Folder = require("../models/Folder");
const File = require("../models/File");

// ===== Create Folder =====
const createFolder = async (req, res) => {
  try {
    const { name } = req.body || {};

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Folder name is required",
      });
    }

    const folder = await Folder.create({
      name: name.trim(),
      owner: req.user._id,
    });

    return res.status(201).json({
      message: "Folder created successfully",
      folder,
    });
  } catch (error) {
    console.error("Folder creation failed:", error.message);

    return res.status(500).json({
      message: "Unable to create folder",
    });
  }
};

// ===== Get Owned Folders =====
const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      folders,
    });
  } catch (error) {
    console.error("Loading folders failed:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve folders",
    });
  }
};

// ===== Rename Owned Folder =====
const updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body || {};

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid folder ID",
      });
    }

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Folder name is required",
      });
    }

    const folder = await Folder.findOneAndUpdate(
      {
        _id: id,
        owner: req.user._id,
      },
      {
        $set: {
          name: name.trim(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    return res.status(200).json({
      message: "Folder updated successfully",
      folder,
    });
  } catch (error) {
    console.error("Folder update failed:", error.message);

    return res.status(500).json({
      message: "Unable to update folder",
    });
  }
};

// ===== Delete Empty Owned Folder =====
const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid folder ID",
      });
    }

    const folder = await Folder.findOne({
      _id: id,
      owner: req.user._id,
    });

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    const hasFiles = await File.exists({
      folder: folder._id,
    });

    if (hasFiles) {
      return res.status(409).json({
        message: "Folder is not empty. Delete its files first",
      });
    }

    await Folder.deleteOne({
      _id: folder._id,
      owner: req.user._id,
    });

    return res.status(200).json({
      message: "Folder deleted successfully",
    });
  } catch (error) {
    console.error("Folder deletion failed:", error.message);

    return res.status(500).json({
      message: "Unable to delete folder",
    });
  }
};

// ===== Controller Exports =====
module.exports = {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
};