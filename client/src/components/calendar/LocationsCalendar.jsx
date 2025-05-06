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
  Menu,
  MenuItem,
  Checkbox,
  Button,
} from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterAlt";
import dayjs from "dayjs";
import useScreenSize from "../../hooks/useScreenSize";
import BookingBox from "./BookingBox";
import Loader from "../loader/Loader";
import BookingModal from "../bookings/BookingModal";
import { useAuth } from "../../context/AuthContext";

const LocationsCalendar = ({
  currentDate,
  setMode,
  setSelectedLocation,
  searchTerm,
}) => {
  const { user, token } = useAuth();
  const { isMobile, isTablet } = useScreenSize();

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationsLoading, setLocationsLoading] = useState(true);
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

  // Fetch locations on mount
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
      } finally {
        setLocationsLoading(false);
      }
    };

    fetchLocations();
  }, [token]);

  // Fetch bookings for the current date
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
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
    if (loading || !filteredBookings || filteredBookings.length === 0)
      return [];

    const booking = filteredBookings.filter(
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

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleLocationToggle = (locationId) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId]
    );
  };

  const handleLocationsClear = () => {
    setSelectedLocations([]);
    setAnchorEl(null);
  };

  const filteredLocations = locations.filter((location) =>
    selectedLocations.length > 0
      ? selectedLocations.includes(location._id)
      : true
  );

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
              {!locationsLoading && (
                <>
                  <IconButton onClick={handleFilterClick}>
                    <FilterIcon fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleFilterClose}
                  >
                    {locations.map((location) => (
                      <MenuItem
                        key={location._id}
                        sx={{ color: "var(--off-black)" }}
                        onClick={() => {
                          handleLocationToggle(location._id);
                        }}
                      >
                        <Checkbox
                          checked={selectedLocations.includes(location._id)}
                          sx={{ ml: -1 }}
                        />
                        <Typography variant="body2" sx={{ color: "inherit" }}>
                          {location.title}
                        </Typography>
                      </MenuItem>
                    ))}
                    <Button
                      onClick={handleLocationsClear}
                      size="small"
                      variant="delete"
                      sx={{ width: "90%", mx: "5%", boxSizing: "border-box" }}
                    >
                      Clear
                    </Button>
                  </Menu>
                </>
              )}
            </TableCell>

            {filteredLocations.map((location) => (
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
        <TableBody sx={{ position: "relative" }}>
          {!locationsLoading &&
            times.map((time) => (
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
                {filteredLocations.map((location) => {
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

          {loading && (
            <Box
              sx={{
                position: "absolute",
                width: locationsLoading
                  ? "100%"
                  : isMobile
                  ? "calc(100% - 36px)"
                  : isTablet
                  ? "calc(100% - 42px)"
                  : "calc(100% - 48px)",
                height: locationsLoading ? "600px" : "100%",
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(255, 255, 255, 0.3)",
                borderRadius: 2,
                ...(locationsLoading
                  ? {
                      top: 0,
                      left: 0,
                    }
                  : {
                      bottom: 0,
                      right: 0,
                    }),
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
          location={selectedLocation}
          setBookings={setBookings}
        />
      )}
    </>
  );
};

export default LocationsCalendar;
