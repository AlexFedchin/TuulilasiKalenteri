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
import InvoiceCard from "./InvoiceCard";
import { useAuth } from "../../context/AuthContext";
import { alert } from "../../utils/alert";
import useScreenSize from "../../hooks/useScreenSize";
import { useTranslation } from "react-i18next";

const InvoicesTab = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { isMobile } = useScreenSize();
  const [view, setView] = useState("notSent");
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingBookings, setRemovingBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [submitting, setSubmitting] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const bookingsPerPage = 5;

  const handleView = (event) => {
    setView(event.target.value);
    setSelectedBookings([]);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(1);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Function to handle marking invoices as sent or unsent
  const handleMarkAsSent = async () => {
    if (submitting) return;
    setSubmitting(true);
    const url = `/api/invoices/change-invoice-status?invoiceMade=${
      view === "notSent"
    }`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookings: selectedBookings }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("alert.unexpectedError"));
      }

      // Add bookings to removing state for animation
      setRemovingBookings(selectedBookings);

      // Wait for animation to complete before removing
      setTimeout(() => {
        setBookings((prevBookings) =>
          prevBookings.filter(
            (booking) => !selectedBookings.includes(booking._id)
          )
        );
        setSelectedBookings([]);
        setRemovingBookings([]);
      }, 300);

      alert.success(t("alert.invoiceStatusUpdateSuccess"));
    } catch (error) {
      alert.error(
        `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
      );
      console.error("Error updating bookings:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch invoices based on the selected view
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          invoiceMade: view === "sent",
          page,
          limit: bookingsPerPage,
          filter,
          sortOrder,
        });

        const response = await fetch(
          `/api/invoices/invoices-page?${params.toString()}`,
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
          console.error("Error fetching bookings:", data.error);
        } else {
          setBookings(data.bookings);
          setTotalPages(Math.ceil(data.total / bookingsPerPage));
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [view, token, page, filter, sortOrder]);

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
              <ToggleButton value="sent">
                {t("admin.invoices.sent")}
              </ToggleButton>
              <ToggleButton value="notSent">
                {t("admin.invoices.notSent")}
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              loading={submitting}
              loadingPosition="start"
              color={view === "sent" ? "error" : "primary"}
              disabled={selectedBookings.length === 0 || submitting}
              startIcon={view === "sent" ? <CloseIcon /> : <CheckIcon />}
              onClick={handleMarkAsSent}
            >
              {t(`admin.invoices.markAs${view === "sent" ? "Unsent" : "Sent"}`)}
            </Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Select
              value={filter}
              onChange={handleFilterChange}
              size="small"
              sx={{ minWidth: 120, flexGrow: 1 }}
            >
              <MenuItem value="all">{t("admin.invoices.filter.all")}</MenuItem>
              <MenuItem value="past">
                {t("admin.invoices.filter.past")}
              </MenuItem>
              <MenuItem value="upcoming">
                {t("admin.invoices.filter.upcoming")}
              </MenuItem>
            </Select>

            <Select
              value={sortOrder}
              onChange={handleSortOrderChange}
              size="small"
              sx={{ minWidth: 150, flexGrow: 1 }}
            >
              <MenuItem value="newest">
                {t("admin.invoices.sort.newest")}
              </MenuItem>
              <MenuItem value="oldest">
                {t("admin.invoices.sort.oldest")}
              </MenuItem>
            </Select>
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
              <ToggleButton value="sent">
                {t("admin.invoices.sent")}
              </ToggleButton>
              <ToggleButton value="notSent">
                {t("admin.invoices.notSent")}
              </ToggleButton>
            </ToggleButtonGroup>
            <Select
              value={filter}
              onChange={handleFilterChange}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">{t("admin.invoices.filter.all")}</MenuItem>
              <MenuItem value="past">
                {t("admin.invoices.filter.past")}
              </MenuItem>
              <MenuItem value="upcoming">
                {t("admin.invoices.filter.upcoming")}
              </MenuItem>
            </Select>

            <Select
              value={sortOrder}
              onChange={handleSortOrderChange}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="newest">
                {t("admin.invoices.sort.newest")}
              </MenuItem>
              <MenuItem value="oldest">
                {t("admin.invoices.sort.oldest")}
              </MenuItem>
            </Select>
          </Box>

          <Button
            variant="contained"
            color={view === "sent" ? "error" : "primary"}
            loading={submitting}
            loadingPosition="start"
            disabled={selectedBookings.length === 0 || submitting}
            startIcon={view === "sent" ? <CloseIcon /> : <CheckIcon />}
            onClick={handleMarkAsSent}
          >
            {t(`admin.invoices.markAs${view === "sent" ? "Unsent" : "Sent"}`)}
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
          {bookings.map((booking) => (
            <InvoiceCard
              key={booking._id}
              booking={booking}
              selectedBookings={selectedBookings}
              setSelectedBookings={setSelectedBookings}
              isRemoving={removingBookings.includes(booking._id)}
              view={view}
            />
          ))}

          {bookings.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ mt: "20vh", fontStyle: "italic", maxWidth: "66%" }}
            >
              {view === "sent"
                ? t("admin.invoices.noSentInvoices")
                : t("admin.invoices.noUnsentInvoices")}
            </Typography>
          ) : totalPages > 1 ? (
            <Pagination
              color="primary"
              count={totalPages}
              defaultPage={1}
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
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default InvoicesTab;
