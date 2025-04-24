import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import useScreenSize from "../../hooks/useScreenSize";
import BookingBox from "./BookingBox";
import Loader from "../loader/Loader";
import BookingModal from "../BookingModal";
import { useAuth } from "../../context/AuthContext";

const LocationsCalendar = ({ currentDate, setMode, setSelectedLocation }) => {
  const { user, token } = useAuth();
  const { isMobile, isTablet } = useScreenSize();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocationState] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const fetchedDates = useRef([]);
  useEffect(() => {
    fetchedDates.current = [];
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, [token]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `/api/bookings?date=${currentDate.format("YYYY-MM-DD")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

    if (!fetchedDates.current.includes(currentDate.format("YYYY-MM-DD"))) {
      fetchBookings();
    }
  }, [currentDate, locations, token]);

  const generateTimeRows = () => {
    const times = [];
    for (let i = 8; i <= 15; i++) {
      times.push(`${i}:00`);
      times.push(`${i}:30`);
    }
    return times;
  };

  const getBookingForTimeSlot = (time, location) => {
    if (!bookings || bookings.length === 0) return [];

    const booking = bookings.filter(
      (booking) =>
        dayjs(booking.date).format("YYYY-MM-DD") ===
          currentDate.format("YYYY-MM-DD") &&
        dayjs(booking.date).hour() === parseInt(time.split(":")[0]) &&
        dayjs(booking.date).minute() === parseInt(time.split(":")[1]) &&
        booking.location === location._id
    );
    return booking;
  };

  const handleBookingBoxClick = (booking) => {
    setSelectedBooking(booking);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleSlotClick = (time, location) => {
    const formattedDate = currentDate.format("YYYY-MM-DD");
    const localDate = dayjs.tz(`${formattedDate}T${time}`, "Europe/Helsinki");
    setSelectedDate(localDate.format("YYYY-MM-DDTHH:mm:ssZ"));
    setSelectedLocationState(location);
    setSelectedBooking(null);
    setIsModalOpen(true);
  };

  const times = generateTimeRows();

  const isValidCell = (bookings) => {
    const isPastDate = dayjs(currentDate).isBefore(dayjs(), "day");
    return bookings?.length === 0 && (!isPastDate || isAdmin);
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            height: "66vh",
            width: "100%",
          }}
        >
          <Loader />
        </Box>
      ) : (
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  border: "none",
                  py: 0.5,
                  pr: 0.5,
                  pl: 0,
                  width: isMobile ? "36px" : isTablet ? "42px" : "48px",
                  minWidth: isMobile ? "36px" : isTablet ? "42px" : "48px",
                  maxWidth: isMobile ? "36px" : isTablet ? "42px" : "48px",
                  boxSizing: "border-box",
                }}
              />

              {locations.map((location) => (
                <TableCell
                  key={location._id}
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
                    sx={{
                      color: "var(--off-black)",
                      fontWeight: 500,
                      cursor: "pointer",
                      "&:hover": {
                        color: "var(--primary-onhover)",
                      },
                    }}
                    onClick={() => {
                      setMode("week");
                      setSelectedLocation(location);
                    }}
                  >
                    {location.title}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
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
                {locations.map((location) => {
                  const bookingsForSlot = getBookingForTimeSlot(time, location);
                  const widthNum =
                    bookingsForSlot.length > 0
                      ? 100.0 / bookingsForSlot.length
                      : 100;
                  const bookingWidth = `${widthNum}%`;

                  return (
                    <TableCell
                      key={location._id}
                      sx={{
                        border: "none",
                        p: 0.5,
                        height: "40px",
                        boxSizing: "border-box",
                      }}
                    >
                      <Box
                        onClick={() =>
                          isValidCell(bookingsForSlot)
                            ? handleSlotClick(time, location._id)
                            : undefined
                        }
                        sx={{
                          position: "relative",
                          cursor: isValidCell(bookingsForSlot)
                            ? "pointer"
                            : "default",
                          bgcolor: isValidCell(bookingsForSlot)
                            ? "var(--white)"
                            : "var(--light-grey)",
                          borderRadius: 2,
                          boxSizing: "border-box",
                          height: "100%",
                          width: "100%",
                          boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
                          p: 0.5,
                          ...(isValidCell(bookingsForSlot) && {
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
          </TableBody>
        </Table>
      )}

      {/* Booking Modal */}
      {isModalOpen && (
        <BookingModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
          date={selectedDate}
          location={selectedLocation}
          setBookings={setBookings}
        />
      )}
    </>
  );
};

export default LocationsCalendar;
