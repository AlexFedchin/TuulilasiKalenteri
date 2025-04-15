const Location = require("../models/location");

// Get all locations
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get location by ID
const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new location
const createLocation = async (req, res) => {
  const { title, users, bookings } = req.body;

  const location = new Location({ title, users, bookings });

  try {
    let savedLocation;
    try {
      savedLocation = await location.save();
    } catch (error) {
      console.error("Error saving location:", error);
      return res.status(500).json({ error: "Failed to save location" });
    }

    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    res.status(400).json({ error: error.message });
  }
};

// Delete a location
const deleteLocation = async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);

    if (!deletedLocation) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.status(204).json({ message: "Location deleted" });
  } catch (error) {
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
