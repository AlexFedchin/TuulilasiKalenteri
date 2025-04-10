import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";

const Authentication = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "regular",
  });
  const [error, setError] = useState("");

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

  return (
    <Container
      maxWidth="sm"
      sx={{
        maxWidth: "600px",
        height: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h5">Login</Typography>
        <TextField
          fullWidth
          label="Username"
          name="username"
          margin="normal"
          value={form.username}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          margin="normal"
          value={form.password}
          onChange={handleChange}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Authentication;
