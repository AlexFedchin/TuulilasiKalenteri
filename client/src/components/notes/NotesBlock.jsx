import React, { useEffect, useState } from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/AuthContext";
import NoteCard from "./NoteCard";
import EditableNoteCard from "./EditableNoteCard";
import useScreenSize from "../../hooks/useScreenSize";
import { alert } from "../../utils/alert";
import { useTranslation } from "react-i18next";
import Loader from "../loader/Loader";

const Notes = () => {
  const { user, token } = useAuth();
  const { isMobile, isTablet } = useScreenSize();
  const { t } = useTranslation();
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/notes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t("alert.unexpectedError"));
        }

        const sorted = [...data].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setNotes(sorted);
      } catch (error) {
        console.error("Error fetching notes:", error);
        alert.error(
          `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user, token]);

  const handleCreateNote = async ({ title, description }) => {
    if (isSaving) return;
    setIsSaving(true);

    if (!title.trim() && !description.trim()) {
      alert.error("Title and description cannot be empty");
      return;
    }

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || t("alert.unexpectedError"));
      }

      setNotes((prev) => [result, ...prev]);
      setIsCreating(false);
      alert.success("Note created successfully!");
    } catch (error) {
      alert.error(
        `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
      );
      console.error("Error creating note:", error);
    } finally {
      setIsSaving(false);
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
        {t("notesBlock.title")}
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "grid",
            boxShadow: "inset 0 0 8px rgba(0, 0, 0, 0.1)",
            bgcolor: "var(--off-white)",
            borderRadius: 1,
            placeItems: "center",
            height: "100%",
            width: "100%",
            minHeight: "616.13px",
          }}
        >
          <Loader />
        </Box>
      ) : (
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
              isSaving={isSaving}
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
              {t("notesBlock.addNote")}
            </Button>
          )}
        </Box>
      )}
    </Card>
  );
};

export default Notes;
