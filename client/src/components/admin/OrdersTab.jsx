import React, { useState, useEffect } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Card,
  Pagination,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "../loader/Loader";
import OrderCard from "./OrderCard";
import { useAuth } from "../../context/AuthContext";
import { alert } from "../../utils/alert";
import useScreenSize from "../../hooks/useScreenSize";
import { useTranslation } from "react-i18next";
import OrderModal from "../orders/OrderModal";
import ConfirmModal from "../ConfirmModal";
import { clients } from "../../utils/clients";

const InvoicesTab = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { isMobile } = useScreenSize();
  const [view, setView] = useState("completed");
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingOrders, setRemovingOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders based on the selected view
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setOrders([]);
      try {
        const response = await fetch(
          `/api/orders?completed=${view === "completed"}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || t("alert.unexpectedError"));
        }

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [view, token]);

  const handleView = (event) => {
    setView(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getClientName = () => {
    if (selectedOrder.client === "other") {
      return selectedOrder.clientName;
    }
    const client = clients.find(
      (client) => client.value === selectedOrder.client
    );
    return client ? client.name : t("admin.orders.unknown");
  };

  // Apply search filter to orders
  useEffect(() => {
    const containsSearchTerm = (value, term) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(term);
      } else if (Array.isArray(value)) {
        return value.some((item) => containsSearchTerm(item, term));
      } else if (typeof value === "object" && value !== null) {
        return Object.values(value).some((v) => containsSearchTerm(v, term));
      } else if (typeof value === "number") {
        return value.toString().includes(term);
      }
      return false;
    };

    if (searchTerm) {
      setPage(1);
      const lowerCaseTerm = searchTerm.toLowerCase();
      const processedOrders = orders.filter((order) =>
        containsSearchTerm(order, lowerCaseTerm)
      );
      setFilteredOrders(processedOrders);
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, searchTerm]);

  const ordersPerPage = 5;

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage
  );

  // Function to handle marking invoices as sent or unsent
  const handleChangeStatus = async () => {
    if (submitting) return;
    setSubmitting(true);
    const url = `/api/orders/change-status?completed=${view === "uncompleted"}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orders: selectedOrders }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("alert.unexpectedError"));
      }

      // Add orders to removing state for animation
      setRemovingOrders(selectedOrders);

      // Wait for animation to complete before removing
      setTimeout(() => {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => !selectedOrders.includes(order._id))
        );
        setSelectedOrders([]);
        setRemovingOrders([]);
      }, 300);

      alert.success(
        view === "completed"
          ? t("alert.orderMarkedAsUncompleted")
          : t("alert.orderMarkedAsCompleted")
      );
    } catch (error) {
      alert.error(
        `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
      );
      console.error("Error updating orders:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("alert.unexpectedError"));
      }

      // Remove order from state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== selectedOrder._id)
      );
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
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        maxWidth: "1000px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          p: 1,
          alignItems: "center",
          boxSizing: "content-box",
          position: "sticky",
          top: 16,
          zIndex: 5,
        }}
      >
        <ToggleButtonGroup
          color="primary"
          size="small"
          value={view}
          exclusive
          onChange={handleView}
          sx={{ width: isMobile ? "100%" : "auto" }}
        >
          <ToggleButton value="completed" sx={{ flexGrow: 1 }}>
            {t("admin.orders.completed")}
          </ToggleButton>
          <ToggleButton value="uncompleted" sx={{ flexGrow: 1 }}>
            {t("admin.orders.uncompleted")}
          </ToggleButton>
        </ToggleButtonGroup>

        <TextField
          placeholder={t("admin.orders.searchPlaceholder")}
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: isMobile ? "100%" : "auto" }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "var(--off-grey)" }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end" sx={{ mr: "-12px" }}>
                  <IconButton
                    onClick={() => setSearchTerm("")}
                    sx={{ color: "var(--off-grey)" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          variant="contained"
          loading={submitting}
          loadingPosition="start"
          color={view === "completed" ? "error" : "primary"}
          disabled={selectedOrders.length === 0 || submitting}
          startIcon={view === "completed" ? <CloseIcon /> : <CheckIcon />}
          onClick={handleChangeStatus}
          sx={{
            flexShrink: 0,
            ml: "auto",
            width: isMobile ? "100%" : "auto",
          }}
        >
          {view === "completed"
            ? t("admin.orders.markAsUncompleted")
            : t("admin.orders.markAsCompleted")}
        </Button>
      </Card>

      {loading ? (
        <Loader style={{ marginTop: "20vh" }} />
      ) : (
        <Box
          sx={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            alignItems: "center",
          }}
        >
          {paginatedOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              selectedOrders={selectedOrders}
              setSelectedOrders={setSelectedOrders}
              isRemoving={removingOrders.includes(order._id)}
              onEditClick={handleEditOrder}
              onDeleteClick={handleDeleteClick}
              view={view}
            />
          ))}

          {filteredOrders.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ mt: "20vh", fontStyle: "italic", maxWidth: "66%" }}
            >
              {view === "completed"
                ? t("admin.orders.noCompletedOrders")
                : t("admin.orders.noUncompletedOrders")}
            </Typography>
          ) : (
            <Pagination
              color="primary"
              count={Math.ceil(filteredOrders.length / ordersPerPage)}
              page={page}
              onChange={handlePageChange}
              boundaryCount={1}
              siblingCount={1}
              size={isMobile ? "small" : ""}
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                flexWrap: "nowrap",
                overflow: "hidden",
              }}
            />
          )}
        </Box>
      )}

      {isEditModalOpen && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setIsEditModalOpen(false)}
          setOrders={setOrders}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmModal
          onConfirm={handleDeleteOrder}
          onClose={() => setIsDeleteModalOpen(false)}
          text={t("ordersBlock.confirmDelete", {
            productCount: selectedOrder.products.length,
            client: getClientName(),
          })}
        />
      )}
    </Box>
  );
};

export default InvoicesTab;
