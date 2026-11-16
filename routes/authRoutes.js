const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Protected profile accessed successfully",
    user: req.user,
  });
});

router.get(
  "/admin-test",
  protect,
  adminOnly,
  (req, res) => {
    res.status(200).json({
      message: "Admin access granted",
    });
  }
);

module.exports = router;