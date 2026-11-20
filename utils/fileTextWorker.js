"use strict";

// ===== Worker Dependencies =====
const fs = require("node:fs/promises");
const { workerData, parentPort } = require("node:worker_threads");
const { TextDecoder } = require("node:util");

// ===== Extraction Limits =====
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TEXT_LENGTH = 500000;

// ===== Text Normalization =====
const normalizeText = (text) => text
  .normalize("NFKC")
  .replace(/\u0000/g, "")
  .replace(/\s+/gu, " ")
  .trim();

// ===== Extract Text Without Blocking the Server =====
const extract = async () => {
  const extension = workerData.extension.toLowerCase();

  if (![".txt", ".pdf", ".docx"].includes(extension)) {
    throw new Error("Unsupported file type for text extraction");
  }

  const buffer = await fs.readFile(workerData.filePath);

  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error("File exceeds extraction limit");
  }

  let text;

  // ===== TXT Text Extraction =====
  if (extension === ".txt") {
    let encoding = "utf-8";

    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
      encoding = "utf-16le";
    } else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
      encoding = "utf-16be";
    }

    text = new TextDecoder(encoding, { fatal: true }).decode(buffer);
  }

  // ===== PDF Text Extraction =====
  else if (extension === ".pdf") {
    const { PDFParse } = require("pdf-parse");

    // Copy into a Uint8Array instead of passing a pooled Buffer.
    const parser = new PDFParse({
      data: new Uint8Array(buffer),
    });

    try {
      const result = await parser.getText({ pageJoiner: " " });

      // Avoid treating generated page labels as document content.
      text = result.pages.map((page) => page.text).join(" ");
    } finally {
      await parser.destroy();
    }
  }

  // ===== Word DOCX Text Extraction =====
  else if (extension === ".docx") {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer });

    text = result.value;
  }

  // ===== Return Searchable Text =====
  const normalized = normalizeText(text);

  parentPort.postMessage({
    contentText: normalized.slice(0, MAX_TEXT_LENGTH),
    contentIndexStatus: !normalized
      ? "empty"
      : normalized.length > MAX_TEXT_LENGTH
        ? "truncated"
        : "indexed",
    contentIndexedAt: new Date(),
  });
};

// ===== Report Extraction Errors =====
extract().catch((error) => {
  parentPort.postMessage({
    error: error.message,
  });
});