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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const getStatusText = () => {
    if (inStock) {
      return "In stock, " + warehouseLocation;
    } else if (isOrdered) {
      return "Ordered";
    } else {
      return "Out of stock";
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
      <Typography variant="h4">Booking Details</Typography>

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
          Edit
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
          Delete
        </MenuItem>
      </Menu>

      <Divider sx={{ my: 0.5 }} />

      <Typography variant="body2">
        <strong>Car Model:</strong> {carModel}
      </Typography>
      <Typography variant="body2">
        <strong>Plate Number:</strong> {plateNumber}
      </Typography>
      <Typography variant="body2">
        <strong>Phone:</strong> {phoneNumber}
      </Typography>
      {companyName && (
        <Typography variant="body2">
          <strong>Company:</strong> {companyName}
        </Typography>
      )}
      <Typography variant="body2">
        <strong>Glass:</strong> {eurocode}, € {price || 0}
      </Typography>
      <Typography variant="body2">
        <strong>Glass Status:</strong>{" "}
        <span style={{ color: getStatusColor() }}>{getStatusText()}</span>
      </Typography>
      <Typography variant="body2">
        <strong>Work Status:</strong>{" "}
        <span style={{ color: isWorkDone ? "var(--success)" : "var(--error)" }}>
          {isWorkDone ? "Done" : "Not done"}
        </span>
      </Typography>
      <Typography variant="body2">
        <strong>Date and Time:</strong> {dayjs(date).format("DD.MM.YYYY HH:mm")}{" "}
        - {dayjs(date).add(duration, "hour").format("HH:mm")}
      </Typography>
      {notes && (
        <Typography variant="body2">
          <strong>Notes:</strong> {notes}
        </Typography>
      )}
      {user.role === "admin" && (
        <Typography variant="body2">
          <strong>Creator:</strong> {booking.creatorName || "Unknown"}
        </Typography>
      )}
    </Card>
  );
};

export default BookingCard;
