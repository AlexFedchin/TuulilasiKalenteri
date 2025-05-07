import React, { useState, useEffect } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Card,
  Pagination,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../loader/Loader";
import OrderCard from "./OrderCard";
import { useAuth } from "../../context/AuthContext";
import { alert } from "../../utils/alert";
import useScreenSize from "../../hooks/useScreenSize";
import { useTranslation } from "react-i18next";

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

  const handleView = (event) => {
    setView(event.target.value);
    setSelectedOrders([]);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const ordersPerPage = 5;

  const paginatedOrders = orders.slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage
  );

  // Function to handle marking invoices as sent or unsent
  const handleMarkAsCompleted = async () => {
    if (submitting) return;
    setSubmitting(true);
    const url =
      view === "completed"
        ? "/api/orders/mark-as-uncompleted"
        : "/api/orders/mark-as-completed";

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

  // Fetch orders based on the selected view
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
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
      {isMobile ? (
        <Card
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            p: 1,
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "content-box",
            position: "sticky",
            top: 16,
            zIndex: 5,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ToggleButtonGroup
              color="primary"
              size="small"
              value={view}
              exclusive
              onChange={handleView}
              aria-label={t("admin.invoices.view")}
            >
              <ToggleButton value="completed">Completed</ToggleButton>
              <ToggleButton value="uncompleted">Uncompleted</ToggleButton>
            </ToggleButtonGroup>

            <Button
              variant="contained"
              loading={submitting}
              loadingPosition="start"
              color={view === "completed" ? "error" : "primary"}
              disabled={selectedOrders.length === 0 || submitting}
              startIcon={view === "completed" ? <CloseIcon /> : <CheckIcon />}
              onClick={handleMarkAsCompleted}
            >
              Mark as {view === "completed" ? "Uncompleted" : "Completed"}
            </Button>
          </Box>
        </Card>
      ) : (
        <Card
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            p: 1,
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
            position: "sticky",
            top: 16,
            zIndex: 5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <ToggleButtonGroup
              color="primary"
              size="small"
              value={view}
              exclusive
              onChange={handleView}
              aria-label={t("admin.invoices.view")}
            >
              <ToggleButton value="completed">Completed</ToggleButton>
              <ToggleButton value="uncompleted">Uncompleted</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Button
            variant="contained"
            color={view === "completed" ? "error" : "primary"}
            loading={submitting}
            loadingPosition="start"
            disabled={selectedOrders.length === 0 || submitting}
            startIcon={view === "completed" ? <CloseIcon /> : <CheckIcon />}
            onClick={handleMarkAsCompleted}
          >
            Mark as {view === "completed" ? "uncompleted" : "completed"}
          </Button>
        </Card>
      )}

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
              view={view}
            />
          ))}

          {orders.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ mt: "20vh", fontStyle: "italic", maxWidth: "66%" }}
            >
              {view === "completed"
                ? "You don't have any completed invoices"
                : "You don't have any uncompleted invoices"}
            </Typography>
          ) : (
            <Pagination
              color="primary"
              count={Math.ceil(orders.length / ordersPerPage)}
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
    </Box>
  );
};

export default InvoicesTab;
