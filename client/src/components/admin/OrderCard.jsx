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
    return client ? client.name : t("admin.orders.unknown");
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectedOrders((prev) => [...prev, order._id]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== order._id));
    }
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
        transition: "transform 0.3s ease, opacity 0.3s ease-in-out",
        transform: isRemoving
          ? view === "uncompleted"
            ? "translateX(-100%)"
            : "translateX(100%)"
          : "translateX(0)",
        opacity: isRemoving ? 0 : 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: 16,
            height: 16,
            mt: "2px",
            borderRadius: "50%",
            bgcolor: `var(--order-card-${order.client})`,
            border: "1px solid var(--light-grey)",
          }}
        />
        <Typography variant="h4">{getClientName()}</Typography>
        <Box sx={{ position: "absolute", right: 0 }}>
          <Checkbox
            checked={selectedOrders.includes(order._id)}
            onChange={handleCheckboxChange}
          />
        </Box>
      </Box>
      <Divider sx={{ my: 0.5 }} />
      <Typography variant="body2">
        <strong>{t("admin.orders.products")}:</strong>
      </Typography>

      <Box sx={{ pl: 1 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "var(--off-grey)" }}>
                  <Typography variant="body2" fontWeight="bold">
                    {t("admin.orders.eurocode")}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ color: "var(--off-grey)" }}>
                  <Typography variant="body2" fontWeight="bold">
                    {t("admin.orders.amount")}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ color: "var(--off-grey)" }}>
                  <Typography variant="body2" fontWeight="bold">
                    {t("admin.orders.price")}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: "var(--off-grey)" }}>
                  <Typography variant="body2" fontWeight="bold">
                    {t("admin.orders.status")}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.products.map((product) => (
                <TableRow
                  key={product._id}
                  sx={{
                    color:
                      product.status === "inStock"
                        ? "var(--off-black)"
                        : "var(--error)",
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "var(--white-onhover)",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      color: "inherit",
                    }}
                  >
                    {product.eurocode}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "inherit" }}>
                    {product.amount}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "inherit" }}>
                    €{product.price}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "inherit" }}>
                    {product.status === "inStock"
                      ? t("admin.orders.inStock")
                      : t("admin.orders.order")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {order.notes && (
        <Typography variant="body2">
          <strong>{t("admin.orders.notes")}:</strong> {order.notes}
        </Typography>
      )}
    </Card>
  );
};

export default OrderCard;
