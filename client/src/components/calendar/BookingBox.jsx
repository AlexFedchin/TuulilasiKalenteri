import React from "react";
import { Box, Typography } from "@mui/material";

const BookingBox = ({ booking, onClick, left, width }) => {
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
    // textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation;
        e.preventDefault();
        onClick(booking);
      }}
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
          : "var(--error)",
        "&:hover": {
          backgroundColor: booking.isWorkDone
            ? "var(--success-onhover)"
            : booking.inStock
            ? "var(--primary-onhover)"
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

      <Box sx={infoRowStyle}>
        <Typography variant="bookingBox" color="inherit" sx={infoTextStyle}>
          p. {booking.phoneNumber}
        </Typography>
      </Box>

      {booking.insuranceNumber && (
        <Box sx={infoRowStyle}>
          <Typography variant="bookingBox" color="inherit" sx={infoTextStyle}>
            vak. {booking.insuranceNumber}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BookingBox;
