const express = require("express");
const { login, register } = require("../controllers/authController");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);

// Export the router to be used in the server.js
module.exports = router;
