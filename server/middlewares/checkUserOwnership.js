const User = require("../models/user");

const checkUserOwnership = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is modifying their own data or is an admin
    if (user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        error: "You are not authorized to modify this user's data",
      });
    }

    // Attach the user to the request object for further use
    req.targetUser = user;

    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid user ID" });
  }
};

module.exports = checkUserOwnership;
