require("dotenv").config();
const mongoose = require("mongoose");

const connectToDatabase = async () => {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
