const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();

// Registration logic
const register = async (req, res) => {
  const { username, password, role } = req.body;
  console.log("Username:", username, "Password:", password, "Role:", role);
  if (!username || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }
  if (!["regular", "admin"].includes(role)) {
    return res
      .status(400)
      .json({ error: "Role must be either 'regular' or 'admin'" });
  }
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    // Hash the password
    console.log("Password Hashing...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hash: ", hashedPassword);
    // Create new user
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login logic
const login = async (req, res) => {
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
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// In-memory token blacklist
let blacklistedTokens = [];

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
        role: user.role,
      },
      token: newToken,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware to check if token is blacklisted
const isTokenBlacklisted = (token) => blacklistedTokens.includes(token);

module.exports = { login, register, logout, verifyToken, isTokenBlacklisted };
