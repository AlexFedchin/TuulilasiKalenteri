const Location = require("../models/location");
const User = require("../models/user");
const Booking = require("../models/booking");

// Get all locations
const getAllLocations = async (req, res) => {
  try {
    let locations;
    if (req.user.role === "admin") {
      locations = await Location.find();
    } else {
      locations = await Location.find({ users: req.user.id });
    }

    const locationsWithUsernames = await Promise.all(
      locations.map(async (location) => {
        location.users = await Promise.all(
          location.users.map(async (userId) => {
            const user = await User.findById(
              userId,
              "_id username firstName lastName"
            );
            return user;
          })
        );
        return {
          ...location.toObject(),
        };
      })
    );
    res.status(200).json(locationsWithUsernames);
  } catch (error) {
    console.error("Error getting all locations:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get location by ID
const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error("Error getting location by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new location
const createLocation = async (req, res) => {
  const { title, users, bookings } = req.body;

  const location = new Location({ title, users, bookings });

  try {
    let savedLocation;

    savedLocation = await location.save();

    res.status(201).json(savedLocation);
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a location
const updateLocation = async (req, res) => {
  const { title, users, bookings } = req.body;

  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      {
        title,
        users,
        bookings,
      },
      { new: true, runValidators: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.status(200).json(updatedLocation);
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a location
const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    // Delete all users associated with the location
    await User.deleteMany({ _id: { $in: location.users } });

    // Delete all bookings associated with the location
    await Booking.deleteMany({ location: location._id });

    // Delete the location itself
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);

    res.status(200).json({ deletedLocationId: deletedLocation._id });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
