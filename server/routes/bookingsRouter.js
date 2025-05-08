const express = require("express");
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  changeBookingDateTime,
  deleteBooking,
} = require("../controllers/bookingsController");
const validateBookingData = require("../middlewares/validateBooking");
const authenticate = require("../middlewares/authenticate");
const checkBookingOwnership = require("../middlewares/checkBookingOwnership");
const router = express.Router();

// Public Routes (accessible by any authenticated user)
router.get("/", authenticate(["admin", "regular"]), getAllBookings);

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
  "/change-date-time/:id",
  authenticate(["admin", "regular"]),
  checkBookingOwnership,
  changeBookingDateTime
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
