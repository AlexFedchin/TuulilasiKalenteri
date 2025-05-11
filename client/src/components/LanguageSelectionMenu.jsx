import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";

const LanguageSelectionMenu = ({ anchorEl, setAnchorEl }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem
        onClick={() => changeLanguage("en")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor:
            i18n.language === "en" ? "var(--white-onhover)" : "transparent",
        }}
      >
        <Box
          component="img"
          src="/languages/en.webp"
          sx={{
            width: "auto",
            height: "auto",
            maxWidth: "20px",
          }}
        />
        English
      </MenuItem>
      <MenuItem
        onClick={() => changeLanguage("fi")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor:
            i18n.language === "fi" ? "var(--white-onhover)" : "transparent",
        }}
      >
        <Box
          component="img"
          src="/languages/fi.webp"
          sx={{
            width: "auto",
            height: "auto",
            maxWidth: "20px",
          }}
        />
        Suomi
      </MenuItem>
      <MenuItem
        onClick={() => changeLanguage("ru")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor:
            i18n.language === "ru" ? "var(--white-onhover)" : "transparent",
        }}
      >
        <Box
          component="img"
          src="/languages/ru.webp"
          sx={{
            width: "auto",
            height: "auto",
            maxWidth: "20px",
          }}
        />
        Русский
      </MenuItem>
    </Menu>
  );
};

export default LanguageSelectionMenu;
