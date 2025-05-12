const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Location = require("../models/location");
require("dotenv").config();
const sendEmail = require("../emails/sendEmail");
const getResetEmailTemplate = require("../emails/resetEmailTemplate");
const getWelcomeEmailTemplate = require("../emails/welcomeEmailTemplate");

// Registration logic
const register = async (req, res) => {
  const { username, password, role, firstName, lastName, email } = req.body;

  let location = undefined;
  if (role !== "admin") {
    location = req.body.location;
    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this username already exists" });
    }

    // Check if user with this email already exists
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res
        .status(400)
        .json({ error: "Some user is already using this email" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const newUserData = {
      username: username.trim(),
      password: hashedPassword,
      role,
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim(),
    };
    if (location) {
      newUserData.location = location.trim();
    }

    // Create new user
    const newUser = new User(newUserData);

    // Add user's id to the location if not an admin
    // Admins do not belong to any location
    let usersLocation = null;
    if (newUser.role !== "admin") {
      if (!location) {
        return res.status(400).json({ error: "Location is required" });
      }

      // Check if location exists
      usersLocation = await Location.findByIdAndUpdate(
        location,
        { $addToSet: { users: newUser._id } },
        { new: true }
      );

      if (!usersLocation) {
        return res.status(404).json({ error: "Location not found" });
      }
    }

    const savedUser = await newUser.save();

    const userAuthor = await User.findById(req.user.id);

    // Send email to notify the user
    const emailHtml = getWelcomeEmailTemplate(
      savedUser.firstName,
      savedUser.lastName,
      savedUser.username,
      savedUser.email,
      savedUser.role,
      savedUser.role === "regular" && usersLocation !== null
        ? usersLocation.title
        : null,
      `${userAuthor.firstName} ${userAuthor.lastName}`,
      process.env.CLIENT_URL
    );

    await sendEmail(
      savedUser.email,
      "Welcome to TuulilasiKalenteri",
      emailHtml
    );

    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      role: savedUser.role,
      location: savedUser.location,
      locationTitle: usersLocation?.title,
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
        location: user.location,
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

const checkPassword = async (req, res) => {
  const { password } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    res.status(200).json({ message: "Password is correct" });
  } catch (error) {
    console.error("Error during password check:", error);
    res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ error: "No user with this username found" });
    }

    const resetToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const emailHtml = getResetEmailTemplate(
      `${user.firstName} ${user.lastName} (${user.username})`,
      resetLink,
      process.env.CLIENT_URL
    );

    await sendEmail(user.email, "Password Reset Request", emailHtml);

    res.json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const verifyResetToken = async (req, res) => {
  const { resetToken } = req.body;

  if (!resetToken) {
    return res.status(400).json({ error: "Reset token is required" });
  }

  if (isTokenBlacklisted(resetToken)) {
    return res.status(400).json({ error: "You have already used this link." });
  }

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }

    res.status(200).json({
      username: user.username,
    });
  } catch (error) {
    console.error("Error during token verification:", error);
    res
      .status(400)
      .json({ error: error.message || "Invalid or expired token" });
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the new password is the same as the old one
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ error: "New password cannot be the same as the old one" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Blacklist the token used for password reset
    const token = req.headers.authorization?.split(" ")[1];
    blacklistedTokens.push(token);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res
      .status(400)
      .json({ error: error.message || "Invalid or expired token" });
  }
};

module.exports = {
  login,
  register,
  logout,
  verifyToken,
  isTokenBlacklisted,
  checkPassword,
  forgotPassword,
  verifyResetToken,
  resetPassword,
};
