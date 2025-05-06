import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Divider,
  IconButton,
  LinearProgress,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowLeftIcon from "@mui/icons-material/KeyboardBackspace";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import useScreenSize from "../hooks/useScreenSize";
import { alert } from "../utils/alert";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const ChangePasswordModal = ({ onClose }) => {
  const { t } = useTranslation();
  const { isMobile } = useScreenSize();
  const { user, token } = useAuth();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };
  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword((prev) => !prev);
  };

  const handleCheckPassword = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/check-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: currentPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `${t("alert.unexpectedError")}`);
      }

      setStep(2);
    } catch (error) {
      setError(error.message || t("alert.unexpectedError"));
      console.error("Error while checking password:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setError(t("changePasswordModal.passwordsDoNotMatch"));
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("alert.unexpectedError"));
      }
      setStep(3);

      setTimeout(() => {
        onClose();
        alert.success(t("alert.passwordChangeSuccess"));
      }, 1500);
    } catch (error) {
      setError(error.message || t("alert.unexpectedError"));
      console.error("Error while changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          minWidth: "300px",
          boxSizing: "border-box",
          maxWidth: "500px",
          minHeight: "400px",
          bgcolor: "var(--white)",
          boxShadow: 24,
          p: isMobile ? 2 : 3,
          borderRadius: 2,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            position: "relative",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">{t("changePasswordModal.title")}</Typography>
          <IconButton
            onClick={onClose}
            disabled={loading}
            sx={{ position: "absolute", right: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <LinearProgress
          variant="determinate"
          value={step === 1 ? 33 : step === 2 ? 66 : 100}
          sx={{
            height: 8,
            borderRadius: 5,
            bgcolor: "var(--off-white)",
            "& .MuiLinearProgress-bar": {
              transition:
                "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
              borderRadius: 5,
              bgcolor: step === 3 ? "var(--success)" : "var(--primary)",
            },
          }}
        />

        {step === 1 && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                p: 2,
                width: "100%",
                boxSizing: "border-box",
                flexGrow: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  fontWeight: 550,
                  color: "var(--off-black)",
                }}
              >
                {t("changePasswordModal.enterCurrentPassword")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  my: "auto",
                }}
              >
                <TextField
                  size="small"
                  variant="outlined"
                  label={t("changePasswordModal.currentPassword")}
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  disabled={loading}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCheckPassword();
                    }
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={t(
                              "changePasswordModal.togglePasswordVisibility"
                            )}
                            onClick={togglePasswordVisibility}
                            edge="end"
                            sx={{
                              color: showPassword
                                ? "var(--accent-color)"
                                : "var(--off-white-color)",
                            }}
                          >
                            {showPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                {error && (
                  <Typography variant="caption" color="error">
                    {error}
                  </Typography>
                )}
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowLeftIcon sx={{ transform: "rotate(180deg)" }} />}
              sx={{ mt: "auto" }}
              onClick={handleCheckPassword}
              disabled={!currentPassword}
              loading={loading}
              loadingPosition="end"
            >
              {t("changePasswordModal.next")}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                p: 2,
                width: "100%",
                boxSizing: "border-box",
                flexGrow: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  fontWeight: 550,
                  color: "var(--off-black)",
                }}
              >
                {t("changePasswordModal.enterNewPassword")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  my: "auto",
                }}
              >
                <TextField
                  size="small"
                  fullWidth
                  variant="outlined"
                  label={t("changePasswordModal.newPassword")}
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  disabled={loading}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{ mb: 1 }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={t(
                              "changePasswordModal.toggleNewPasswordVisibility"
                            )}
                            onClick={toggleNewPasswordVisibility}
                            edge="end"
                            sx={{
                              color: showNewPassword
                                ? "var(--accent-color)"
                                : "var(--off-white-color)",
                            }}
                          >
                            {showNewPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  size="small"
                  fullWidth
                  variant="outlined"
                  label={t("changePasswordModal.confirmNewPassword")}
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  disabled={loading}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleChangePassword();
                    }
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={t(
                              "changePasswordModal.toggleConfirmNewPasswordVisibility"
                            )}
                            onClick={toggleConfirmNewPasswordVisibility}
                            edge="end"
                            sx={{
                              color: showConfirmNewPassword
                                ? "var(--accent-color)"
                                : "var(--off-white-color)",
                            }}
                          >
                            {showConfirmNewPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                {error && (
                  <Typography variant="caption" color="error">
                    {error}
                  </Typography>
                )}
              </Box>
            </Box>
            <Button
              variant="submit"
              color="primary"
              endIcon={<DoneIcon />}
              onClick={handleChangePassword}
              disabled={loading || !newPassword || !confirmNewPassword}
              sx={{ mt: "auto" }}
              loading={loading}
              loadingPosition="end"
            >
              {t("changePasswordModal.changePassword")}
            </Button>
          </>
        )}

        {step === 3 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
              width: "100%",
              boxSizing: "border-box",
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                fontWeight: 500,
                color: "var(--success)",
              }}
            >
              {t("alert.passwordChangeSuccess")}
            </Typography>
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                color: "var(--success)",
                bgcolor: "#38b31915",
              }}
            >
              <DoneIcon />
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
