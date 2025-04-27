import React, { useEffect, useState } from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/AuthContext";
import NoteCard from "./NoteCard";
import EditableNoteCard from "./EditableNoteCard";
import useScreenSize from "../../hooks/useScreenSize";
import { alert } from "../../utils/alert";

const Notes = () => {
  const { user, token } = useAuth();
  const { isMobile, isTablet } = useScreenSize();
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch("/api/notes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Failed to fetch notes");
          });
        }
        return response.json();
      })
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        ); // <-- Sorting added
        setNotes(sorted);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error.message);
      });
  }, [user, token]);

  const handleCreateNote = async ({ title, description }) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }
      const newNote = await response.json();
      setNotes((prev) => [newNote, ...prev]);
      setIsCreating(false);
      alert.success("Note created successfully");
    } catch (error) {
      alert.error("Failed to create note");
      console.error("Error creating note:", error);
    }
  };

  const onUpdateNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      )
    );
  };

  const onDeleteNote = (deletedNoteId) => {
    setNotes((prevNotes) =>
      prevNotes.filter((note) => note._id !== deletedNoteId)
    );
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        boxSizing: "border-box",
        height: "100%",
        width: "100%",
        p: 1,
      }}
    >
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Notes
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxHeight: "100%",
          height: "100%",
          bgcolor: "var(--off-white)",
          borderRadius: 1,
          boxSizing: "border-box",
          p: 1,
          gap: 1,
          boxShadow: "inset 0 0 8px rgba(0, 0, 0, 0.1)",
          overflowY: "auto",
        }}
      >
        {notes
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onUpdateNote={onUpdateNote}
              onDeleteNote={onDeleteNote}
            />
          ))}
        {isCreating ? (
          <EditableNoteCard
            onSave={handleCreateNote}
            onCancel={() => setIsCreating(false)}
          />
        ) : (
          <Button
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => setIsCreating(true)}
            sx={{
              borderRadius: 0.5,
              py: 0.5,
              px: 1,
              bgcolor: "var(--white)",
              color: "var(--off-black)",
              width: "100%",
              fontSize: isMobile ? "0.8rem" : isTablet ? "0.85rem" : "0.9rem",
              textTransform: "none",
              "&:hover": { bgcolor: "var(--white-onhover)" },
            }}
          >
            Add Note
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default Notes;
