import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import AccountIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CustomAppBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null; // Don’t show AppBar if not logged in

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Bookings", path: "/bookings" },
    ...(user.role === "admin" ? [{ label: "Admin", path: "/admin" }] : []),
  ];

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left: navigation */}
        <Box>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                textDecoration:
                  location.pathname === item.path ? "underline" : "none",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Right: user info and logout */}
        <Box display="flex" alignItems="center" gap={2}>
          <AccountIcon />
          <Typography variant="body1">{user.username}</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
