const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Location = require("../models/location");
require("dotenv").config();

// Registration logic
const register = async (req, res) => {
  const { username, password, role, firstName, lastName, email, location } =
    req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      email,
    });

    // Add user's id to the location if not an admin
    // Admins do not belong to any location
    if (newUser.role !== "admin") {
      if (!location) {
        return res.status(400).json({ error: "Location is required" });
      }

      // Check if location exists
      const usersLocation = await Location.findByIdAndUpdate(
        location,
        { $addToSet: { users: newUser._id } },
        { new: true }
      );

      if (!usersLocation) {
        return res.status(404).json({ error: "Location not found" });
      }
    }

    const savedUser = await newUser.save();

    res.status(201).json({
      id: savedUser._id,
      username: savedUser.username,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      role: savedUser.role,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
};

// Login logic
const login = async (req, res) => {
  // Blacklist the previously existing token if any
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract the token
    const token = authHeader.split(" ")[1];

    blacklistedTokens.push(token);
  }

  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ error: "No user with this username found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token validity
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: error.message });
  }
};

// In-memory token blacklist
let blacklistedTokens = [];
// Middleware to check if token is blacklisted
const isTokenBlacklisted = (token) => blacklistedTokens.includes(token);

// Logout logic
const logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  blacklistedTokens.push(token);

  res.status(200).json({ message: "Logged out successfully" });
};

// Verify token logic
const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate new token
    const newToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token: newToken,
    });
  } catch (error) {
    console.error("Error during token verification:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, register, logout, verifyToken, isTokenBlacklisted };
