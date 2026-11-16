"use strict";

// ===== Worker Dependencies =====
const fs = require("node:fs/promises");
const { workerData, parentPort } = require("node:worker_threads");
const { TextDecoder } = require("node:util");

// ===== Text Normalization =====
const normalizeText = (text) => text.normalize("NFKC")
  .replace(/\u0000/g, "")
  .replace(/\s+/gu, " ")
  .trim();

// ===== Extract Text Without Blocking the Server =====
const extract = async () => {
  const buffer = await fs.readFile(workerData.filePath);
  if (buffer.length > 10 * 1024 * 1024) throw new Error("File exceeds extraction limit");
  let text;

  if (workerData.extension === ".txt") {
    let encoding = "utf-8";
    if (buffer[0] === 0xff && buffer[1] === 0xfe) encoding = "utf-16le";
    else if (buffer[0] === 0xfe && buffer[1] === 0xff) encoding = "utf-16be";
    text = new TextDecoder(encoding, { fatal: true }).decode(buffer);
  } else {
    const { PDFParse } = require("pdf-parse");
    // Copy into a transferable Uint8Array rather than passing a pooled Buffer.
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const result = await parser.getText({ pageJoiner: " " });
      // Use page text directly to avoid treating generated page labels as content.
      text = result.pages.map((page) => page.text).join(" ");
    } finally {
      await parser.destroy();
    }
  }

  const normalized = normalizeText(text);
  const limit = 500000;
  parentPort.postMessage({
    contentText: normalized.slice(0, limit),
    contentIndexStatus: !normalized ? "empty" : normalized.length > limit ? "truncated" : "indexed",
    contentIndexedAt: new Date(),
  });
};

extract().catch((error) => {
  parentPort.postMessage({ error: error.message });
});
