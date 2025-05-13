require("dotenv").config();
const minimist = require("minimist");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const connectToDatabase = require("./config/db");
const bookingsRoutes = require("./routes/bookingsRouter");
const authRoutes = require("./routes/authRouter");
const usersRoutes = require("./routes/usersRouter");
const locationsRoutes = require("./routes/locationsRouter");
const notesRoutes = require("./routes/notesRouter");
const ordersRoutes = require("./routes/ordersRouter");
const invoicesRoutes = require("./routes/invoicesRouter");
const chalk = require("chalk");
const app = express();

// Parse command line arguments to set the environment mode
const args = minimist(process.argv.slice(2));

// Use node server.js --dev to enable morgan logging in development
if (args.dev) {
  app.use(morgan("dev"));
}

// Serve frontend (in production)
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use(express.json());
app.use("/api/bookings", bookingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/invoices", invoicesRoutes);

// Catch-all route to show 404 page for unmatched routes
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Check for required environment variables
const requiredEnvVars = [
  "JWT_SECRET",
  "DB_URI",
  "EMAIL_USER",
  "EMAIL_PASS",
  "CLIENT_URL",
];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error(
    chalk.bold.red("\nError:"),
    chalk.bold.white(
      `Missing the following environment variables in .env: ${missingEnvVars.join(
        ", "
      )}.`
    )
  );
  console.error(`
    Please add the following variables to your .env file:
    - JWT_SECRET: A secret key used for signing JSON Web Tokens.
    - DB_URI: The connection string for your MongoDB.
    - EMAIL_USER: The email address used for sending emails.
    - EMAIL_PASS: The password for the email account.
    - CLIENT_URL: The URL of the client application.
  `);
  process.exit(1);
}

// Start the server after connecting to the database
const startServer = async () => {
  await connectToDatabase();
  console.log(chalk.italic("\nStarting the server..."));
  app.listen(3000, () => {
    console.log(
      chalk.green("\n  ➜"),
      chalk.bold.white(" Server is up and running!")
    );
    console.log(
      chalk.green("  ➜"),
      chalk.bold.white(" Listening on:"),
      chalk.cyan("http://localhost:") +
        chalk.bold.cyan("3000") +
        chalk.cyan("/"),
      "\n"
    );
  });
};

startServer();
