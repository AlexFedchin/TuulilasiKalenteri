import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LanguageIcon from "@mui/icons-material/Language";
import DoneIcon from "@mui/icons-material/Done";
import DefaultContainer from "../components/DefaultContainer";
import Loader from "../components/loader/Loader";
import { useTranslation } from "react-i18next";
import { alert } from "../utils/alert";
import useScreenSize from "../hooks/useScreenSize.js";
import { passwordValidationSchema } from "../validation/passwordValidationSchema.js";

const ResetPassword = () => {
  const { t, i18n } = useTranslation();
  const { isMobile } = useScreenSize();
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setAnchorEl(null);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Verify provided reset token on component mount
  useEffect(() => {
    const verifyResetToken = async () => {
      setLoading(true);
      if (!resetToken) {
        throw new Error("No reset token provided");
      }

      try {
        const response = await fetch("/api/auth/verify-reset-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resetToken }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Invalid or expired token");
        }

        setUsername(result.username);
      } catch (error) {
        setTokenError(error.message);
        console.error("Error verifying reset token:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyResetToken();
  }, []);

  // Handle form submission for password reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!form.password || !form.confirmPassword) {
        throw new Error("Please fill in all fields");
      }

      if (form.password.trim() !== form.confirmPassword.trim()) {
        throw new Error("Passwords do not match");
      }

      // Validate password and confirm password
      const { error } = passwordValidationSchema.validate(
        { password: form.password },
        {
          abortEarly: false,
        }
      );

      if (error) {
        const firstMessage = error.details[0].message;
        console.error("Validation error:", firstMessage);
        throw new Error(firstMessage);
      }

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({ password: form.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong. Please try again."
        );
      }

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/");
        alert.success(
          "Password changes successfully! Please don't forget it this time."
        );
      }, 2000);
    } catch (error) {
      setError(error.message);
      console.error("Error changing password:", error);
    } finally {
      setSubmitting(false);
    }
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
        onClick={() => navigate("/")}
        sx={{
          cursor: "pointer",
          position: "absolute",
          top: 64,
          maxHeight: isMobile ? "2.5%" : "3.5%",
          maxWidth: "calc(100% - 64px)",
        }}
      />

      {loading ? (
        <Loader />
      ) : tokenError ? (
        <Box>
          <Typography variant="h2" sx={{ color: "var(--accent)" }}>
            Your reset link is invalid
          </Typography>
          <Typography variant="body1" marginTop={2}>
            It has either expired or has already been used. If you need to reset
            your password, please request a new reset link.
          </Typography>
        </Box>
      ) : showSuccess ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
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
            Password changed successfully!
          </Typography>
        </Box>
      ) : (
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
              Reset Password
            </Typography>
            <IconButton
              sx={{ position: "absolute", right: 0 }}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <LanguageIcon fontSize={isMobile ? "small" : "normal"} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem
                onClick={() => changeLanguage("en")}
                sx={{
                  bgcolor:
                    i18n.language === "en"
                      ? "var(--white-onhover)"
                      : "transparent",
                }}
              >
                English
              </MenuItem>
              <MenuItem
                onClick={() => changeLanguage("fi")}
                sx={{
                  bgcolor:
                    i18n.language === "fi"
                      ? "var(--white-onhover)"
                      : "transparent",
                }}
              >
                Finnish
              </MenuItem>
              <MenuItem
                onClick={() => changeLanguage("ru")}
                sx={{
                  bgcolor:
                    i18n.language === "ru"
                      ? "var(--white-onhover)"
                      : "transparent",
                }}
              >
                Русский
              </MenuItem>
            </Menu>
          </Box>

          <TextField
            fullWidth
            label={"Username"}
            type="text"
            name="username"
            disabled
            value={username}
            margin={isMobile ? "dense" : "normal"}
            size={isMobile ? "small" : "medium"}
          />
          <TextField
            fullWidth
            label={"New Password"}
            name="password"
            type={showPassword ? "text" : "password"}
            margin={isMobile ? "dense" : "normal"}
            size={isMobile ? "small" : "medium"}
            disabled={submitting}
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
          <TextField
            fullWidth
            label={"Confirm Password"}
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            margin={isMobile ? "dense" : "normal"}
            size={isMobile ? "small" : "medium"}
            disabled={submitting}
            value={form.confirmPassword}
            onChange={handleChange}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                      sx={{
                        color: showConfirmPassword
                          ? "var(--accent-color)"
                          : "var(--off-white-color)",
                      }}
                    >
                      {showConfirmPassword ? (
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
            <Typography variant="body2" sx={{ color: "var(--error)" }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="submit"
            loading={submitting}
            loadingPosition="start"
            disabled={!form.password || !form.confirmPassword}
            size={isMobile ? "normal" : "large"}
            sx={{ mt: isMobile ? 1 : 2, width: "100%" }}
          >
            {"Reset Password"}
          </Button>
        </form>
      )}
    </DefaultContainer>
  );
};

export default ResetPassword;
