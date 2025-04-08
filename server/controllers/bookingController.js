const Booking = require("../models/booking.js");

const getAllBookings = async (req, res) => {
  const { title, date, location } = req.query;
  let filter = {};

  if (title) filter.title = new RegExp(title, "i");
  if (date) filter.date = new RegExp(date, "i");
  if (location) filter.location = new RegExp(location, "i");

  const bookings = await Booking.find(filter);
  res.json(bookings);
};

const getBookingById = async (req, res) => {
  try {
    const event = await Booking.findById(req.params.id);
    if (!event) return res.status(404).send("Booking not found");
    res.json(event);
  } catch {
    res.status(400).send("Invalid event ID");
  }
};

const createBooking = async (req, res) => {
  const { title, date, location } = req.body;
  const newBooking = new Booking({ title, date, location });

  await newBooking.save();
  res.status(201).json(newBooking);
};

const updateBooking = async (req, res) => {
  const { title, date, location } = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { title, date, location },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) return res.status(404).send("Booking not found");
    res.json(updatedBooking);
  } catch {
    res.status(400).send("Invalid Booking ID or data");
  }
};

const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).send("Booking not found");
    res.status(204).send("Booking deleted");
  } catch {
    res.status(400).send("Invalid Booking ID");
  }
};

// Export to be used in routes/bookings.js
module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
