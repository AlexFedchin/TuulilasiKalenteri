import React, { useState } from "react";
import {
  Card,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Done";
import CrossIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const NewBookingCard = ({ booking, onEditClick, onDeleteClick }) => {
  const {
    date,
    plateNumber,
    phoneNumber,
    carModel,
    companyName,
    duration,
    inStock,
    eurocode,
    warehouseLocation,
    isOrdered,
    price,
    isWorkDone,
  } = booking;

  //   const { user } = useAuth();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatTimeRange = () => {
    const start = dayjs(date);
    const end = start.add(duration, "hour");
    return `${start.format("D MMM YYYY, HH:mm")} – ${end.format("HH:mm")}`;
  };

  return (
    <Card
      sx={{
        width: "100%",
        p: 2,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        gap: 1,
      }}
    >
      {/* Header: Date and Time */}
      <Typography variant="body1" sx={{ fontWeight: 700 }}>
        {formatTimeRange()}
      </Typography>

      {/* Menu button */}
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

      {/* Grid Content */}
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
        {/* Car Info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            borderRadius: 1,
            bgcolor: "var(--white-onhover)",
            p: 1,
            flexGrow: 1,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{ color: "var(--off-grey)" }}
          >
            CLIENT INFO
          </Typography>
          <Divider />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "var(--off-black)", my: -0.5 }}
          >
            {carModel}
          </Typography>
          <Typography variant="body2">{plateNumber}</Typography>
          <Typography variant="body2">{phoneNumber}</Typography>
        </Box>

        {/* Glass Details */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            borderRadius: 1,
            bgcolor: "var(--white-onhover)",
            p: 1,
            flexGrow: 1,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{ color: "var(--off-grey)" }}
          >
            CLIENT INFO
          </Typography>
          <Divider />
          <Typography variant="body2">{eurocode}</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {inStock ? (
              <CheckIcon fontSize="small" color="success" />
            ) : (
              <CrossIcon fontSize="small" color="error" />
            )}

            <Typography
              variant="body2"
              color={inStock ? "success.main" : "error.main"}
            >
              {inStock ? `In Stock, ${warehouseLocation}` : "Out of stock"}
            </Typography>
          </Box>
          <Typography variant="body2">€ {price || 0}</Typography>
        </Box>

        {/* Booking Status */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            borderRadius: 1,
            bgcolor: "var(--white-onhover)",
            p: 1,
            flexGrow: 1,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{ color: "var(--off-grey)" }}
          >
            CLIENT INFO
          </Typography>
          <Divider />
          <Box display="flex" alignItems="center" gap={1}>
            <CircleIcon
              fontSize="small"
              color={isWorkDone ? "success" : "error"}
            />
            <Typography
              variant="body2"
              color={isWorkDone ? "success.main" : "error.main"}
            >
              {isWorkDone ? t("bookingCard.done") : t("bookingCard.notDone")}
            </Typography>
          </Box>
        </Box>

        {/* Company Info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            borderRadius: 1,
            bgcolor: "var(--white-onhover)",
            p: 1,
            flexGrow: 1,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{ color: "var(--off-grey)" }}
          >
            CLIENT INFO
          </Typography>
          <Divider />
          <Typography variant="body2">{companyName || "-"}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default NewBookingCard;
