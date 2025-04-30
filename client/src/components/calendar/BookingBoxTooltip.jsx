import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { insuranceCompanies } from "../../utils/insuranceCompanies";

const BookingBoxTooltip = ({ booking, children }) => {
  const infoRowStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: 2,
  };

  const getInsuranceCompanyName = () => {
    if (booking.insuranceCompany === "other") {
      return booking.insuranceCompanyName;
    }
    const company = insuranceCompanies.find(
      (company) => company.value === booking.insuranceCompany
    );
    return company ? company.name : "Unknown";
  };

  const getInsuranceCompanyLogo = () => {
    if (booking.insuranceCompany === "other") {
      return null;
    }
    const company = insuranceCompanies.find(
      (company) => company.value === booking.insuranceCompany
    );
    return company ? company.logo : null;
  };

  const getDurationText = () => {
    if (booking.duration === 1) {
      return "1 hour";
    } else if (booking.duration > 1 && booking.duration < 24) {
      return `${booking.duration} hours`;
    } else if (booking.duration < 1) {
      return `${booking.duration * 60} minutes`;
    }
    return `${booking.duration} hours`;
  };

  return (
    <Tooltip
      title={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            bgcolor: "white",
            borderRadius: 1,
            maxWidth: "400px",
          }}
        >
          <Box sx={infoRowStyle}>
            <Typography variant="body2">
              <strong>Car:</strong> {booking.carModel}
            </Typography>
            <Typography variant="body2">
              <strong>Plate:</strong> {booking.plateNumber}
            </Typography>
          </Box>

          <Typography variant="body2">
            <strong>Phone Number:</strong> {booking.phoneNumber}
          </Typography>

          <Box sx={infoRowStyle}>
            <Typography variant="body2">
              <strong>Eurocode:</strong> {booking.eurocode}
            </Typography>
            <Typography variant="body2">
              <strong>Price:</strong> €{booking.price}
            </Typography>
          </Box>

          <Box sx={infoRowStyle}>
            <Typography variant="body2">
              <strong>In Stock:</strong> {booking.inStock ? "Yes" : "No"}
            </Typography>
            {booking.inStock ? (
              <Typography variant="body2">
                <strong>Warehouse:</strong> {booking.warehouseLocation}
              </Typography>
            ) : (
              <Typography variant="body2">
                <strong>Ordered:</strong> {booking.isOrdered ? "Yes" : "No"}
              </Typography>
            )}
          </Box>

          <Typography variant="body2">
            <strong>Client:</strong>{" "}
            {booking.clientType === "private"
              ? "Private Client"
              : "Business Client"}
          </Typography>

          <Typography variant="body2">
            <strong>Payer:</strong>{" "}
            {booking.payerType === "insurance"
              ? "Insurance Company"
              : booking.payerType === "person"
              ? "Person"
              : "Business"}
          </Typography>

          {booking.payerType === "insurance" && (
            <>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <strong>Insurance Company:</strong>{" "}
                {getInsuranceCompanyLogo() && (
                  <Box
                    component="img"
                    src={getInsuranceCompanyLogo()}
                    sx={{
                      maxHeight: "20px",
                      maxWidth: "32px",
                      width: "auto",
                    }}
                  />
                )}
                {getInsuranceCompanyName()}
              </Typography>

              <Typography variant="body2">
                <strong>Insurance Number:</strong> {booking.insuranceNumber}
              </Typography>
            </>
          )}
          <Typography variant="body2">
            <strong>Date and Time:</strong>{" "}
            {dayjs(booking.date).format("DD.MM.YYYY, HH:mm")}
          </Typography>
          <Typography variant="body2">
            <strong>Duration:</strong> {getDurationText()}
          </Typography>
          {booking.notes && (
            <Typography variant="body2">
              <strong>Notes:</strong> {booking.notes || "N/A"}
            </Typography>
          )}
          <Typography variant="body2">
            <strong>Invoice Made:</strong> {booking.invoiceMade ? "Yes" : "No"}
          </Typography>
        </Box>
      }
      placement="top"
      arrow
      enterDelay={500}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: "var(--white)",
            color: "var(--off-black)",
            fontFamily: "Montserrat",
            maxWidth: "400px",
            padding: 2,
            borderRadius: 2,
            boxShadow: "0 0 16px rgba(0, 0, 0, 0.1)",
          },
        },
        arrow: {
          sx: {
            color: "var(--white)",
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default BookingBoxTooltip;
