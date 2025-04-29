const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 10,
      match: /^[A-Z0-9]{1,4}[-\s]?[A-Z0-9]{1,4}[-\s]?[A-Z0-9]{0,4}$/,
    },
    isWorkDone: { type: Boolean, default: false },
    carModel: { type: String, required: true, minlength: 2, maxlength: 25 },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 20,
      match: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
    },
    eurocode: { type: String, required: true, minlength: 2, maxlength: 20 },
    price: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, required: true },
    warehouseLocation: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: function () {
        return this.inStock;
      },
    },
    clientType: {
      type: String,
      enum: ["private", "company"],
      required: true,
    },
    payerType: {
      type: String,
      enum: ["person", "company", "insurance"],
      required: true,
    },
    insuranceCompany: {
      type: String,
      enum: [
        "pohjolaVakuutus",
        "lahiTapiola",
        "ifVakuutus",
        "fennia",
        "turva",
        "pohjantahti",
        "alandia",
        "other",
      ],
      required: function () {
        return this.payerType === "insurance";
      },
    },
    insuranceCompanyName: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: function () {
        return (
          this.payerType === "insurance" && this.insuranceCompany === "other"
        );
      },
    },
    insuranceNumber: {
      type: String,
      minlength: 5,
      maxlength: 50,
      required: function () {
        return this.payerType === "insurance";
      },
    },
    date: { type: Date, required: true },
    duration: { type: Number, required: true, min: 0.5, max: 6 },
    notes: { type: String, minlength: 0, maxlength: 500 },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invoiceMade: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
