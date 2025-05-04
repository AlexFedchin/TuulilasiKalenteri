const Note = require("../models/note");

// Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error getting all notes:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error getting note by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new note
const createNote = async (req, res) => {
  const { title, description } = req.body;

  try {
    const note = new Note({
      title: title.trim(),
      description: description.trim(),
      createdBy: req.user.id,
    });

    const savedNote = await note.save();

    if (!savedNote) {
      return res.status(400).json({ error: "Failed to create note" });
    }

    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a note
const updateNote = async (req, res) => {
  const { title, description } = req.body;

  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title: title.trim(), description: description.trim() },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ deletedNoteId: deletedNote._id });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
