import React, { useState } from "react";
import {
  Card,
  Box,
  CardContent,
  Typography,
  Divider,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteAccountIcon from "@mui/icons-material/PersonRemove";
import DefaultContainer from "../components/DefaultContainer";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { useAuth } from "../context/AuthContext";
import useScreenSize from "../hooks/useScreenSize";
import { alert } from "../utils/alert";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../components/ConfirmModal";

const getStyles = (isMobile, isTablet) => ({
  boxContainer: {
    width: "100%",
    display: "flex",
    boxSizing: "border-box",
    justifyContent: "space-between",
    alignItems: "center",
    height: isMobile ? "48.4px" : isTablet ? "54.8px" : "58.8px",
    minHeight: isMobile ? "48.4px" : isTablet ? "54.8px" : "58.8px",
    maxHeight: isMobile ? "48.4px" : isTablet ? "54.8px" : "58.8px",
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

const MyProfile = () => {
  const { user, setUser, token, logout } = useAuth();
  const { isMobile, isTablet } = useScreenSize();
  const { t } = useTranslation();
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

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
    if (submitting) return;
    setSubmitting(true);
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
        throw new Error(result.error || t("alert.unexpectedError"));
      }

      alert.success(t("alert.profileUpdateSuccess"));
      setUser(result);
      setEditField(null);
    } catch (error) {
      alert.error(
        `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
      );
      console.error("Error saving changes:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("alert.unexpectedError"));
      }

      alert.success(t("alert.accountDeleteSuccess"));
      logout();
    } catch (error) {
      alert.error(
        `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
      );
      console.error("Error deleting account:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultContainer>
      <Typography variant="h2">{t("myProfile.title")}</Typography>
      <Card sx={{ width: "100%", bgcolor: "var(--white)" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Username */}
          <Box sx={styles.boxContainer}>
            {editField === "username" ? (
              <TextField
                size={isMobile ? "small" : "medium"}
                variant="outlined"
                placeholder={t("myProfile.usernamePlaceholder")}
                label={t("myProfile.usernameLabel")}
                fullWidth
                type="text"
                autoComplete="given-name"
                autoFocus
                value={formData.username}
                slotProps={{
                  input: {
                    sx: styles.textFieldInput,
                  },
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
                  {t("myProfile.usernameLabel")}
                </Typography>
                <Typography variant="body1">{user.username}</Typography>
              </Box>
            )}

            {editField === "username" ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={handleCancelClick}
                  sx={styles.cancelButton}
                  disabled={submitting}
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
                placeholder={t("myProfile.firstNamePlaceholder")}
                label={t("myProfile.firstNameLabel")}
                fullWidth
                type="text"
                autoComplete="given-name"
                autoFocus
                value={formData.firstName}
                slotProps={{
                  input: {
                    sx: styles.textFieldInput,
                  },
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
                  {t("myProfile.firstNameLabel")}
                </Typography>
                <Typography variant="body1">{user.firstName}</Typography>
              </Box>
            )}

            {editField === "firstName" ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={handleCancelClick}
                  sx={styles.cancelButton}
                  disabled={submitting}
                >
                  <CloseIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
                <IconButton
                  onClick={() => handleSaveClick("firstName")}
                  disabled={!formData.firstName}
                  loading={submitting}
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
                placeholder={t("myProfile.lastNamePlaceholder")}
                label={t("myProfile.lastNameLabel")}
                fullWidth
                type="text"
                autoComplete="family-name"
                autoFocus
                value={formData.lastName}
                slotProps={{
                  input: {
                    sx: styles.textFieldInput,
                  },
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
                  {t("myProfile.lastNameLabel")}
                </Typography>
                <Typography variant="body1">{user.lastName}</Typography>
              </Box>
            )}
            {editField === "lastName" ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={handleCancelClick}
                  sx={styles.cancelButton}
                  disabled={submitting}
                >
                  <CloseIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
                <IconButton
                  onClick={() => handleSaveClick("lastName")}
                  disabled={!formData.lastName}
                  loading={submitting}
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
                placeholder={t("myProfile.emailPlaceholder")}
                label={t("myProfile.emailLabel")}
                fullWidth
                type="email"
                autoFocus
                autoComplete="email"
                value={formData.email}
                slotProps={{
                  input: {
                    sx: styles.textFieldInput,
                  },
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
                  {t("myProfile.emailLabel")}
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>
            )}
            {editField === "email" ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={handleCancelClick}
                  sx={styles.cancelButton}
                  disabled={submitting}
                >
                  <CloseIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
                <IconButton
                  onClick={() => handleSaveClick("email")}
                  disabled={!formData.email}
                  loading={submitting}
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
                {t("myProfile.passwordLabel")}
              </Typography>
              <Typography variant="body1">●●●●●●●●●</Typography>
            </Box>
            <IconButton
              className="edit-button"
              onClick={() => setOpenPasswordModal(true)}
            >
              <EditIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Box>
          <Divider />

          {/* Delete Account */}
          <Button
            variant="delete"
            startIcon={<DeleteAccountIcon />}
            onClick={() => setOpenConfirmModal(true)}
            sx={{ mt: 1 }}
          >
            {t("myProfile.deleteAccount")}
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Modal */}
      {openConfirmModal && (
        <ConfirmModal
          onClose={() => setOpenConfirmModal(false)}
          onConfirm={handleDeleteAccount}
          text={t("myProfile.deleteAccountConfirm")}
        />
      )}

      {/* Password Modal */}
      {openPasswordModal && (
        <ChangePasswordModal onClose={() => setOpenPasswordModal(false)} />
      )}
    </DefaultContainer>
  );
};

export default MyProfile;
