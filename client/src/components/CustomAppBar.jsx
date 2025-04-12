import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import AccountIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useScreenSize from "../hooks/useScreenSize";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

const CustomAppBar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isTablet } = useScreenSize();
  const { t } = useTranslation();

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/");
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setLanguageAnchorEl(null);
  };

  const navItems = [
    { label: t("nav.calendar"), path: "/" },
    { label: t("nav.bookings"), path: "/bookings" },
    ...(user.role === "admin"
      ? [{ label: t("nav.admin"), path: "/admin" }]
      : []),
  ];

  if (!user) return null;

  return (
    <AppBar
      position="static"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 2,
        backgroundColor: "var(--white)",
        color: "var(--off-black)",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Logo */}
          <Box
            component="img"
            src="/logo.webp"
            draggable="false"
            onClick={() => navigate("/")}
            alt="Logo"
            sx={{
              maxWidth: isMobile ? "100px" : isTablet ? "125px" : "150px",
              mr: 1,
              cursor: "pointer",
              userSelect: "none",
            }}
          />
          {/* Navigation */}
          {!isMobile &&
            navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  bgcolor:
                    location.pathname === item.path
                      ? "var(--off-white)"
                      : "transparent",
                }}
              >
                {item.label}
              </Button>
            ))}
        </Box>

        {/* User info and dropdown */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "var(--off-black)",
              textTransform: "none",
            }}
          >
            <AccountIcon />
            {user.username}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                navigate("/my-profile");
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText>{t("menu.myProfile")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "var(--error)" }}>
              <ListItemIcon sx={{ color: "inherit" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>{t("menu.logout")}</ListItemText>
            </MenuItem>
          </Menu>

          {/* Language Selector */}
          <Button
            onClick={(e) => setLanguageAnchorEl(e.currentTarget)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "var(--off-black)",
              textTransform: "none",
            }}
          >
            <LanguageIcon />
            {i18n.language.toUpperCase()}
          </Button>

          <Menu
            anchorEl={languageAnchorEl}
            open={Boolean(languageAnchorEl)}
            onClose={() => setLanguageAnchorEl(null)}
          >
            <MenuItem onClick={() => handleLanguageChange("en")}>
              {t("language.english")}
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange("fi")}>
              {t("language.finnish")}
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange("ru")}>
              {t("language.russian")}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
