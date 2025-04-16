const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    date: { type: Date, default: Date.now, required: true },
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

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
