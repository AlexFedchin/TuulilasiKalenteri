import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LanguageIcon from "@mui/icons-material/Language";
import { useAuth } from "../context/AuthContext.jsx";
import DefaultContainer from "../components/DefaultContainer.jsx";
import useScreenSize from "../hooks/useScreenSize.js";
import { useTranslation } from "react-i18next";
import { alert } from "../utils/alert.js";
import ForgotPasswordModal from "../components/ForgotPasswordModal.jsx";
import LanguageSelectionMenu from "../components/LanguageSelectionMenu.jsx";

const Authentication = () => {
  const { t } = useTranslation();
  const { login, isTokenExpired, token } = useAuth();
  const { isMobile } = useScreenSize();
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "regular",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("alert.unexpectedError"));
      }

      login(data.user, data.token);
      alert.info(t("alert.loginSuccess", { username: form.username }));
      setError("");
    } catch (error) {
      setError(error.message || t("alert.unexpectedError"));
      console.error("Login error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <DefaultContainer
      sx={{
        maxWidth: "600px",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box
        component="img"
        src="/logo.webp"
        alt="Logo"
        draggable="false"
        loading="lazy"
        sx={{
          position: "absolute",
          top: 64,
          maxHeight: isMobile ? "2.5%" : "3.5%",
          maxWidth: "calc(100% - 64px)",
        }}
      />

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: isMobile ? "300px" : "600px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            mb: isMobile ? 1 : 2,
            width: "100%",
            textAlign: "center",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" width="100%">
            {t("authentication.title")}
          </Typography>
          <IconButton
            sx={{ position: "absolute", right: 0 }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <LanguageIcon fontSize={isMobile ? "small" : "normal"} />
          </IconButton>
        </Box>
        <LanguageSelectionMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
        {isTokenExpired && (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", mb: isMobile ? 1 : 2 }}
          >
            {t("authentication.expiredSession")}
          </Typography>
        )}
        <TextField
          fullWidth
          label={t("authentication.username")}
          type="text"
          name="username"
          autoComplete="username"
          autoFocus
          margin={isMobile ? "dense" : "normal"}
          size={isMobile ? "small" : "medium"}
          value={form.username}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label={t("authentication.password")}
          name="password"
          type={showPassword ? "text" : "password"}
          margin={isMobile ? "dense" : "normal"}
          size={isMobile ? "small" : "medium"}
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                    sx={{
                      color: showPassword
                        ? "var(--accent-color)"
                        : "var(--off-white-color)",
                    }}
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {error && (
          <Typography variant="body2" sx={{ color: "var(--error)" }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="submit"
          disabled={!form.password || !form.username}
          size={isMobile ? "normal" : "large"}
          sx={{ mt: isMobile ? 1 : 2, width: "100%" }}
        >
          {t("authentication.loginButton")}
        </Button>
        <Button
          variant="secondary"
          size={isMobile ? "normal" : "large"}
          sx={{
            mt: isMobile ? 1 : 2,
            width: "100%",
          }}
          onClick={() => {
            setIsForgotPasswordOpen(true);
            setError("");
          }}
        >
          {t("authentication.forgotPassword")}
        </Button>
      </form>

      {isForgotPasswordOpen && (
        <ForgotPasswordModal onClose={() => setIsForgotPasswordOpen(false)} />
      )}
    </DefaultContainer>
  );
};

export default Authentication;
