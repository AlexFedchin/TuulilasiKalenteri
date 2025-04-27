import React, { useState } from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Card,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../context/AuthContext";
import EditableNoteCard from "./EditableNoteCard";

const NoteCard = ({ note, onUpdateNote, onDeleteNote }) => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
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
    handleMenuClose();
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        onDeleteNote(note._id);
        alert.success("Note deleted successfully");
      } else {
        console.error("Failed to delete the note");
      }
    } catch (error) {
      alert.error("Failed to delete the note");
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
    <Card
      sx={{
        width: "100%",
        boxSizing: "border-box",
        p: 1,
        color: "var(--off-black)",
        borderRadius: 0.5,
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        position: "relative",
      }}
    >
      {/* Note actions menu */}
      <Box
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <MoreVertIcon
          fontSize="small"
          role="button"
          tabIndex={0}
          aria-controls={open ? "note-menu" : undefined}
          onClick={handleMenuOpen}
          sx={{
            cursor: "pointer",
            transition: "color 0.2s ease-in-out",
            outline: "none",
            color: "var(--off-grey)",
            "&:hover": { color: "var(--off-black)" },
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon sx={{ color: "inherit" }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
            sx={{
              color: "var(--error)",
              "&:hover": { color: "var(--error-onhover)" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>
      </Box>

      {note.title && (
        <Typography
          variant="h5"
          color="inherit"
          sx={{
            maxWidth: "calc(100% - 20px)",
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
    </Card>
  );
};

export default NoteCard;
