const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    eurocode: { type: String, required: true, minlength: 2, maxlength: 20 },
    client: {
      type: String,
      required: true,
      enum: [
        "pauli",
        "vip",
        "maalarium",
        "tammerwheels",
        "colormaster",
        "rantaperkionkatu",
        "other",
      ],
    },
    clientName: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: function () {
        return this.client === "other";
      },
    },
    notes: { type: String, minlength: 0, maxlength: 500 },
  },
  {
    versionKey: false,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
