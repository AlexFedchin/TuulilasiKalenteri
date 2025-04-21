const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    versionKey: false,
  }
);

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
