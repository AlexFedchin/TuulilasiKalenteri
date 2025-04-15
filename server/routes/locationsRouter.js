const express = require("express");
const {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/locationsController");
const validateLocationData = require("../middlewares/validateLocation");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

// Public Routes (accessible by any authenticated user)
router.get("/", authenticate(["admin", "regular"]), getAllLocations);

router.get("/:id", authenticate(["admin", "regular"]), getLocationById);

// Admin only routes
router.post("/", authenticate(["admin"]), validateLocationData, createLocation);

router.put(
  "/:id",
  authenticate(["admin"]),
  validateLocationData,
  updateLocation
);

router.delete("/:id", authenticate(["admin"]), deleteLocation);

// Export the router to be used in the server.js
module.exports = router;
