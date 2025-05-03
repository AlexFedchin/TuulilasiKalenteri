import React, { useEffect, useState } from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/AuthContext";
import useScreenSize from "../../hooks/useScreenSize";
import ConfirmModal from "../ConfirmModal";
import OrderModal from "../OrderModal";
import OrderCard from "./OrderCard";
import { alert } from "../../utils/alert";

const Orders = () => {
  const { user, token } = useAuth();
  const { isMobile, isTablet } = useScreenSize();
  const [orders, setOrders] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetch("/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Failed to fetch orders");
          });
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error.message);
      });
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== selectedOrder._id)
      );
      setOpenDeleteModal(false);
      setSelectedOrder(null);
      alert.success("Order deleted successfully!");
    } catch (error) {
      alert.error(`Error: ${error.message}`);
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
          Add Order
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
            text={`Are you sure you want to delete the order with eurocode <b>${
              selectedOrder.eurocode
            }</b> for <b>${
              selectedOrder.client === "other"
                ? selectedOrder.clientName
                : selectedOrder.client
            }</b>? This action <b>cannot be undone</b>.`}
          />
        )}
      </Box>
    </Card>
  );
};

export default Orders;
