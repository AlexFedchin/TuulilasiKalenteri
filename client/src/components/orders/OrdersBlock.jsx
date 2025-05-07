import React, { useEffect, useState } from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/AuthContext";
import useScreenSize from "../../hooks/useScreenSize";
import ConfirmModal from "../ConfirmModal";
import OrderModal from "./OrderModal";
import OrderCard from "./OrderCard";
import { alert } from "../../utils/alert";
import { clients } from "../../utils/clients";
import { useTranslation } from "react-i18next";
import Loader from "../loader/Loader";

const Orders = () => {
  const { user, token } = useAuth();
  const { isMobile, isTablet } = useScreenSize();
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  // Fetch uncompleted orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/orders?completed=false", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || t("alert.unexpectedError"));
        }

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert.error(
          `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  const handleCreateClick = () => {
    setSelectedOrder(null);
    setOpenEditModal(true);
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setOpenDeleteModal(true);
  };

  const handleCompletedClick = async (order) => {
    setCompleting(true);

    try {
      const response = await fetch(`/api/orders/change-status?completed=true`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orders: [order._id] }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("alert.unexpectedError"));
      }

      setOrders((prevOrders) => prevOrders.filter((o) => o._id !== order._id));
      alert.success(t("alert.orderMarkedAsCompleted"));
    } catch (error) {
      alert.error(
        `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
      );
      console.error("Error completing order:", error);
    } finally {
      setCompleting(false);
    }
  };

  const getClientName = () => {
    if (selectedOrder.client === "other") {
      return selectedOrder.clientName;
    } else {
      const client = clients.find(
        (client) => client.value === selectedOrder.client
      );
      return client ? client.name : selectedOrder.client;
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("alert.unexpectedError"));
      }

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== selectedOrder._id)
      );
      setOpenDeleteModal(false);
      setSelectedOrder(null);
      alert.success(t("alert.orderDeleteSuccess"));
    } catch (error) {
      alert.error(
        `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
      );
      console.error("Error deleting order:", error);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        boxSizing: "border-box",
        maxHeight: "100%",
        width: "100%",
        p: 1,
      }}
    >
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Tukku
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "grid",
            boxShadow: "inset 0 0 8px rgba(0, 0, 0, 0.1)",
            bgcolor: "var(--off-white)",
            borderRadius: 1,
            placeItems: "center",
            height: "100%",
            width: "100%",
            minHeight: "616.13px",
          }}
        >
          <Loader />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxHeight: "100%",
            height: "100%",
            bgcolor: "var(--off-white)",
            borderRadius: 1,
            boxSizing: "border-box",
            p: 1,
            gap: 1,
            boxShadow: "inset 0 0 8px rgba(0, 0, 0, 0.1)",
            overflowY: "auto",
          }}
        >
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              onCompletedClick={handleCompletedClick}
              completing={completing}
            />
          ))}

          <Button
            startIcon={<AddIcon fontSize="small" />}
            onClick={handleCreateClick}
            sx={{
              borderRadius: 0.5,
              py: 0.5,
              px: 1,
              bgcolor: "var(--white)",
              color: "var(--off-black)",
              width: "100%",
              fontSize: isMobile ? "0.8rem" : isTablet ? "0.85rem" : "0.9rem",
              textTransform: "none",
              "&:hover": { bgcolor: "var(--white-onhover)" },
            }}
          >
            {t("ordersBlock.addOrder")}
          </Button>

          {openEditModal && (
            <OrderModal
              onClose={() => setOpenEditModal(false)}
              order={selectedOrder}
              setOrders={setOrders}
            />
          )}

          {openDeleteModal && (
            <ConfirmModal
              onConfirm={handleDelete}
              onClose={() => setOpenDeleteModal(false)}
              text={t("ordersBlock.confirmDelete", {
                productCount: selectedOrder.products.length,
                client: getClientName(),
              })}
            />
          )}
        </Box>
      )}
    </Card>
  );
};

export default Orders;
