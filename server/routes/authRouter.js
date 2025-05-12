const express = require("express");
const {
  login,
  register,
  logout,
  verifyToken,
  checkPassword,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");
const validateUserData = require("../middlewares/validateUser");
const validatePassword = require("../middlewares/validatePassword");
const router = express.Router();

router.post("/login", login);
router.post(
  "/register",
  authenticate(["admin"]),
  validateUserData(false),
  register
);
router.post("/logout", authenticate(["admin", "regular"]), logout);
router.get("/verify-token", authenticate(["admin", "regular"]), verifyToken);
router.post(
  "/check-password",
  authenticate(["admin", "regular"]),
  checkPassword
);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-token", verifyResetToken);
router.post(
  "/reset-password",
  authenticate(["admin", "regular"]),
  validatePassword(),
  resetPassword
);

// Export the router to be used in the server.js
module.exports = router;
