import React, { useState } from "react";
import { Card, Box, TextField, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useAuth } from "../../context/AuthContext";
import { alert } from "../../utils/alert";
import useScreenSize from "../../hooks/useScreenSize";
import { useTranslation } from "react-i18next";

const NewLocationCard = ({ setLocations, onCancel }) => {
  const { isMobile, isTablet } = useScreenSize();
  const { token } = useAuth();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      alert.error(t("alert.error"));
      return;
    }
    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("alert.unexpectedError"));
      }

      setLocations((prevLocations) => [...prevLocations, result]);
      alert.success(t("alert.locationCreateSuccess"));
      onCancel();
    } catch (error) {
      console.error("Error creating location:", error);
      alert.error(
        `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
      );
    }
  };

  return (
    <Card
      sx={{
        width: "350px",
        maxWidth: "373.33px",
        flexGrow: 1,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
        color: "var(--off-black)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexGrow: 1,
          }}
        >
          <Box
            component="img"
            src={`/icons/location.webp`}
            alt="Location Icon"
            sx={{
              width: isMobile ? "20px" : isTablet ? "24px" : "28px",
              height: isMobile ? "20px" : isTablet ? "24px" : "28px",
            }}
          />
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="standard"
            fullWidth
            placeholder={t("locationCard.titlePlaceholder")}
            sx={{ mr: 1 }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <IconButton
            onClick={onCancel}
            sx={{
              p: 0.5,
              height: 32,
              width: 32,
              color: "var(--error)",
              "&:hover": { color: "var(--error-onhover)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleSave}
            disabled={!title.trim()}
            sx={{
              p: 0.5,
              height: 32,
              width: 32,
              color: "var(--primary)",
              "&:hover": { color: "var(--primary-onhover)" },
            }}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Divider />
    </Card>
  );
};

export default NewLocationCard;
