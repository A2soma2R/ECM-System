"use strict";

// ===== Dependencies =====
const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

// ===== Database Connection =====
const connectDB = require("./config/db");

// ===== Route Imports =====
const authRoutes = require("./routes/authRoutes");
const folderRoutes = require("./routes/folderRoutes");
const fileRoutes = require("./routes/fileRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ===== Application Setup =====
const app = express();

connectDB();

// ===== Request Middleware =====
app.use(cors());
app.use(express.json());

// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/admin", adminRoutes);

// ===== API Status =====
app.get("/", (req, res) => {
  res.json({
    message: "ECM System API is running successfully",
  });
});

// ===== Frontend Files =====
app.use(express.static(path.join(__dirname, "public")));

// ===== Server Startup =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});