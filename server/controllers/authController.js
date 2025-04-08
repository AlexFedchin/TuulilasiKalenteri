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
      { expiresIn: "6h" } // Token validity
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { login, register };
