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

const Admin = () => {
  const { user, setUser, token } = useAuth();
  const { isMobile, isTablet } = useScreenSize();
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
  });

  const handleEditClick = (field) => {
    setEditField(field);
  };

  const handleCancelClick = () => {
    setEditField(null);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
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

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      const updatedUser = await response.json();

      setUser(updatedUser);
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
          <Box
            sx={{
              width: "100%",
              display: "flex",
              boxSizing: "border-box",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h4"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <SettingsIcon />
                Username
              </Typography>
              <Typography variant="body1">{user.username}</Typography>
            </Box>
          </Box>

          <Divider />

          {/* First Name */}
          <Box
            sx={{
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
            }}
          >
            {editField === "firstName" ? (
              <TextField
                variant="outlined"
                placeholder="First Name"
                label="First Name"
                fullWidth
                type="text"
                autoComplete="given-name"
                autoFocus
                value={formData.firstName}
                InputProps={{
                  style: {
                    padding: 0,
                    fontSize: "16px",
                    borderRadius: "4px",
                  },
                }}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            ) : (
              <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                <Typography
                  variant="h4"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <PersonIcon />
                  First Name
                </Typography>
                <Typography variant="body1">
                  {!user.firstName ? (
                    <i style={{ color: "var(--error)" }}>Not set</i>
                  ) : (
                    user.firstName
                  )}
                </Typography>
              </Box>
            )}

            {editField === "firstName" ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton onClick={handleCancelClick}>
                  <CloseIcon />
                </IconButton>
                <IconButton onClick={() => handleSaveClick("firstName")}>
                  <CheckIcon />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                className="edit-button"
                onClick={() => handleEditClick("firstName")}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Divider />

          {/* Last Name */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              boxSizing: "border-box",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
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
            }}
          >
            {editField === "lastName" ? (
              <TextField
                variant="outlined"
                placeholder="Last Name"
                label="Last Name"
                fullWidth
                type="text"
                autoComplete="family-name"
                autoFocus
                value={formData.lastName}
                InputProps={{
                  style: {
                    padding: 0,
                    fontSize: "16px",
                    borderRadius: "4px",
                  },
                }}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            ) : (
              <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                <Typography
                  variant="h4"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <PersonIcon />
                  Last Name
                </Typography>
                <Typography variant="body1">
                  {!user.lastName ? (
                    <i style={{ color: "var(--error)" }}>Not set</i>
                  ) : (
                    user.lastName
                  )}
                </Typography>
              </Box>
            )}
            {editField === "lastName" ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton onClick={handleCancelClick}>
                  <CloseIcon />
                </IconButton>
                <IconButton onClick={() => handleSaveClick("lastName")}>
                  <CheckIcon />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                className="edit-button"
                onClick={() => handleEditClick("lastName")}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Divider />

          {/* Email */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              boxSizing: "border-box",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
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
            }}
          >
            {editField === "email" ? (
              <TextField
                variant="outlined"
                placeholder="Email"
                label="Email"
                fullWidth
                type="email"
                autoFocus
                autoComplete="email"
                value={formData.email}
                InputProps={{
                  style: {
                    padding: 0,
                    fontSize: "16px",
                    borderRadius: "4px",
                  },
                }}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            ) : (
              <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                <Typography
                  variant="h4"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <EmailIcon />
                  Email
                </Typography>
                <Typography variant="body1">
                  {!user.email ? (
                    <i style={{ color: "var(--error)" }}>Not set</i>
                  ) : (
                    user.email
                  )}
                </Typography>
              </Box>
            )}
            {editField === "email" ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton onClick={handleCancelClick}>
                  <CloseIcon />
                </IconButton>
                <IconButton onClick={() => handleSaveClick("email")}>
                  <CheckIcon />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                className="edit-button"
                onClick={() => handleEditClick("email")}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>

          <Divider />

          {/* Password */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              boxSizing: "border-box",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
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
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h4"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <LockIcon />
                Password
              </Typography>
              <Typography variant="body1">●●●●●●●●●</Typography>
            </Box>

            <IconButton className="edit-button">
              <EditIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </DefaultContainer>
  );
};

export default Admin;
