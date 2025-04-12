const User = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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
    res.status(400).json({ error: "Invalid user ID or data" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).send("User deleted");
  } catch (error) {
    res.status(400).json({ error: "Invalid user ID" });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
