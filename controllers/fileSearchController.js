"use strict";

// ===== Dependencies =====
const mongoose = require("mongoose");
const File = require("../models/File");

// ===== Escape Regular Expression Characters =====
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ===== Search Owned Files =====
const searchFiles = async (req, res) => {
  try {
    const {
      search,
      category,
      folderId,
      scope = "name",
    } = req.query;

    // ===== Validate Filter Types =====
    for (const value of [search, category, folderId, scope]) {
      if (value !== undefined && typeof value !== "string") {
        return res.status(400).json({
          message: "Search filters must be text",
        });
      }
    }

    // ===== Validate Search Scope =====
    if (!["name", "content", "all"].includes(scope)) {
      return res.status(400).json({
        message: "Invalid search scope",
      });
    }

    // ===== Validate Search Length =====
    if (
      (search?.length || 0) > 200 ||
      (category?.length || 0) > 200
    ) {
      return res.status(400).json({
        message: "Search text must not exceed 200 characters",
      });
    }

    // ===== Restrict Results to Current Owner =====
    const filter = {
      owner: req.user._id,
    };

    // ===== Search Name or Content =====
    if (search?.trim()) {
      const nameMatch = {
        $regex: escapeRegex(search.trim()),
        $options: "i",
      };

      const contentQuery = search
        .normalize("NFKC")
        .replace(/\s+/gu, " ")
        .trim();

      const contentMatch = {
        $regex: escapeRegex(contentQuery),
        $options: "i",
      };

      if (scope === "name") {
        filter.originalName = nameMatch;
      } else if (scope === "content") {
        filter.contentText = contentMatch;
      } else {
        filter.$or = [
          { originalName: nameMatch },
          { contentText: contentMatch },
        ];
      }
    }

    // ===== Filter by Category =====
    if (category?.trim()) {
      filter.category = {
        $regex: `^${escapeRegex(category.trim())}$`,
        $options: "i",
      };
    }

    // ===== Filter by Folder =====
    if (folderId !== undefined && folderId !== "") {
      if (!mongoose.isObjectIdOrHexString(folderId)) {
        return res.status(400).json({
          message: "Invalid folder ID",
        });
      }

      filter.folder = folderId;
    }

    // ===== Retrieve Matching Files =====
    const files = await File.find(filter)
      .populate("folder", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      files,
    });
  } catch (error) {
    console.error("File search failed:", error.message);

    return res.status(500).json({
      message: "Unable to search files",
    });
  }
};

// ===== Controller Exports =====
module.exports = {
  searchFiles,
};