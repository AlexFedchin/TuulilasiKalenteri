const User = require("../models/user");
const Location = require("../models/location");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");

    const usersWithLocations = await Promise.all(
      users.map(async (user) => {
        if (user.role === "admin") {
          return user.toObject();
        }

        const location = user.location
          ? await Location.findById(user.location, "_id title")
          : null;

        return {
          ...user.toObject(),
          locationTitle: location?.title || null,
        };
      })
    );

    res.json(usersWithLocations);
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;

  const updatedUserData = {
    firstName: firstName?.trim(),
    lastName: lastName?.trim(),
    email: email?.trim(),
    username: username?.trim(),
  };

  if (password) {
    const existingUser = await User.findById(req.params.id);
    if (
      existingUser &&
      (await bcrypt.compare(password.trim(), existingUser.password))
    ) {
      return res.status(400).json({
        error: "New password cannot be the same as the current password",
      });
    }
    updatedUserData.password = await bcrypt.hash(password?.trim(), 10);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedUserData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
      location: updatedUser.location,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.username) {
      // Handle duplicate username error
      return res
        .status(400)
        .json({ error: "User with this username already exists" });
    }

    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // If the user's role is not admin, remove the user ID from locations' users array
    if (deletedUser.role !== "admin") {
      const location = await Location.findOne({ users: deletedUser._id });
      if (!location)
        return res.status(404).json({ error: "Location not found" });

      location.users = location.users.filter(
        (userId) => userId.toString() !== deletedUser._id.toString()
      );

      await location.save();
    }

    res.status(200).json({ deletedUserId: deletedUser._id });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
