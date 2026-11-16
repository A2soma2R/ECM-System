"use strict";

// ===== Dependencies =====
const mongoose = require("mongoose");
const fs = require("fs/promises");
const Folder = require("../models/Folder");
const File = require("../models/File");
const { extractFileContent } = require("../utils/fileText");

// ===== Remove Unused Upload =====
const removeUploadedFile = async (file) => {
  if (!file) return;
  try { await fs.unlink(file.path); }
  catch (error) {
    if (error.code !== "ENOENT") console.error("Unable to remove uploaded file:", error.message);
  }
};

// ===== Upload File =====
const uploadFile = async (req, res) => {
  let saved = false;
  try {
    const { folderId, category } = req.body || {};
    if (!mongoose.isObjectIdOrHexString(folderId)) {
      await removeUploadedFile(req.file);
      return res.status(400).json({ message: "A valid folder ID is required" });
    }
    const folder = await Folder.findOne({ _id: folderId, owner: req.user._id });
    if (!folder) {
      await removeUploadedFile(req.file);
      return res.status(404).json({ message: "Folder not found" });
    }
    if (!req.file) return res.status(400).json({ message: "Please select a file to upload" });
    if (category !== undefined && typeof category !== "string") {
      await removeUploadedFile(req.file);
      return res.status(400).json({ message: "Category must be text" });
    }

    // ===== Extract Supported File Content =====
    const content = await extractFileContent(req.file.path, req.file.originalname);
    const file = await File.create({
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      folder: folder._id,
      owner: req.user._id,
      category: category?.trim() || "General",
      ...content,
    });
    saved = true;

    // ===== Return Metadata Only =====
    const metadata = file.toObject();
    delete metadata.contentText;
    return res.status(201).json({ message: "File uploaded successfully", file: metadata });
  } catch (error) {
    if (!saved) await removeUploadedFile(req.file);
    console.error("File upload failed:", error.message);
    return res.status(500).json({ message: "Unable to upload file" });
  }
};

// ===== Get Owned Files =====
const getFiles = async (req, res) => {
  try {
    const files = await File.find({ owner: req.user._id })
      .populate("folder", "name").sort({ createdAt: -1 });
    return res.status(200).json({ files });
  } catch (error) {
    console.error("Unable to retrieve files:", error.message);
    return res.status(500).json({ message: "Unable to retrieve files" });
  }
};

module.exports = { uploadFile, getFiles };
