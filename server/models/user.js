const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  role: { type: String, required: true, enum: ["regular", "admin"] },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
