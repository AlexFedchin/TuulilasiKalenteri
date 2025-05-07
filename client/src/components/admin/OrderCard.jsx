import { Card, Typography, Checkbox, Box } from "@mui/material";
import { insuranceCompanies } from "../../utils/insuranceCompanies";
import dayjs from "dayjs";
import { alert } from "../../utils/alert";
import { useTranslation } from "react-i18next";

const OrderCard = ({
  order,
  selectedOrders,
  setSelectedOrders,
  isRemoving,
  view,
}) => {
  const { t } = useTranslation();

  const getInsuranceCompanyName = () => {
    if (order.insuranceCompany === "other") {
      return order.insuranceCompanyName;
    }
    const company = insuranceCompanies.find(
      (company) => company.value === order.insuranceCompany
    );
    return company ? company.name : t("invoiceCard.unknown");
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectedOrders((prev) => [...prev, order._id]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== order._id));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert.info(t("alert.copiedToClipboard"));
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
          checked={selectedOrders.includes(order._id)}
          onChange={handleCheckboxChange}
        />
      </Box>
      <Typography variant="body2">
        <strong>Client:</strong>{" "}
        {order.clientName === "other" ? order.clientName : order.client}
      </Typography>
      <Typography variant="body2">
        <strong>Products:</strong>{" "}
        {order.products.map((product) => (
          <Typography
            key={product._id}
            component="span"
            onClick={() => copyToClipboard(product.name)}
            sx={copyableTextStyles}
          >
            {product.eurocode}
            {order.products[order.products.length - 1] !== product && ", "}
          </Typography>
        ))}
      </Typography>

      <Typography variant="body2">
        <strong>Notes:</strong> {order.notes}
      </Typography>
    </Card>
  );
};

export default OrderCard;
