const express = require("express");
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");
const validateNoteData = require("../middlewares/validateNote");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

// Public Routes (accessible by any authenticated user)
router.get("/", authenticate(["admin", "regular"]), getAllNotes);

router.get("/:id", authenticate(["admin", "regular"]), getNoteById);

router.post(
  "/",
  authenticate(["admin", "regular"]),
  validateNoteData,
  createNote
);

router.put(
  "/:id",
  authenticate(["admin", "regular"]),
  validateNoteData,
  updateNote
);

router.delete("/:id", authenticate(["admin", "regular"]), deleteNote);

// Export the router to be used in the server.js
module.exports = router;
