import { Card, Typography, Checkbox, Box } from "@mui/material";
import { insuranceCompanies } from "../../utils/insuranceCompanies";
import dayjs from "dayjs";
import { alert } from "../../utils/alert";

const BookingCard = ({
  booking,
  selectedBookings,
  setSelectedBookings,
  isRemoving,
  view,
}) => {
  const getInsuranceCompanyName = () => {
    if (booking.insuranceCompany === "other") {
      return booking.insuranceCompanyName;
    }
    const company = insuranceCompanies.find(
      (company) => company.value === booking.insuranceCompany
    );
    return company ? company.name : "Unknown";
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectedBookings((prev) => [...prev, booking._id]);
    } else {
      setSelectedBookings((prev) => prev.filter((id) => id !== booking._id));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert.info("Copied to clipboard");
    });
  };

  const copyableTextStyles = {
    cursor: "pointer",
    "&:hover": {
      color: "var(--primary-onhover)",
      textDecoration: "underline",
    },
  };

  return (
    <Card
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        p: 2,
        color: "var(--off-black)",
        position: "relative",
        transition: "transform 0.3s ease, opacity 0.3s ease-in-out",
        transform: isRemoving
          ? view === "notSent"
            ? "translateX(-100%)"
            : "translateX(100%)"
          : "translateX(0)",
        opacity: isRemoving ? 0 : 1,
      }}
    >
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <Checkbox
          checked={selectedBookings.includes(booking._id)}
          onChange={handleCheckboxChange}
        />
      </Box>
      <Typography variant="body2">
        <strong>Insurance Company:</strong>{" "}
        <Typography
          component="span"
          onClick={() => copyToClipboard(getInsuranceCompanyName())}
          sx={copyableTextStyles}
        >
          {getInsuranceCompanyName()}
        </Typography>
      </Typography>
      {booking.companyName && (
        <Typography variant="body2">
          <strong>Company:</strong>{" "}
          <Typography
            component="span"
            onClick={() => copyToClipboard(booking.companyName)}
            sx={copyableTextStyles}
          >
            {booking.companyName}
          </Typography>
        </Typography>
      )}
      <Typography variant="body2">
        <strong>Plate Number:</strong>{" "}
        <Typography
          component="span"
          onClick={() => copyToClipboard(booking.plateNumber)}
          sx={copyableTextStyles}
        >
          {booking.plateNumber}
        </Typography>
      </Typography>
      <Typography variant="body2">
        <strong>Car Model:</strong>{" "}
        <Typography
          component="span"
          onClick={() => copyToClipboard(booking.carModel)}
          sx={copyableTextStyles}
        >
          {booking.carModel}
        </Typography>
      </Typography>
      <Typography variant="body2">
        <strong>Insurance Number:</strong>{" "}
        <Typography
          component="span"
          onClick={() => copyToClipboard(booking.insuranceNumber)}
          sx={copyableTextStyles}
        >
          {booking.insuranceNumber}
        </Typography>
      </Typography>
      <Typography variant="body2">
        <strong>Deductible:</strong> <Typography component="span">€</Typography>{" "}
        <Typography
          component="span"
          onClick={() => copyToClipboard(booking.deductible || 0)}
          sx={copyableTextStyles}
        >
          {booking.deductible || 0}
        </Typography>
      </Typography>
      <Typography variant="body2">
        <strong>Price:</strong> <Typography component="span">€</Typography>{" "}
        <Typography
          component="span"
          onClick={() => copyToClipboard(booking.price || 0)}
          sx={copyableTextStyles}
        >
          {booking.price || 0}
        </Typography>
      </Typography>
      <Typography variant="body2">
        <strong>Service Date:</strong>{" "}
        <Typography
          component="span"
          onClick={() =>
            copyToClipboard(dayjs(booking.date).format("DD.MM.YYYY"))
          }
          sx={copyableTextStyles}
        >
          {dayjs(booking.date).format("DD.MM.YYYY")}
        </Typography>
      </Typography>
      <Box sx={{ position: "absolute", bottom: 16, right: 16 }}>
        <Typography variant="body2" fontWeight="bold" textAlign="right">
          {booking.locationTitle || (
            <Typography component="span" fontStyle="italic">
              Unknown
            </Typography>
          )}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
            color: booking.invoiceMade ? "var(--success)" : "var(--error)",
          }}
        >
          {booking.invoiceMade ? "Invoice sent" : "Invoice not sent"}
        </Typography>
      </Box>
    </Card>
  );
};

export default BookingCard;
