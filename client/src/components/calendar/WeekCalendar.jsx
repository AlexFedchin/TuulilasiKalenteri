import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNew";
import dayjs from "dayjs";
import useScreenSize from "../../hooks/useScreenSize";
import BookingBox from "./BookingBox";
import Loader from "../loader/Loader";
import BookingModal from "../BookingModal";
import { useAuth } from "../../context/AuthContext";

const WeekCalendar = ({
  currentDate,
  location = null,
  setMode,
  searchTerm,
}) => {
  const { user, token } = useAuth();
  const { isMobile, isTablet } = useScreenSize();

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const fetchedDates = useRef([]);
  useEffect(() => {
    fetchedDates.current = [];
  }, []);

  // Fetch bookings on component mount
  useEffect(() => {
    if (fetchedDates.current.includes(currentDate.format("YYYY-MM-DD"))) return;

    const fetchBookings = async () => {
      setLoading(true);

      try {
        const startOfWeek = currentDate.startOf("isoWeek").format("YYYY-MM-DD");
        const endOfWeek = currentDate.endOf("isoWeek").format("YYYY-MM-DD");
        const url =
          isAdmin && location
            ? `/api/bookings?location=${location._id}&startDate=${startOfWeek}&endDate=${endOfWeek}`
            : `/api/bookings?startDate=${startOfWeek}&endDate=${endOfWeek}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        setBookings((prev) => {
          const existingIds = new Set(prev.map((booking) => booking._id));
          const newBookings = data.filter(
            (booking) => !existingIds.has(booking._id)
          );
          return [...prev, ...newBookings];
        });

        fetchedDates.current.push(currentDate.format("YYYY-MM-DD"));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, token, currentDate, isAdmin, location]);

  // Debounced search function
  const debounceSearch = useCallback(
    (term) => {
      setLoading(true);
      setTimeout(() => {
        const lowerCaseTerm = term.toLowerCase();
        const filtered = bookings.filter((booking) =>
          Object.values(booking).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(lowerCaseTerm)
          )
        );
        setFilteredBookings(filtered);
        setLoading(false);
      }, 500);
    },
    [bookings]
  );

  useEffect(() => {
    if (!searchTerm) {
      setFilteredBookings(bookings);
      return;
    }
    debounceSearch(searchTerm);
  }, [searchTerm, bookings, debounceSearch]);

  const generateDayColumns = () => {
    const columns = [];
    const startOfWeek = currentDate.startOf("isoWeek");
    for (let i = 0; i < 5; i++) {
      const day = startOfWeek.add(i, "day");
      columns.push({
        date: day.format("YYYY-MM-DD"),
        dayOfWeek: isMobile
          ? day.format("dd")
          : isTablet
          ? day.format("ddd")
          : day.format("ddd"),
        dayNumber: day.format("D.M"),
      });
    }
    return columns;
  };

  const generateTimeRows = () => {
    const times = [];
    for (let i = 8; i <= 15; i++) {
      times.push(`${i}:00`);
      times.push(`${i}:30`);
    }
    return times;
  };

  const getBookingForTimeSlot = (date, time) => {
    if (loading || !filteredBookings || filteredBookings.length === 0)
      return [];

    const booking = filteredBookings.filter(
      (booking) =>
        dayjs(booking.date).format("YYYY-MM-DD") === date &&
        dayjs(booking.date).hour() === parseInt(time.split(":")[0]) &&
        dayjs(booking.date).minute() === parseInt(time.split(":")[1])
    );
    return booking;
  };

  const handleBookingBoxClick = (booking) => {
    setSelectedBooking(booking);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleDateClick = (date, time) => {
    const localDate = dayjs.tz(`${date}T${time}`, "Europe/Helsinki");
    setSelectedDate(localDate.format("YYYY-MM-DDTHH:mm:ssZ"));
    setSelectedBooking(null);
    setIsModalOpen(true);
  };

  const columns = generateDayColumns();
  const times = generateTimeRows();

  const isValidCell = (date, bookings) => {
    const isPastDate = dayjs(date).isBefore(dayjs(), "day");
    return bookings?.length === 0 && (!isPastDate || isAdmin);
  };

  return (
    <>
      <Table sx={{ tableLayout: "fixed", width: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                border: "none",
                py: 0,
                pr: 0,
                pl: 0,
                width: isMobile ? "36px" : isTablet ? "42px" : "48px",
                minWidth: isMobile ? "36px" : isTablet ? "42px" : "48px",
                maxWidth: isMobile ? "36px" : isTablet ? "42px" : "48px",
                boxSizing: "border-box",
                textAlign: "center",
              }}
            >
              {isAdmin && (
                <IconButton sx={{ p: 0.5, alignSelf: "center" }}>
                  <ArrowBackIcon
                    fontSize="small"
                    onClick={() => setMode("locations")}
                  />
                </IconButton>
              )}
            </TableCell>
            {columns.map((column) => (
              <TableCell
                key={column.date}
                align="center"
                sx={{
                  border: "none",
                  p: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "var(--off-black)", fontWeight: 500 }}
                >
                  {column.dayOfWeek}, {column.dayNumber}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody sx={{ position: "relative" }}>
          {times.map((time) => (
            <TableRow key={time}>
              <TableCell
                sx={{
                  py: 0.5,
                  pr: 0.5,
                  pl: 0,
                  height: "40px",
                  boxSizing: "border-box",
                  border: "none",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "var(--off-black)", textAlign: "right" }}
                >
                  {time}
                </Typography>
              </TableCell>
              {columns.map((column) => {
                const bookingsForSlot = getBookingForTimeSlot(
                  column.date,
                  time
                );
                const widthNum =
                  bookingsForSlot.length > 0
                    ? 100.0 / bookingsForSlot.length
                    : 100;
                const bookingWidth = `${widthNum}%`;

                return (
                  <TableCell
                    key={column.date}
                    sx={{
                      border: "none",
                      p: 0.5,
                      height: "40px",
                      boxSizing: "border-box",
                    }}
                  >
                    <Box
                      onClick={() =>
                        isValidCell(column.date, bookingsForSlot)
                          ? handleDateClick(column.date, time)
                          : undefined
                      }
                      sx={{
                        position: "relative",
                        cursor: isValidCell(column.date, bookingsForSlot)
                          ? "pointer"
                          : "default",
                        bgcolor: isValidCell(column.date, bookingsForSlot)
                          ? "var(--white)"
                          : "var(--light-grey)",
                        borderRadius: 2,
                        boxSizing: "border-box",
                        height: "100%",
                        width: "100%",
                        boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
                        p: 0.5,
                        ...(isValidCell(column.date, bookingsForSlot) && {
                          "&:hover": {
                            bgcolor: "var(--white-onhover)",
                          },
                        }),
                      }}
                    >
                      {bookingsForSlot.map((booking, index) => {
                        const left = `${index * widthNum}%`;
                        return (
                          <BookingBox
                            booking={booking}
                            left={left}
                            width={bookingWidth}
                            onClick={handleBookingBoxClick}
                            key={booking._id}
                          />
                        );
                      })}
                    </Box>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          {loading && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: isMobile
                  ? "calc(100% - 36px)"
                  : isTablet
                  ? "calc(100% - 42px)"
                  : "calc(100% - 48px)",
                height: "100%",
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(255, 255, 255, 0.3)",
                borderRadius: 2,
              }}
            >
              <Loader />
            </Box>
          )}
        </TableBody>
      </Table>

      {/* Booking Modal */}
      {isModalOpen && (
        <BookingModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
          date={selectedDate}
          setBookings={setBookings}
        />
      )}
    </>
  );
};

export default WeekCalendar;
