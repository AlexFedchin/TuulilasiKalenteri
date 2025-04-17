import React from "react";
import { Box, Typography } from "@mui/material";

const BookingBox = ({ booking, onClick, left, width }) => {
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
        height: `${booking.duration * 72}px`,
        backgroundColor: "rgb(83, 175, 228)",
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
        color: "var(--white)",
        borderRadius: 2,
        boxSizing: "border-box",
        padding: 0.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        cursor: "pointer",
        zIndex: 10,
      }}
    >
      <Typography variant="card" color="inherit">
        {booking.carMake} {booking.carModel}
      </Typography>
      <Typography variant="card" color="inherit">
        {booking.plateNumber}
      </Typography>
      <Typography variant="card" color="inherit">
        {booking.insuranceNumber}
      </Typography>
    </Box>
  );
};

export default BookingBox;
