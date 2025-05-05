import React, { useState } from "react";
import {
  Card,
  Divider,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const BookingCard = ({ booking, onEditClick, onDeleteClick }) => {
  const {
    date,
    notes,
    plateNumber,
    phoneNumber,
    carModel,
    companyName,
    duration,
    eurocode,
    inStock,
    isOrdered,
    warehouseLocation,
    price,
    isWorkDone,
  } = booking;

  const { user } = useAuth();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const getStatusText = () => {
    if (inStock) {
      return t("bookingCard.inStock", { location: warehouseLocation });
    } else if (isOrdered) {
      return t("bookingCard.ordered");
    } else {
      return t("bookingCard.outOfStock");
    }
  };

  const getStatusColor = () => {
    if (inStock) {
      return "var(--success)";
    } else if (isOrdered) {
      return "var(--ordered)";
    } else {
      return "var(--error)";
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        p: 2,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <Typography variant="h4">{t("bookingCard.title")}</Typography>

      <IconButton
        onClick={handleMenuOpen}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onEditClick(booking);
          }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          {t("menu.edit")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDeleteClick(booking);
          }}
          sx={{
            color: "var(--error)",
            "&:hover": { color: "var(--error-onhover)" },
          }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          {t("menu.delete")}
        </MenuItem>
      </Menu>

      <Divider sx={{ my: 0.5 }} />

      <Typography variant="body2">
        <strong>{t("bookingCard.carModel")}:</strong> {carModel}
      </Typography>
      <Typography variant="body2">
        <strong>{t("bookingCard.plateNumber")}:</strong> {plateNumber}
      </Typography>
      <Typography variant="body2">
        <strong>{t("bookingCard.phone")}:</strong> {phoneNumber}
      </Typography>
      {companyName && (
        <Typography variant="body2">
          <strong>{t("bookingCard.company")}:</strong> {companyName}
        </Typography>
      )}
      <Typography variant="body2">
        <strong>{t("bookingCard.glass")}:</strong> {eurocode}, € {price || 0}
      </Typography>
      <Typography variant="body2">
        <strong>{t("bookingCard.glassStatus")}:</strong>{" "}
        <span style={{ color: getStatusColor() }}>{getStatusText()}</span>
      </Typography>
      <Typography variant="body2">
        <strong>{t("bookingCard.workStatus")}:</strong>{" "}
        <span style={{ color: isWorkDone ? "var(--success)" : "var(--error)" }}>
          {isWorkDone ? t("bookingCard.done") : t("bookingCard.notDone")}
        </span>
      </Typography>
      <Typography variant="body2">
        <strong>{t("bookingCard.dateAndTime")}:</strong>{" "}
        {dayjs(date).format("DD.MM.YYYY HH:mm")} -{" "}
        {dayjs(date).add(duration, "hour").format("HH:mm")}
      </Typography>
      {notes && (
        <Typography variant="body2">
          <strong>{t("bookingCard.notes")}:</strong> {notes}
        </Typography>
      )}
      {user.role === "admin" && (
        <Typography variant="body2">
          <strong>{t("bookingCard.creator")}:</strong>{" "}
          {booking.creatorName || t("bookingCard.unknown")}
        </Typography>
      )}
    </Card>
  );
};

export default BookingCard;
