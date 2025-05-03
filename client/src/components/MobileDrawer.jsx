import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import i18n from "../utils/i18n";

const MobileDrawer = ({ open, toggleDrawer, navItems }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          width: 250,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          bgcolor: "var(--white)",
          color: "var(--off-black)",
          py: 2,
          gap: 1,
        }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        {/* Top Row */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            px: 1,
            boxSizing: "border-box",
          }}
        >
          <Button
            onClick={() => navigate("/my-profile")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "var(--off-black)",
              textTransform: "none",
              width: "fit-content",
            }}
          >
            <AccountIcon />
            {user.username}
          </Button>

          <IconButton onClick={handleLogout} sx={{ color: "var(--error)" }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider />

        <Box
          sx={{
            width: "100%",
            boxSizing: "border-box",
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1,
            color: "inherit",
          }}
        >
          <Button
            onClick={() => handleLanguageChange("en")}
            sx={{
              color: "inherit",
              bgcolor:
                i18n.language === "en" ? "var(--off-white)" : "transparent",
            }}
          >
            EN
          </Button>
          <Button
            onClick={() => handleLanguageChange("fi")}
            sx={{
              color: "inherit",
              bgcolor:
                i18n.language === "fi" ? "var(--off-white)" : "transparent",
            }}
          >
            FI
          </Button>
          <Button
            onClick={() => handleLanguageChange("ru")}
            sx={{
              color: "inherit",
              bgcolor:
                i18n.language === "ru" ? "var(--off-white)" : "transparent",
            }}
          >
            RU
          </Button>
        </Box>

        <List disablePadding>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  bgcolor:
                    location.pathname === item.path
                      ? "var(--off-white)"
                      : "inherit",
                  "&:active": {
                    backgroundColor: "var(--off-white)",
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box
          component="img"
          src="/logo.webp"
          sx={{ width: "50%", mt: "auto", mx: "auto" }}
        />
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;
