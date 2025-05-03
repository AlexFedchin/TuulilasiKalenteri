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
import BookingModal from "../components/BookingModal";
import ConfirmModal from "../components/ConfirmModal";
import dayjs from "dayjs";
import useScreenSize from "../hooks/useScreenSize";

const Bookings = () => {
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

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
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

  const handleViewChange = (event, newView) => {
    setView(newView);
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

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== selectedBooking._id)
      );
      alert.success("Booking deleted successfully!");
    } catch (error) {
      alert.error(`Error: ${error.message}`);
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
      <Typography variant="h2">Bookings</Typography>
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
            boxSizing: "border-box",
            position: "sticky",
            top: 16,
            zIndex: 5,
          }}
        >
          <Box
            sx={{ width: isMobile ? "100%" : "unset", display: "flex", gap: 1 }}
          >
            <TextField
              placeholder="Search for bookings..."
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1, maxWidth: "unset" }}
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
                  All
                </ToggleButton>
                <ToggleButton
                  value="my"
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  My
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
              sx={{ minWidth: 120, flexGrow: 1 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="past">Past</MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
            </Select>

            <Select
              value={sortOrder}
              onChange={handleSortOrderChange}
              size="small"
              sx={{ minWidth: 150, flexGrow: 1 }}
            >
              <MenuItem value="newest">Newest first</MenuItem>
              <MenuItem value="oldest">Oldest first</MenuItem>
            </Select>
            <Button
              variant="submit"
              onClick={handleCreateClick}
              size="small"
              startIcon={isMobile ? undefined : <AddIcon />}
            >
              {isMobile ? <AddIcon /> : "Create Booking"}
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
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ fontStyle: "italic", mt: "29vh" }}>
            No bookings found
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
            text={`Are you sure you want to delete the booking for <strong>${
              selectedBooking?.carModel
            } ${selectedBooking?.plateNumber}</strong> on <strong>${dayjs(
              selectedBooking.date
            ).format("DD.MM.YYYY")}</strong> at <strong>${dayjs(
              selectedBooking.date
            ).format("HH:mm")} - ${dayjs(selectedBooking.date)
              .add(selectedBooking.duration, "hour")
              .format(
                "HH:mm"
              )}</strong>? This action <strong>cannot be undone</strong>.`}
            onConfirm={handleDelete}
          />
        )}
      </Box>
    </DefaultContainer>
  );
};

export default Bookings;
