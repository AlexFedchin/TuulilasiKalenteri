import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  Alert,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import SendIcon from "@mui/icons-material/ForwardToInbox";
import { useTranslation } from "react-i18next";
import useScreenSize from "../hooks/useScreenSize.js";
import { useEffect } from "react";
import { alert } from "../utils/alert.js";

const ForgotPasswordModal = ({ onClose }) => {
  const { t } = useTranslation();
  const { isMobile } = useScreenSize();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    setStep(0);
    const timer = setTimeout(() => {
      setStep(1);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("alert.unexpectedError"));
      }

      setStep(2);

      setTimeout(() => {
        onClose();
        alert.success(t("alert.resetEmailSent"));
      }, 1500);
    } catch (error) {
      setError(error.message || t("alert.unexpectedError"));
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
          <Typography variant="h4">{t("forgotPasswordModal.title")}</Typography>
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
          value={step === 0 ? 0 : step === 1 ? 50 : 100}
          sx={{
            width: "100%",
            height: 8,
            borderRadius: 5,
            bgcolor: "var(--off-white)",
            "& .MuiLinearProgress-bar": {
              transition:
                "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
              borderRadius: 5,
              bgcolor: step === 2 ? "var(--success)" : "var(--primary)",
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            width: "100%",
            flexGrow: 1,
          }}
        >
          {step === 1 && (
            <>
              <Box
                sx={{
                  width: "100%",
                  flexGrow: 1,
                  px: 2,
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
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
                  {t("forgotPasswordModal.subtitle")}
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  <TextField
                    variant="outlined"
                    size="small"
                    type="text"
                    label={t("forgotPasswordModal.usernameLabel")}
                    placeholder={t("forgotPasswordModal.usernamePlaceholder")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {error && (
                    <Typography variant="caption" color="error">
                      {error}
                    </Typography>
                  )}
                </Box>
                <Alert severity="info">
                  {t("forgotPasswordModal.details")}
                </Alert>
              </Box>

              <Button
                variant="submit"
                loading={loading}
                loadingPosition="start"
                disabled={!username}
                sx={{ width: "100%" }}
                startIcon={<SendIcon />}
                onClick={handleSubmit}
              >
                {t("forgotPasswordModal.sendResetLink")}
              </Button>
            </>
          )}
          {step === 2 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 2,
                pt: 0,
                width: "100%",
                boxSizing: "border-box",
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "300px",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  color: "var(--success)",
                  bgcolor: "var(--success-bg)",
                }}
              >
                <DoneIcon />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  fontWeight: 500,
                  color: "var(--success)",
                }}
              >
                {t("forgotPasswordModal.successMessage")}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ForgotPasswordModal;
