"use strict";

// ===== Dependencies =====
const mongoose = require("mongoose");

// ===== File Sharing Schema =====
const fileShareSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  permission: { type: String, enum: ["view", "edit"], default: "view", required: true },
  sharedAt: { type: Date, default: Date.now },
}, { _id: false });

// ===== File Schema =====
const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true, trim: true },
  storedName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true, min: 0 },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, trim: true, default: "General" },
  sharedWith: { type: [fileShareSchema], default: [] },

  // ===== Searchable File Content =====
  // Extracted text is excluded from ordinary API queries.
  contentText: { type: String, default: "", maxlength: 500000, select: false },
  contentIndexStatus: {
    type: String,
    enum: ["pending", "indexed", "truncated", "empty", "unsupported", "failed"],
    default: "pending",
  },
  contentIndexedAt: { type: Date, default: null },
}, { timestamps: true });

// ===== Model Export =====
module.exports = mongoose.model("File", fileSchema);
