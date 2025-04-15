const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    carMake: { type: String, required: true },
    carModel: { type: String, required: true },
    plateNumber: { type: String, required: true },
    insuranceNumber: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // in hours
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
