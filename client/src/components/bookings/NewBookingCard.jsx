import React, { useState, useEffect } from "react";
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
import WaitIcon from "@mui/icons-material/HourglassBottom";
import CircleIcon from "@mui/icons-material/Circle";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import { insuranceCompanies } from "../../utils/insuranceCompanies";
import { useAuth } from "../../context/AuthContext";
import useScreenSize from "../../hooks/useScreenSize";
dayjs.extend(updateLocale);
import "dayjs/locale/en";
import "dayjs/locale/fi";
import "dayjs/locale/ru";
import { useTranslation } from "react-i18next";

const NewBookingCard = ({ booking, onEditClick, onDeleteClick }) => {
  const {
    date,
    plateNumber,
    phoneNumber,
    carModel,
    deductible,
    payerType,
    insuranceCompany,
    insuranceCompanyName,
    insuranceNumber,
    duration,
    inStock,
    eurocode,
    warehouseLocation,
    isOrdered,
    price,
    creatorName,
    isWorkDone,
    notes,
  } = booking;

  const { isMobile } = useScreenSize();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  dayjs.locale(i18n.language);
  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatTimeRange = () => {
    const start = dayjs(date);
    const end = start.add(duration, "hour");
    return `${start.format("D MMMM YYYY, HH:mm")} – ${end.format("HH:mm")}`;
  };

  const getInsuranceCompanyName = () => {
    if (insuranceCompany === "other") {
      return insuranceCompanyName;
    }
    const company = insuranceCompanies.find(
      (company) => company.value === insuranceCompany
    );
    return company ? company.name : t("bookingCard.unknown");
  };

  const getInsuranceCompanyLogo = () => {
    if (insuranceCompany === "other") {
      return null;
    }
    const company = insuranceCompanies.find(
      (company) => company.value === insuranceCompany
    );
    return company ? company.logo : null;
  };

  const cardSectionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 0.5,
    borderRadius: 1,
    bgcolor: "var(--white-onhover)",
    p: 1,
    flexGrow: 1,
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
      <Typography variant="body1" sx={{ fontWeight: 700, ml: 1 }}>
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
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "repeat(1, 1fr)" : "repeat(2, 1fr)"}
        gap={2}
      >
        {/* Car Info */}
        <Box sx={cardSectionStyle}>
          <Typography
            variant="card"
            fontWeight={700}
            sx={{ color: "var(--off-grey)" }}
          >
            {t("bookingCard.client")}
          </Typography>
          <Divider />
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "var(--off-black)" }}
          >
            {carModel}
          </Typography>
          <Typography variant="body2">{plateNumber}</Typography>
          <Typography variant="body2">{phoneNumber}</Typography>
        </Box>

        {/* Glass Details */}
        <Box
          sx={{
            ...cardSectionStyle,
            bgcolor: inStock
              ? "var(--success-bg)"
              : isOrdered
              ? "var(--ordered-bg)"
              : "var(--error-bg)",
          }}
        >
          <Typography
            variant="card"
            fontWeight={700}
            sx={{ color: "var(--off-grey)" }}
          >
            {t("bookingCard.glass")}
          </Typography>
          <Divider />
          <Typography variant="body2">{eurocode}</Typography>

          <Typography variant="body2">€ {price || 0}</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0.5,
              color: inStock
                ? "var(--success)"
                : isOrdered
                ? "var(--ordered)"
                : "var(--error)",
            }}
          >
            {inStock ? (
              <CheckIcon fontSize="small" sx={{ mb: "2px" }} />
            ) : isOrdered ? (
              <WaitIcon fontSize="small" sx={{ mb: "2px" }} />
            ) : (
              <CrossIcon fontSize="small" sx={{ mb: "2px" }} />
            )}

            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: "inherit" }}
            >
              {inStock
                ? t("bookingCard.inStock", { location: warehouseLocation })
                : isOrdered
                ? t("bookingCard.outOfStockOrdered")
                : t("bookingCard.outOfStockNotOrdered")}
            </Typography>
          </Box>
        </Box>

        {/* Insurance and Notes */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Insurance Details */}
          <Box sx={cardSectionStyle}>
            <Typography
              variant="card"
              fontWeight={700}
              sx={{ color: "var(--off-grey)" }}
            >
              {t("bookingCard.insurance")}
            </Typography>
            <Divider />
            {payerType === "insurance" ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Box
                    component="img"
                    src={getInsuranceCompanyLogo()}
                    sx={{ height: 20, width: "auto", mb: "2px" }}
                  />

                  <Typography variant="body2">
                    {getInsuranceCompanyName()}
                  </Typography>
                </Box>
                <Typography variant="body2">{insuranceNumber}</Typography>
                <Typography variant="body2">
                  € {deductible} {t("bookingCard.deductible")}
                </Typography>
              </>
            ) : (
              <Typography variant="body2">-</Typography>
            )}
          </Box>
          {/* Notes */}
          {notes && isAdmin && (
            <Box
              sx={{
                ...cardSectionStyle,
                gridColumn: "span 2",
              }}
            >
              <Typography
                variant="card"
                fontWeight={700}
                sx={{ color: "var(--off-grey)" }}
              >
                {t("bookingCard.notes")}
              </Typography>
              <Divider />
              <Typography variant="body2">{notes}</Typography>
            </Box>
          )}
        </Box>

        {/* Booking Status and Creator */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Booking Status */}
          <Box
            sx={{
              ...cardSectionStyle,
              bgcolor: isWorkDone ? "var(--success-bg)" : "var(--error-bg)",
            }}
          >
            <Typography
              variant="card"
              fontWeight={700}
              sx={{ color: "var(--off-grey)" }}
            >
              {t("bookingCard.status")}
            </Typography>
            <Divider />
            <Box display="flex" alignItems="center" gap={1}>
              <CircleIcon
                color={isWorkDone ? "success" : "error"}
                sx={{ fontSize: 16, mb: "2px" }}
              />
              <Typography
                variant="body2"
                fontWeight={600}
                color={isWorkDone ? "success.main" : "error.main"}
              >
                {isWorkDone ? t("bookingCard.done") : t("bookingCard.notDone")}
              </Typography>
            </Box>
          </Box>
          {/* Creator*/}
          {isAdmin && (
            <Box sx={cardSectionStyle}>
              <Typography
                variant="card"
                fontWeight={700}
                sx={{ color: "var(--off-grey)" }}
              >
                {t("bookingCard.creator")}
              </Typography>
              <Divider />
              <Typography variant="body2">
                {!creatorName || creatorName === "Unknown"
                  ? t("bookingCard.unknown")
                  : creatorName}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Notes */}
        {notes && !isAdmin && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              borderRadius: 1,
              bgcolor: "var(--white-onhover)",
              p: 1,
              flexGrow: 1,
              gridColumn: "span 2",
            }}
          >
            <Typography
              variant="card"
              fontWeight={700}
              sx={{ color: "var(--off-grey)" }}
            >
              {t("bookingCard.notes")}
            </Typography>
            <Divider />
            <Typography variant="body2">{notes}</Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default NewBookingCard;
