import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { insuranceCompanies } from "../../utils/insuranceCompanies";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const BookingBoxTooltip = ({ booking, open, children }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isAdmin = user?.role === "admin";

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
    return company ? company.name : t("bookingBoxTooltip.unknown");
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
              <strong>{t("bookingBoxTooltip.car")}:</strong> {booking.carModel}
            </Typography>
            <Typography variant="body2">
              <strong>{t("bookingBoxTooltip.plate")}:</strong>{" "}
              {booking.plateNumber}
            </Typography>
          </Box>

          <Typography variant="body2">
            <strong>{t("bookingBoxTooltip.phoneNumber")}:</strong>{" "}
            {booking.phoneNumber}
          </Typography>

          <Box sx={infoRowStyle}>
            <Typography variant="body2">
              <strong>{t("bookingBoxTooltip.eurocode")}:</strong>{" "}
              {booking.eurocode}
            </Typography>
            <Typography variant="body2">
              <strong>{t("bookingBoxTooltip.price")}:</strong> €{booking.price}
            </Typography>
          </Box>

          <Box sx={infoRowStyle}>
            <Typography variant="body2">
              <strong>{t("bookingBoxTooltip.inStock")}:</strong>{" "}
              {booking.inStock
                ? t("bookingBoxTooltip.yes")
                : t("bookingBoxTooltip.no")}
            </Typography>
            {booking.inStock ? (
              <Typography variant="body2">
                <strong>{t("bookingBoxTooltip.warehouse")}:</strong>{" "}
                {booking.warehouseLocation}
              </Typography>
            ) : (
              <Typography variant="body2">
                <strong>{t("bookingBoxTooltip.ordered")}:</strong>{" "}
                {booking.isOrdered
                  ? t("bookingBoxTooltip.yes")
                  : t("bookingBoxTooltip.no")}
              </Typography>
            )}
          </Box>

          <Typography variant="body2">
            <strong>{t("bookingBoxTooltip.client")}:</strong>{" "}
            {booking.clientType === "private"
              ? t("bookingBoxTooltip.privateClient")
              : t("bookingBoxTooltip.businessClient")}
          </Typography>

          <Typography variant="body2">
            <strong>{t("bookingBoxTooltip.payer")}:</strong>{" "}
            {booking.payerType === "insurance"
              ? t("bookingBoxTooltip.insuranceCompany")
              : booking.payerType === "person"
              ? t("bookingBoxTooltip.person")
              : t("bookingBoxTooltip.business")}
          </Typography>

          {booking.payerType === "insurance" && (
            <>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <strong>{t("bookingBoxTooltip.insuranceCompany")}:</strong>{" "}
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
                <strong>{t("bookingBoxTooltip.insuranceNumber")}:</strong>{" "}
                {booking.insuranceNumber}
              </Typography>
            </>
          )}
          <Typography variant="body2">
            <strong>{t("bookingBoxTooltip.dateAndTime")}:</strong>{" "}
            {dayjs(booking.date).format("DD.MM.YYYY, HH:mm")} -{" "}
            {dayjs(booking.date).add(booking.duration, "hour").format("HH:mm")}
          </Typography>
          {booking.notes && (
            <Typography variant="body2">
              <strong>{t("bookingBoxTooltip.notes")}:</strong>{" "}
              {booking.notes || t("bookingBoxTooltip.na")}
            </Typography>
          )}
          <Typography variant="body2">
            <strong>{t("bookingBoxTooltip.workDone")}:</strong>{" "}
            {booking.isWorkDone
              ? t("bookingBoxTooltip.yes")
              : t("bookingBoxTooltip.no")}
          </Typography>
          {isAdmin && booking.payerType === "insurance" && (
            <Typography variant="body2">
              <strong>{t("bookingBoxTooltip.invoiceSent")}:</strong>{" "}
              {booking.invoiceMade
                ? t("bookingBoxTooltip.yes")
                : t("bookingBoxTooltip.no")}
            </Typography>
          )}
        </Box>
      }
      placement="top"
      arrow
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
      open={open}
    >
      {children}
    </Tooltip>
  );
};

export default BookingBoxTooltip;
