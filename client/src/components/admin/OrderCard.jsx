import {
  Card,
  Typography,
  Checkbox,
  Box,
  Divider,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import { clients } from "../../utils/clients";
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

  const getClientName = () => {
    if (order.client === "other") {
      return order.clientName;
    }
    const client = clients.find((client) => client.value === order.client);
    return client ? client.name : t("invoiceCard.unknown");
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
          ? view === "uncompleted"
            ? "translateX(-100%)"
            : "translateX(100%)"
          : "translateX(0)",
        opacity: isRemoving ? 0 : 1,
      }}
    >
      <Typography variant="h4">{getClientName()}</Typography>
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <Checkbox
          checked={selectedOrders.includes(order._id)}
          onChange={handleCheckboxChange}
        />
      </Box>
      <Divider sx={{ my: 0.5 }} />
      <Typography variant="body2">
        <strong>Products:</strong>
      </Typography>

      <Box sx={{ pl: 1 }}>
        <TableContainer sx={{ color: "var(--off-grey)" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Eurocode</strong>
                </TableCell>
                <TableCell>
                  <strong>Amount</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.eurocode}</TableCell>
                  <TableCell>{product.amount}</TableCell>
                  <TableCell>€{product.price}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        product.status === "inStock"
                          ? "var(--off-black)"
                          : "var(--error)",
                    }}
                  >
                    {product.status === "inStock" ? "In Stock" : "Out of Stock"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Typography variant="body2">
        <strong>Notes:</strong> {order.notes}
      </Typography>
    </Card>
  );
};

export default OrderCard;
