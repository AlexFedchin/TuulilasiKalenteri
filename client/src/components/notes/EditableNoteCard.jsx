import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import useScreenSize from "../../hooks/useScreenSize";

const EditableNoteCard = ({
  initialTitle = "",
  initialDescription = "",
  onSave,
  onCancel,
}) => {
  const { isMobile, isTablet } = useScreenSize();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const isEmpty = !title.trim() && !description.trim();

  return (
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
      }}
    >
      <TextField
        fullWidth
        size="small"
        autoFocus
        variant="standard"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        sx={{ mb: 1 }}
        slotProps={{
          input: {
            sx: {
              fontSize: isMobile ? "0.8rem" : isTablet ? "0.85rem" : "0.9rem",
            },
          },
        }}
      />

      <TextField
        fullWidth
        size="small"
        variant="standard"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        multiline
        slotProps={{
          input: {
            sx: {
              fontSize: isMobile ? "0.8rem" : isTablet ? "0.85rem" : "0.9rem",
            },
          },
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
        <IconButton
          onClick={onCancel}
          sx={{
            p: 0.5,
          }}
        >
          <CancelIcon fontSize="small" sx={{ color: "var(--error)" }} />
        </IconButton>
        <IconButton
          disabled={isEmpty}
          onClick={() =>
            onSave({
              title: title.trim(),
              description: description.trim(),
            })
          }
          sx={{
            p: 0.5,
          }}
        >
          <DoneIcon
            fontSize="small"
            sx={{ color: isEmpty ? "var(--off-grey)" : "var(--primary)" }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default EditableNoteCard;
