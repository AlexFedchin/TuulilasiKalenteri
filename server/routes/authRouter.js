const express = require("express");
const {
  login,
  register,
  logout,
  verifyToken,
} = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");
const validateUserData = require("../middlewares/validateUser");
const router = express.Router();

router.post("/login", login);
router.post("/register", validateUserData(false), register);
router.post("/logout", authenticate(["admin", "regular"]), logout);
router.get("/verify-token", authenticate(["admin", "regular"]), verifyToken);

// Export the router to be used in the server.js
module.exports = router;
