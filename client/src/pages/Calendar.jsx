import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import DefaultContainer from "../components/DefaultContainer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardIos";
import dayjs from "dayjs";
import useScreenSize from "../hooks/useScreenSize";
import Loader from "../components/loader/Loader";

const Calendar = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { isMobile, isTablet } = useScreenSize();

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const startOfWeek = currentDate
          .startOf("week")
          .add(1, "day")
          .format("YYYY-MM-DD");
        const endOfWeek = currentDate
          .endOf("week")
          .add(1, "day")
          .format("YYYY-MM-DD");

        const response = await fetch(
          `/api/bookings?startDate=${startOfWeek}&endDate=${endOfWeek}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, token, currentDate]);

  const generateDayColumns = () => {
    const columns = [];
    const startOfWeek = currentDate.startOf("week").add(1, "day");
    for (let i = 0; i < 5; i++) {
      const day = startOfWeek.add(i, "day");
      columns.push({
        date: day.format("YYYY-MM-DD"),
        dayOfWeek: isMobile
          ? day.format("dd")
          : isTablet
          ? day.format("ddd")
          : day.format("dddd"),
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
    if (!bookings || bookings.length === 0) return [];

    const booking = bookings.filter(
      (booking) =>
        dayjs(booking.date).format("YYYY-MM-DD") === date &&
        dayjs(booking.date).hour() === parseInt(time.split(":")[0]) &&
        dayjs(booking.date).minute() === parseInt(time.split(":")[1])
    );
    return booking;
  };

  const handleBookingBoxClick = (booking) => {
    console.log("Booking clicked:", booking);
  };

  const handleDateClick = (date, time) => {
    console.log("Date and time clicked:", date, time);
  };

  const handleChangeWeek = (direction) => {
    if (direction === "next") {
      setCurrentDate((prevDate) => prevDate.add(7, "day"));
    } else if (direction === "prev") {
      setCurrentDate((prevDate) => prevDate.subtract(7, "day"));
    }
  };

  const renderBookingBox = (booking) => (
    <Box
      key={booking._id}
      onClick={(e) => {
        e.stopPropagation;
        e.preventDefault();
        handleBookingBoxClick(booking);
      }}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${booking.duration * 72}px`,
        backgroundColor: "rgb(83, 175, 228)",
        color: "var(--white)",
        borderRadius: 2,
        boxSizing: "border-box",
        padding: 0.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        cursor: "pointer",
        zIndex: 10,
      }}
    >
      <Typography variant="card" color="inherit">
        {booking.carMake} {booking.carModel}
      </Typography>
      <Typography variant="card" color="inherit">
        {booking.plateNumber}
      </Typography>
      <Typography variant="card" color="inherit">
        {booking.insuranceNumber}
      </Typography>
    </Box>
  );

  const renderCalendar = () => {
    const columns = generateDayColumns();
    const times = generateTimeRows();

    return (
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
                  variant="h4"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.dayOfWeek}
                </Typography>
                <Typography variant="body2">{column.dayNumber}</Typography>
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
              {columns.map((column) => (
                <TableCell
                  key={column.date}
                  onClick={() =>
                    getBookingForTimeSlot(column.date, time).length === 0
                      ? handleDateClick(column.date, time)
                      : undefined
                  }
                  sx={{
                    border: "none",
                    p: 0.5,
                    height: "40px",
                    boxSizing: "border-box",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      bgcolor: "var(--white)",
                      borderRadius: 2,
                      boxSizing: "border-box",
                      height: "100%",
                      width: "100%",
                      boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
                      p: 0.5,
                      ...(getBookingForTimeSlot(column.date, time).length ===
                        0 && {
                        "&:hover": {
                          bgcolor: "var(--white-onhover)",
                        },
                      }),
                    }}
                  >
                    {/* Render the bookings for each time slot */}
                    {getBookingForTimeSlot(column.date, time).map((booking) =>
                      renderBookingBox(booking)
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <DefaultContainer sx={{ maxWidth: "1600px !important", gap: 3 }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "cenetr",
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => handleChangeWeek("prev")}
          sx={{
            position: "absolute",
            left: 0,
            display: "grid",
            placeItems: "center",
          }}
        >
          <ArrowForwardIcon sx={{ transform: "rotate(180deg)" }} />
        </IconButton>
        <Typography variant="h2">Calendar</Typography>
        <IconButton
          onClick={() => handleChangeWeek("next")}
          sx={{
            position: "absolute",
            right: 0,
            display: "grid",
            placeItems: "center",
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box sx={{ display: "grid", placeItems: "center", height: "66vh" }}>
          <Loader />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            gap: 2,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Box sx={{ disaply: "flex", width: isMobile ? "100%" : "80%" }}>
            {renderCalendar()}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              bgcolor: "var(--white)",
              boxSizing: "border-box",
              maxHeight: "687.55px",
              width: isMobile ? "100%" : "20%",
              borderRadius: 2,
              boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
              my: 0.5,
              p: 1,
            }}
          >
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              Notes
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
              <Box
                sx={{
                  width: "100%",
                  boxSizing: "border-box",
                  p: 1,
                  bgcolor: "var(--white)",
                  color: "var(--off-black)",
                  borderRadius: 0.5,
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="h5"
                  color="inherit"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Note title
                </Typography>
                <Typography
                  variant="card"
                  color="inherit"
                  sx={{
                    wordBreak: "break-word",
                    overflow: "hidden",
                    hyphens: "auto",
                  }}
                >
                  Note description goes here. This is a sample note. very very
                  simple one. Trust me.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </DefaultContainer>
  );
};

export default Calendar;
