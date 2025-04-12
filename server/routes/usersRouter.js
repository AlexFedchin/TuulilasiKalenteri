const express = require("express");
const {
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");
const validateUpdateUserData = require("../middlewares/validateUpdateUser");
const authenticate = require("../middlewares/authenticate");
const checkUserOwnership = require("../middlewares/checkUserOwnership");
const router = express.Router();

// Public Routes (accessible by any authenticated user)
router.get("/", authenticate(["admin", "regular"]), getAllUsers);

router.put(
  "/:id",
  authenticate(["admin", "regular"]),
  checkUserOwnership,
  validateUpdateUserData,
  updateUser
);

router.delete(
  "/:id",
  authenticate(["admin", "regular"]),
  checkUserOwnership,
  deleteUser
);

// Export the router to be used in the server.js
module.exports = router;
