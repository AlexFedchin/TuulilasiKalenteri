import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Box,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DefaultContainer from "../components/DefaultContainer";
import Loader from "../components/loader/Loader";
import { useAuth } from "../context/AuthContext";
import { alert } from "../utils/alert";
import BookingCard from "../components/bookings/BookingCard";
import BookingModal from "../components/bookings/BookingModal";
import ConfirmModal from "../components/ConfirmModal";
import dayjs from "dayjs";
import useScreenSize from "../hooks/useScreenSize";
import { useTranslation } from "react-i18next";

const Bookings = () => {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const { isMobile } = useScreenSize();
  const [bookings, setBookings] = useState([]);
  const [processedBookings, setProcessedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const bookingsPerPage = 5;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [view, setView] = useState("all");

  // Fetch bookings from the API on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const url =
          view === "all" ? "/api/bookings" : `/api/bookings?userId=${user.id}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || t("alert.unexpectedError"));
        }

        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        alert.error(
          `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, user, view]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(1);
  };

  const handleViewChange = (event) => {
    setView(event.target.value);
    setPage(1);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setPage(1);
  };

  const handleEditClick = (booking) => {
    setSelectedBooking(booking);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (booking) => {
    setSelectedBooking(booking);
    setOpenDeleteModal(true);
  };

  const handleCreateClick = () => {
    setSelectedBooking(null);
    setOpenEditModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/bookings/${selectedBooking._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("alert.unexpectedError"));
      }

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== selectedBooking._id)
      );
      alert.success(t("alert.bookingDeleteSuccess"));
    } catch (error) {
      alert.error(
        `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
      );
      console.error("Error deleting booking:", error);
    } finally {
      setOpenDeleteModal(false);
    }
  };

  // Filter, sort, and search bookings
  useEffect(() => {
    const processBookings = () => {
      let processedBookings = [...bookings];

      // Apply filter
      if (filter === "past") {
        processedBookings = processedBookings.filter(
          (booking) => new Date(booking.date) < new Date()
        );
      } else if (filter === "upcoming") {
        processedBookings = processedBookings.filter(
          (booking) => new Date(booking.date) >= new Date()
        );
      }

      // Apply search
      if (searchTerm) {
        const lowerCaseTerm = searchTerm.toLowerCase();
        processedBookings = processedBookings.filter((booking) =>
          Object.values(booking).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(lowerCaseTerm)
          )
        );
      }

      // Apply sorting
      processedBookings.sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.date) - new Date(a.date);
        } else {
          return new Date(a.date) - new Date(b.date);
        }
      });

      setProcessedBookings(processedBookings);
    };

    processBookings();
  }, [filter, searchTerm, sortOrder, bookings]);

  const paginatedBookings = processedBookings.slice(
    (page - 1) * bookingsPerPage,
    page * bookingsPerPage
  );

  return (
    <DefaultContainer>
      <Typography variant="h2">{t("bookingsPage.title")}</Typography>
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          maxWidth: "1000px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
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
            justifyContent: "space-between",
            boxSizing: isMobile ? "content-box" : "border-box",
            position: "sticky",
            top: 16,
            zIndex: 5,
          }}
        >
          <Box
            sx={{
              width: isMobile ? "100%" : "fit-content",
              display: "flex",
              gap: 1,
            }}
          >
            <TextField
              placeholder={t("bookingsPage.searchPlaceholder")}
              variant="outlined"
              size="small"
              sx={{
                flexGrow: 1,
                maxWidth: "unset",
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            {user.role === "admin" && (
              <ToggleButtonGroup
                value={view}
                size="small"
                exclusive
                onChange={handleViewChange}
                sx={{ flexGrow: 1, maxWidth: "150px", minWidth: "100px" }}
              >
                <ToggleButton
                  value="all"
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  {t("bookingsPage.view.all")}
                </ToggleButton>
                <ToggleButton
                  value="my"
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  {t("bookingsPage.view.my")}
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>
          <Box
            sx={{ width: isMobile ? "100%" : "unset", display: "flex", gap: 1 }}
          >
            <Select
              value={filter}
              onChange={handleFilterChange}
              size="small"
              sx={{ minWidth: isMobile ? 100 : 120, flexGrow: 1 }}
            >
              <MenuItem value="all">{t("bookingsPage.filter.all")}</MenuItem>
              <MenuItem value="past">{t("bookingsPage.filter.past")}</MenuItem>
              <MenuItem value="upcoming">
                {t("bookingsPage.filter.upcoming")}
              </MenuItem>
            </Select>

            <Select
              value={sortOrder}
              onChange={handleSortOrderChange}
              size="small"
              sx={{ minWidth: isMobile ? 120 : 150, flexGrow: 1 }}
            >
              <MenuItem value="newest">
                {t("bookingsPage.sort.newest")}
              </MenuItem>
              <MenuItem value="oldest">
                {t("bookingsPage.sort.oldest")}
              </MenuItem>
            </Select>
            <Button
              variant="submit"
              onClick={handleCreateClick}
              size="small"
              sx={{ minWidth: 40, maxWidth: isMobile ? 40 : "unset" }}
              startIcon={isMobile ? undefined : <AddIcon />}
            >
              {isMobile ? <AddIcon /> : t("bookingsPage.createBooking")}
            </Button>
          </Box>
        </Card>

        {loading ? (
          <Loader style={{ marginTop: "29vh" }} />
        ) : processedBookings.length > 0 ? (
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
            {paginatedBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            ))}

            {processedBookings.length > bookingsPerPage && (
              <Pagination
                color="primary"
                count={Math.ceil(processedBookings.length / bookingsPerPage)}
                page={page}
                onChange={(_, value) => setPage(value)}
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
        ) : (
          <Typography variant="body2" sx={{ fontStyle: "italic", mt: "29vh" }}>
            {t("bookingsPage.noBookings")}
          </Typography>
        )}

        {openEditModal && (
          <BookingModal
            open={true}
            booking={selectedBooking}
            onClose={() => setOpenEditModal(false)}
            setBookings={setBookings}
          />
        )}

        {openDeleteModal && (
          <ConfirmModal
            open={true}
            onClose={() => setOpenDeleteModal(false)}
            text={t("bookingsPage.confirmDelete", {
              carModel: selectedBooking?.carModel,
              plateNumber: selectedBooking?.plateNumber,
              date: dayjs(selectedBooking.date).format("DD.MM.YYYY"),
              startTime: dayjs(selectedBooking.date).format("HH:mm"),
              endTime: dayjs(selectedBooking.date)
                .add(selectedBooking.duration, "hour")
                .format("HH:mm"),
            })}
            onConfirm={handleDelete}
          />
        )}
      </Box>
    </DefaultContainer>
  );
};

export default Bookings;
