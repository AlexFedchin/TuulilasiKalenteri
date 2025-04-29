import React, { useState } from "react";
import {
  Card,
  Box,
  CardContent,
  Typography,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DefaultContainer from "../components/DefaultContainer";
import { useAuth } from "../context/AuthContext";
import useScreenSize from "../hooks/useScreenSize";
import { alert } from "../utils/alert";

// Globalized styles
const getStyles = (isMobile, isTablet) => ({
  boxContainer: {
    width: "100%",
    display: "flex",
    boxSizing: "border-box",
    justifyContent: "space-between",
    alignItems: "center",
    p: 1,
    gap: 1,
    ".edit-button": {
      display: isMobile || isTablet ? "block" : "none",
      height: "40px",
      width: "40px",
    },
    "&:hover": {
      ".edit-button": {
        display: "block",
      },
    },
  },
  textFieldInput: {
    padding: 0,
    fontSize: "16px",
    borderRadius: "4px",
  },
  columnBox: {
    display: "flex",
    gap: 1,
    flexDirection: "column",
  },
  cancelButton: {
    color: "var(--error)",
    "&:hover": { color: "var(--error-onhover)" },
  },
  saveButton: {
    color: "var(--primary)",
    "&:hover": { color: "var(--primary-onhover)" },
  },
});

const Admin = () => {
  const { user, setUser, token } = useAuth();
  const { isMobile, isTablet } = useScreenSize();
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const styles = getStyles(isMobile, isTablet);

  const handleEditClick = (field) => {
    setEditField(field);
  };

  const handleCancelClick = () => {
    setEditField(null);
    setFormData({
      username: user?.username || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    });
  };

  const handleSaveClick = async (field) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: formData[field] }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert.error(`Error: ${result.error}`);
        console.error("Request failed:", result.error);
        throw new Error(result.error || "Failed to update user");
      }

      alert.success("Profile updated successfully");
      setUser(result);
      setEditField(null);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DefaultContainer>
      <Typography variant="h2">My Profile</Typography>
      <Card sx={{ width: "100%", bgcolor: "var(--white)" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Username */}
          <Box sx={styles.boxContainer}>
            {editField === "username" ? (
              <TextField
                size={isMobile ? "small" : "medium"}
                variant="outlined"
                placeholder="Username"
                label="Username"
                fullWidth
                type="text"
                autoComplete="given-name"
                autoFocus
                value={formData.username}
                InputProps={{
                  style: styles.textFieldInput,
                }}
                onChange={(e) => handleInputChange("username", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && formData.username) {
                    handleSaveClick("username");
                  }
                }}
              />
            ) : (
              <Box sx={styles.columnBox}>
                <Typography
                  variant="h4"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <SettingsIcon fontSize={isMobile ? "small" : "medium"} />
                  Username
                </Typography>
                <Typography variant="body1">{user.username}</Typography>
              </Box>
            )}

            {editField === "username" ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={handleCancelClick}
                  sx={styles.cancelButton}
                >
                  <CloseIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
                <IconButton
                  onClick={() => handleSaveClick("username")}
                  disabled={!formData.username}
                  sx={styles.saveButton}
                >
                  <CheckIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                className="edit-button"
                onClick={() => handleEditClick("username")}
              >
                <EditIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            )}
          </Box>

          <Divider />

          {/* First Name */}
          <Box sx={styles.boxContainer}>
            {editField === "firstName" ? (
              <TextField
                size={isMobile ? "small" : "medium"}
                variant="outlined"
                placeholder="First Name"
                label="First Name"
                fullWidth
                type="text"
                autoComplete="given-name"
                autoFocus
                value={formData.firstName}
                InputProps={{
                  style: styles.textFieldInput,
                }}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            ) : (
              <Box sx={styles.columnBox}>
                <Typography
                  variant="h4"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <PersonIcon fontSize={isMobile ? "small" : "medium"} />
                  First Name
                </Typography>
                <Typography variant="body1">{user.firstName}</Typography>
              </Box>
            )}

            {editField === "firstName" ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={handleCancelClick}
                  sx={styles.cancelButton}
                >
                  <CloseIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
                <IconButton
                  onClick={() => handleSaveClick("firstName")}
                  disabled={!formData.firstName}
                  sx={styles.saveButton}
                >
                  <CheckIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                className="edit-button"
                onClick={() => handleEditClick("firstName")}
              >
                <EditIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            )}
          </Box>

          <Divider />

          {/* Last Name */}
          <Box sx={styles.boxContainer}>
            {editField === "lastName" ? (
              <TextField
                size={isMobile ? "small" : "medium"}
                variant="outlined"
                placeholder="Last Name"
                label="Last Name"
                fullWidth
                type="text"
                autoComplete="family-name"
                autoFocus
                value={formData.lastName}
                InputProps={{
                  style: styles.textFieldInput,
                }}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            ) : (
              <Box sx={styles.columnBox}>
                <Typography
                  variant="h4"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <PersonIcon fontSize={isMobile ? "small" : "medium"} />
                  Last Name
                </Typography>
                <Typography variant="body1">{user.lastName}</Typography>
              </Box>
            )}
            {editField === "lastName" ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={handleCancelClick}
                  sx={styles.cancelButton}
                >
                  <CloseIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
                <IconButton
                  onClick={() => handleSaveClick("lastName")}
                  disabled={!formData.lastName}
                  sx={styles.saveButton}
                >
                  <CheckIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                className="edit-button"
                onClick={() => handleEditClick("lastName")}
              >
                <EditIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            )}
          </Box>

          <Divider />

          {/* Email */}
          <Box sx={styles.boxContainer}>
            {editField === "email" ? (
              <TextField
                size={isMobile ? "small" : "medium"}
                variant="outlined"
                placeholder="Email"
                label="Email"
                fullWidth
                type="email"
                autoFocus
                autoComplete="email"
                value={formData.email}
                InputProps={{
                  style: styles.textFieldInput,
                }}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            ) : (
              <Box sx={styles.columnBox}>
                <Typography
                  variant="h4"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <EmailIcon fontSize={isMobile ? "small" : "medium"} />
                  Email
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>
            )}
            {editField === "email" ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={handleCancelClick}
                  sx={styles.cancelButton}
                >
                  <CloseIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
                <IconButton
                  onClick={() => handleSaveClick("email")}
                  disabled={!formData.email}
                  sx={styles.saveButton}
                >
                  <CheckIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                className="edit-button"
                onClick={() => handleEditClick("email")}
              >
                <EditIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            )}
          </Box>

          <Divider />

          {/* Password */}
          <Box sx={styles.boxContainer}>
            <Box sx={styles.columnBox}>
              <Typography
                variant="h4"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <LockIcon fontSize={isMobile ? "small" : "medium"} />
                Password
              </Typography>
              <Typography variant="body1">●●●●●●●●●</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </DefaultContainer>
  );
};

export default Admin;
