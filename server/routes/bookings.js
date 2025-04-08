const express = require("express");
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");
const validateBookingData = require("../middlewares/validateBooking");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

// Public Routes (accessible by any authenticated user)
router.get("/", authenticate(["admin", "regular"]), getAllBookings);
router.get("/:id", authenticate(["admin", "regular"]), getBookingById);

// Admin Routes (accessible only by admin users)
router.post("/", authenticate(["admin"]), validateBookingData, createBooking);
router.put("/:id", authenticate(["admin"]), validateBookingData, updateBooking);
router.delete("/:id", authenticate(["admin"]), deleteBooking);

// Export the router to be used in the server.js
module.exports = router;
