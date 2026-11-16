// ===== Dependencies =====
const express = require("express");
const multer = require("multer");

// ===== File Controllers =====
const {
  uploadFile,
  getFiles,
} = require("../controllers/fileController");

const {
  downloadFile,
} = require("../controllers/fileDownloadController");

const {
  updateFile,
} = require("../controllers/fileMetadataController");

const {
  deleteFile,
} = require("../controllers/fileDeleteController");

const {
  searchFiles,
} = require("../controllers/fileSearchController");

// ===== File Sharing Controllers =====
const {
  shareFile,
  getFileShares,
  removeFileShare,
  getSharedFiles,
} = require("../controllers/fileSharingController");

// ===== Authentication and Upload Middleware =====
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ===== Router Setup =====
const router = express.Router();

// ===== File Upload Handling =====
const receiveFile = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      if (
        error instanceof multer.MulterError &&
        error.code === "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          message: "File size must not exceed 10 MB",
        });
      }

      return res.status(400).json({
        message:
          error instanceof multer.MulterError
            ? "Upload one file using the field named file"
            : "Unable to receive file. Check its type and try again",
      });
    }

    next();
  });
};

// ===== File Upload and List =====
router.post("/", protect, receiveFile, uploadFile);
router.get("/", protect, getFiles);

// ===== Search Bar =====
router.get("/search", protect, searchFiles);

// ===== Shared With Me =====
router.get("/shared", protect, getSharedFiles);

// ===== File Sharing =====
router.get("/:id/shares", protect, getFileShares);
router.put("/:id/shares", protect, shareFile);
router.delete("/:id/shares/:userId", protect, removeFileShare);

// ===== File Download =====
router.get("/:id/download", protect, downloadFile);

// ===== File Category Update =====
router.patch("/:id", protect, updateFile);

// ===== File Delete =====
router.delete("/:id", protect, deleteFile);

// ===== Router Export =====
module.exports = router;