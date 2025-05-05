import React, { useState } from "react";
import {
  Card,
  Typography,
  Box,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../context/AuthContext";
import { alert } from "../../utils/alert";
import useScreenSize from "../../hooks/useScreenSize";
import { useTranslation } from "react-i18next";

const LocationCard = ({ location, setLocations, onDelete }) => {
  const { isMobile, isTablet } = useScreenSize();
  const { token } = useAuth();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(location.title);
  const [tempTitle, setTempTitle] = useState(location.title);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/locations/${location._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: tempTitle }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }
      setLocations((prevLocations) =>
        prevLocations.map((loc) =>
          loc._id === location._id ? { ...loc, tempTitle } : loc
        )
      );
      setTitle(tempTitle);
      alert.success(t("alert.locationUpdateSuccess"));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating location:", error);
      alert.error(`${t("alert.error")}: ${error.message}`);
    }
  };

  const handleEditClick = () => {
    setTempTitle(title);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setTempTitle(title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(location);
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
      {/* Title Section */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Icon and Title */}
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
          {isEditing ? (
            <TextField
              value={tempTitle}
              placeholder={t("locationCard.titlePlaceholder")}
              onChange={(e) => setTempTitle(e.target.value)}
              variant="standard"
              fullWidth
              sx={{ mr: 1 }}
            />
          ) : (
            <Typography variant="h4">{title}</Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <IconButton
            onClick={isEditing ? handleCancelClick : handleDelete}
            sx={{
              p: 0.5,
              height: 32,
              width: 32,
              transition: "color 0.2s ease",
              color: isEditing ? "var(--error)" : "var(--error)",
              "&:hover": {
                color: isEditing
                  ? "var(--error-onhover)"
                  : "var(--error-onhover)",
              },
            }}
          >
            {isEditing ? (
              <CloseIcon fontSize="small" />
            ) : (
              <DeleteIcon fontSize="small" />
            )}
          </IconButton>
          <IconButton
            onClick={isEditing ? handleSave : handleEditClick}
            sx={{
              p: 0.5,
              height: 32,
              width: 32,
              transition: "color 0.2s ease",
              color: isEditing ? "var(--primary)" : "var(--primary)",
              "&:hover": {
                color: isEditing
                  ? "var(--primary-onhover)"
                  : "var(--primary-onhover)",
              },
            }}
          >
            {isEditing ? (
              <CheckIcon fontSize="small" />
            ) : (
              <EditIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {t("locationCard.usersLabel")}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, ml: 1 }}>
          {location.users.length > 0 ? (
            location.users.map((user) => (
              <Typography key={user._id} variant="body2">
                • {user.firstName} {user.lastName} ({user.username})
              </Typography>
            ))
          ) : (
            <Typography variant="body2" fontStyle="italic">
              {t("locationCard.noUsersMessage")}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default LocationCard;
