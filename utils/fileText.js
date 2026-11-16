"use strict";

// ===== Dependencies =====
const path = require("node:path");
const { Worker } = require("node:worker_threads");

// ===== Content Extraction =====
const extractFileContent = async (filePath, originalName) => {
  const extension = path.extname(originalName).toLowerCase();
  if (![".txt", ".pdf"].includes(extension)) {
    return { contentText: "", contentIndexStatus: "unsupported", contentIndexedAt: new Date() };
  }

  return new Promise((resolve) => {
    let settled = false;
    let worker;
    let timeout;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (worker) worker.terminate().catch(() => {});
      resolve(result);
    };
    const fail = (message) => {
      console.error("Content extraction failed:", message);
      finish({ contentText: "", contentIndexStatus: "failed", contentIndexedAt: new Date() });
    };
    try {
      worker = new Worker(path.join(__dirname, "fileTextWorker.js"), {
        workerData: { filePath: path.resolve(filePath), extension },
        resourceLimits: { maxOldGenerationSizeMb: 256 },
      });
      timeout = setTimeout(() => fail("Extraction timed out"), 20000);
      worker.once("message", (result) => {
        if (result.error) fail(result.error);
        else finish(result);
      });
      worker.once("error", (error) => fail(error.message));
      worker.once("exit", (code) => {
        if (!settled) fail(`Extraction worker exited with code ${code}`);
      });
    } catch (error) {
      fail(error.message);
    }
  });
};

module.exports = { extractFileContent };
