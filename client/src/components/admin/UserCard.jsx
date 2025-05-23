import React from "react";
import { Card, Typography, Box, Divider, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useScreenSize from "../../hooks/useScreenSize";
import { useTranslation } from "react-i18next";

const UserCard = ({ user, onEdit, onDelete }) => {
  const { isMobile, isTablet } = useScreenSize();
  const { t } = useTranslation();

  const handleEdit = () => {
    onEdit(user);
  };

  const handleDelete = () => {
    onDelete(user);
  };

  return (
    <Card
      sx={{
        width: "350px",
        maxWidth: "373.33px",
        flexGrow: 1,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
        color: "var(--off-black)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Icon and Username */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            component="img"
            src={`/icons/${user.role}.webp`}
            alt={t("userCard.iconAlt", { role: user.role })}
            sx={{
              width: isMobile ? "20px" : isTablet ? "24px" : "28px",
              height: isMobile ? "20px" : isTablet ? "24px" : "28px",
            }}
          />
          <Typography variant="h4">{user.username}</Typography>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <IconButton
            onClick={handleDelete}
            sx={{
              p: 0.5,
              height: 32,
              width: 32,
              transition: "color 0.2s ease",
              color: "var(--error)",
              "&:hover": { color: "var(--error-onhover)" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleEdit}
            sx={{
              p: 0.5,
              height: 32,
              width: 32,
              transition: "color 0.2s ease",
              color: "var(--primary)",
              "&:hover": { color: "var(--primary-onhover)" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {t("userCard.firstName")}
        </Typography>
        <Typography variant="body2">
          {user.firstName || t("userCard.na")}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {t("userCard.lastName")}
        </Typography>
        <Typography variant="body2">
          {user.lastName || t("userCard.na")}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {t("userCard.email")}
        </Typography>
        <Typography variant="body2">
          {user.email || t("userCard.na")}
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {t("userCard.role")}
        </Typography>
        <Typography variant="body2">
          {user.role === "admin" ? t("userCard.admin") : t("userCard.regular")}
        </Typography>
      </Box>
      {user.role !== "admin" && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {t("userCard.location")}
          </Typography>
          <Typography variant="body2">
            {user.locationTitle || t("userCard.na")}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default UserCard;
