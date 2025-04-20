const User = require("../models/user");
const Location = require("../models/location");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, password },
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
    });
    res.json(updatedUser);
  } catch (error) {
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

    console.log(deletedUser);
    // If the user's role is not admin, remove the user ID from locations' users array
    if (deletedUser.role !== "admin") {
      console.log("User is not an admin");
      const location = await Location.findOne({ users: deletedUser._id });
      console.log("Found location to remove user from:", location);
      if (!location)
        return res.status(404).json({ error: "Location not found" });

      location.users = location.users.filter(
        (userId) => userId.toString() !== deletedUser._id.toString()
      );
      console.log(location.users);
      await location.save();
    }

    res.status(204).json({ deletedUserId: deletedUser._id });
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
