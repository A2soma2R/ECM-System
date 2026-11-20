"use strict";

// ===== Dependencies =====
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");
const { TextDecoder } = require("node:util");

// ===== Upload Directory =====
const uploadDirectory = path.join(__dirname, "..", "uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

// ===== Allowed File Extensions =====
const allowedExtensions = new Set([
  ".pdf",
  ".docx",
  ".xlsx",
  ".pptx",
  ".txt",
  ".png",
  ".jpg",
  ".jpeg",
]);

// ===== Decode Uploaded File Names =====
const decodeFileName = (name) => {
  // Keep names that already contain Unicode characters.
  const isLatin1 = Array.from(name).every(
    (character) => character.codePointAt(0) <= 255
  );

  if (!isLatin1) {
    return name;
  }

  try {
    // Recover UTF-8 names received as Latin-1.
    return new TextDecoder("utf-8", { fatal: true }).decode(
      Buffer.from(name, "latin1")
    );
  } catch {
    // Preserve the original name if it is not valid UTF-8.
    return name;
  }
};

// ===== File Storage =====
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    callback(null, `${randomUUID()}${extension}`);
  },
});

// ===== Upload Settings =====
const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    file.originalname = decodeFileName(file.originalname);

    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.has(extension)) {
      return callback(new Error("File type is not allowed"));
    }

    callback(null, true);
  },
});

module.exports = upload;