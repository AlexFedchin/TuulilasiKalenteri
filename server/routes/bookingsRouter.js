const express = require("express");
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getOwnBookings,
} = require("../controllers/bookingsController");
const validateBookingData = require("../middlewares/validateBooking");
const authenticate = require("../middlewares/authenticate");
const checkBookingOwnership = require("../middlewares/checkBookingOwnership");
const router = express.Router();

// Admin Routes (accessible only by admin users)
router.get("/", authenticate(["admin"]), getAllBookings);

// Public Routes (accessible by any authenticated user)
router.get("/ownBookings", authenticate(["admin", "regular"]), getOwnBookings);

router.get(
  "/:id",
  authenticate(["admin", "regular"]),
  checkBookingOwnership,
  getBookingById
);

router.post(
  "/",
  authenticate(["admin", "regular"]),
  validateBookingData,
  createBooking
);

router.put(
  "/:id",
  authenticate(["admin", "regular"]),
  checkBookingOwnership,
  validateBookingData,
  updateBooking
);

router.delete(
  "/:id",
  authenticate(["admin", "regular"]),
  checkBookingOwnership,
  deleteBooking
);

// Export the router to be used in the server.js
module.exports = router;
