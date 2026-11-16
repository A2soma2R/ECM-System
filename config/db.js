"use strict";

// ===== Dependencies =====
const mongoose = require("mongoose");

// ===== Database Connection =====
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// ===== Export =====
module.exports = connectDB;
