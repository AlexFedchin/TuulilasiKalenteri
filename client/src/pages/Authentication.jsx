import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../context/AuthContext.jsx";
import DefaultContainer from "../components/DefaultContainer.jsx";
import useScreenSize from "../hooks/useScreenSize.js";

const Authentication = () => {
  const { login, isTokenExpired } = useAuth();
  const { isMobile, isTablet } = useScreenSize();
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "regular",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      login(data.user, data.token);
      setError("");
    } catch (err) {
      setError("Network error: " + err.message);
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
          top: isMobile ? 64 : 128,
          maxHeight: isMobile ? "3%" : "4%",
          maxWidth: "calc(100% - 32px)",
        }}
      />

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <Typography variant="h3" sx={{ mb: isMobile ? 1 : 2 }}>
          Login
        </Typography>
        {isTokenExpired && (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", mb: isMobile ? 1 : 2 }}
          >
            Your session has expired. Please log in again.
          </Typography>
        )}
        <TextField
          fullWidth
          label="Username"
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
          label="Password"
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
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {error && (
          <Typography sx={{ color: "var(--error)" }}>{error}</Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={!form.password || !form.username}
          size={isMobile ? "normal" : isTablet ? "normal" : "large"}
          sx={{ mt: 2, width: "100%" }}
        >
          Login
        </Button>
      </form>
    </DefaultContainer>
  );
};

export default Authentication;
