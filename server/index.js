require("dotenv").config();
const minimist = require("minimist");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const connectToDatabase = require("./config/db");
const bookingsRoutes = require("./routes/bookingsRouter");
const authRoutes = require("./routes/authRouter");
const usersRoutes = require("./routes/usersRouter");
const app = express();

// Parse command line arguments to set the environment mode
const args = minimist(process.argv.slice(2));

// Use node server.js --dev to enable morgan logging in development
if (args.dev) {
  app.use(morgan("dev"));
}

// Serve frontend (in production)
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/api", (req, res) => {
  res.json({ message: "This is a server for the Tuulilasi Pojat Calendar" });
});

app.use(express.json());
app.use("/api/bookings", bookingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

// Catch-all route to show 404 page for unmatched routes
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Start the server after connecting to the database
const startServer = async () => {
  await connectToDatabase();
  app.listen(3000, () => {
    console.log(`Server listening on port 3000`);
  });
};

startServer();
