const express = require("express");
const {
  createUserValidation,
  loginUserValidation,
} = require("../../middlewares/validateMiddlewar");
const { authMiddlewar } = require("../../middlewares/authMiddlewar");
const {
  signup,
  login,
  logout,
  getCurrentUser,
  updateAvatar,
} = require("../../services/usersService");
const { uploadMiddlewar } = require("../../middlewares/uploadMiddlewar");
const {
  compressImgMiddlewar,
} = require("../../middlewares/compressImgMiddlewar");

const router = express.Router();

router.post("/signup", createUserValidation, signup);
router.get("/login", loginUserValidation, login);
router.get("/logout", authMiddlewar, logout);
router.get("/current", authMiddlewar, getCurrentUser);
router.patch(
  "/avatars",
  authMiddlewar,
  uploadMiddlewar.single("avatar"),
  compressImgMiddlewar,
  updateAvatar
);

module.exports = router;
