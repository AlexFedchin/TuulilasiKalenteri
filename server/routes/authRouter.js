const express = require("express");
const {
  login,
  register,
  logout,
  verifyToken,
  checkPassword,
  forgotPassword,
} = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");
const validateUserData = require("../middlewares/validateUser");
const router = express.Router();

router.post("/login", login);
router.post("/register", validateUserData(false), register);
router.post("/logout", authenticate(["admin", "regular"]), logout);
router.get("/verify-token", authenticate(["admin", "regular"]), verifyToken);
router.post(
  "/check-password",
  authenticate(["admin", "regular"]),
  checkPassword
);
router.post("/forgot-password", forgotPassword);

// Export the router to be used in the server.js
module.exports = router;
