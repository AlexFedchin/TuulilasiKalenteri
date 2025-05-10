import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import BookingBoxTooltip from "./BookingBoxTooltip";
import { useTranslation } from "react-i18next";
import useScreenSize from "../../hooks/useScreenSize";

const BookingBox = ({ booking, onClick, left, width, isDraggable = true }) => {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useScreenSize();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseHovered, setIsMouseHovered] = useState(false);

  const infoRowStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    gap: 0.5,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  const infoTextStyle = {
    overflow: "hidden",
    whiteSpace: "nowrap",
  };

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(booking);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("application/json", JSON.stringify(booking));
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    setIsTooltipOpen(false);
    e.dataTransfer.clearData();
  };

  const handleMouseEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsTooltipOpen(false);
    setIsMouseHovered(true);
    setTimeout(() => {
      setIsTooltipOpen(true);
    }, 500);
  };

  const handleMouseLeave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMouseHovered(false);
    setIsTooltipOpen(false);
  };

  return (
    <BookingBoxTooltip
      booking={booking}
      open={
        isTooltipOpen && !isDragging && isMouseHovered && !isMobile && !isTablet
      }
    >
      <Box
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        draggable={isDraggable && !isMobile && !isTablet}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sx={{
          position: "absolute",
          top: 0,
          left: left,
          width: width,
          height: `${booking.duration * 80 - 8}px`,
          backgroundColor: booking.isWorkDone
            ? "var(--success)"
            : booking.inStock
            ? "var(--primary)"
            : booking.isOrdered
            ? "var(--ordered)"
            : "var(--error)",
          "&:hover": {
            backgroundColor: booking.isWorkDone
              ? "var(--success-onhover)"
              : booking.inStock
              ? "var(--primary-onhover)"
              : booking.isOrdered
              ? "var(--ordered-onhover)"
              : "var(--error-onhover)",
          },
          "&:active": {
            backgroundColor: booking.isWorkDone
              ? "var(--success-onhover)"
              : booking.inStock
              ? "var(--primary-onhover)"
              : booking.isOrdered
              ? "var(--ordered-onhover)"
              : "var(--error-onhover)",
          },
          transition: "background-color 0.2s ease",
          boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
          color: "var(--white)",
          borderRadius: 2,
          boxSizing: "border-box",
          padding: 0.5,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          overflow: "hidden",
          cursor: "pointer",
          zIndex: 10,
          userSelect: "none",
        }}
      >
        <Box sx={infoRowStyle}>
          <Typography variant="bookingBox" color="inherit" sx={infoTextStyle}>
            {booking.plateNumber}
          </Typography>
          <Typography variant="bookingBox" color="inherit" sx={infoTextStyle}>
            {booking.carModel}
          </Typography>
        </Box>
        <Box sx={infoRowStyle}>
          <Typography variant="bookingBox" color="inherit" sx={infoTextStyle}>
            {booking.eurocode}
          </Typography>
          <Typography variant="bookingBox" color="inherit" sx={infoTextStyle}>
            {booking.warehouseLocation}
          </Typography>
        </Box>

        {booking.duration >= 1 && (
          <>
            <Box sx={infoRowStyle}>
              <Typography
                variant="bookingBox"
                color="inherit"
                sx={infoTextStyle}
              >
                {t("bookingBox.phone")} {booking.phoneNumber}
              </Typography>
              {booking?.price > 0 ? (
                <Typography
                  variant="bookingBox"
                  color="inherit"
                  sx={infoTextStyle}
                >
                  €{booking.price}
                </Typography>
              ) : null}
            </Box>

            {booking.insuranceNumber && (
              <Box sx={infoRowStyle}>
                <Typography
                  variant="bookingBox"
                  color="inherit"
                  sx={infoTextStyle}
                >
                  {t("bookingBox.insurance")} {booking.insuranceNumber}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </BookingBoxTooltip>
  );
};

export default BookingBox;
