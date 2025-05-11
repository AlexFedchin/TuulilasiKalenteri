require("dotenv").config();
const mongoose = require("mongoose");
const chalk = require("chalk");

const connectToDatabase = async () => {
  console.log(chalk.italic("\nConnecting to MongoDB..."));
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log(chalk.green("\n  ➜"), chalk.bold.white(" Connected to MongoDB"), chalk.bold.green("successfully"));
  } catch (err) {
    console.error(chalk.bold.red("\nError connecting to MongoDB:"), chalk.bold.white(err.message), "\n");
    process.exit(1);
  }
};

module.exports = connectToDatabase;
