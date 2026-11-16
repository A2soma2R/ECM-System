"use strict";

// ===== Dependencies =====
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("node:path");
const connectDB = require("../config/db");
const File = require("../models/File");
const { extractFileContent } = require("../utils/fileText");

// ===== Index Existing Files =====
const run = async () => {
  try {
    await connectDB();
    const filter = process.argv.includes("--all") ? {} : {
      contentIndexStatus: { $nin: ["indexed", "truncated", "empty", "unsupported"] },
    };
    const cursor = File.find(filter).select("_id originalName storedName").lean().cursor();
    let processed = 0;
    let failed = 0;
    for await (const file of cursor) {
      const filePath = path.join(__dirname, "..", "uploads", path.basename(file.storedName));
      const content = await extractFileContent(filePath, file.originalName);
      const result = await File.updateOne({ _id: file._id }, { $set: content }, { timestamps: false });
      if (!result.matchedCount) continue;
      processed++;
      if (content.contentIndexStatus === "failed") failed++;
      console.log(`${file.originalName}: ${content.contentIndexStatus}`);
    }
    console.log(`Indexing complete. Processed: ${processed}. Failed: ${failed}.`);
    if (failed) process.exitCode = 1;
  } catch (error) {
    console.error("File indexing failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};
run();
