const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
