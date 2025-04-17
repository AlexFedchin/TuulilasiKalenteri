import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../context/AuthContext";
import EditableNoteCard from "./EditableNoteCard";

const NoteCard = ({ note, onUpdateNote, onDeleteNote }) => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async ({ title, description }) => {
    if (!title.trim() && !description.trim()) {
      return;
    }
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        const updatedNote = await response.json();
        onUpdateNote(updatedNote);
        setIsEditing(false);
      } else {
        console.error("Failed to update the note");
      }
    } catch (error) {
      console.error("Error updating the note:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        onDeleteNote(note._id);
      } else {
        console.error("Failed to delete the note");
      }
    } catch (error) {
      console.error("Error deleting the note:", error);
    }
  };

  return isEditing ? (
    <EditableNoteCard
      initialTitle={note.title}
      initialDescription={note.description}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  ) : (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        p: 1,
        bgcolor: "var(--white)",
        color: "var(--off-black)",
        borderRadius: 0.5,
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        position: "relative",
        "&:hover .note-actions": {
          opacity: 1,
        },
      }}
    >
      {/* Note actions (edit and delete) */}
      <Box
        className="note-actions"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          display: "flex",
          alignItems: "center",
          gap: 1,
          opacity: 0,
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        <EditIcon
          fontSize="small"
          role="button"
          onClick={handleEdit}
          sx={{
            cursor: "pointer",
            transition: "color 0.2s ease-in-out",
            color: "var(--off-grey)",
            "&:hover": { color: "var(--off-black)" },
          }}
        />
        <DeleteIcon
          fontSize="small"
          role="button"
          onClick={handleDelete}
          sx={{
            cursor: "pointer",
            transition: "color 0.2s ease-in-out",
            color: "var(--error)",
            "&:hover": { color: "var(--error-onhover)" },
          }}
        />
      </Box>

      {note.title && (
        <Typography
          variant="h5"
          color="inherit"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {note.title}
        </Typography>
      )}
      {note.description && (
        <Typography
          variant="card"
          color="inherit"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
            hyphens: "auto",
          }}
        >
          {note.description}
        </Typography>
      )}
    </Box>
  );
};

export default NoteCard;
