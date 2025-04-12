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
import ArrowBackIcon from "@mui/icons-material/ArrowBackIos";
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
    for (let i = 0; i < 7; i++) {
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
    for (let i = 8; i <= 17; i++) {
      times.push(`${i}:00`);
      if (i < 17) times.push(`${i}:30`);
    }
    return times;
  };

  const getBookingForTimeSlot = (date, time) => {
    const booking = bookings?.filter(
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
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        border: "1px solid rgba(0, 123, 255, 0.5)",
        borderRadius: "4px",
        boxSizing: "border-box",
        padding: "4px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        cursor: "pointer",
        zIndex: 10,
      }}
    >
      <Typography variant="body2">
        {booking.carMake} {booking.carModel}
      </Typography>
      <Typography variant="body2">{booking.plateNumber}</Typography>
      <Typography variant="body2">{booking.insuranceNumber}</Typography>
    </Box>
  );

  const renderCalendar = () => {
    const columns = generateDayColumns();
    const times = generateTimeRows();

    return (
      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  borderRight: "1px solid rgba(224, 224, 224, 1)",
                  width: isMobile ? "54px" : isTablet ? "60px" : "70px",
                  minWidth: "70px",
                  maxWidth: "70px",
                  boxSizing: "border-box",
                }}
              />
              {columns.map((column) => (
                <TableCell
                  key={column.date}
                  align="center"
                  sx={{
                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                    "&:last-child": { borderRight: "none" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    p: 1,
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
            {times.map((time, rowIndex) => (
              <TableRow
                key={time}
                sx={{
                  borderBottom:
                    rowIndex % 2 === 0
                      ? "1px dashed rgba(224, 224, 224, 1)"
                      : "1px solid rgba(224, 224, 224, 1)",
                  py: "6px",
                  ".calendar-cell": {
                    py: "6px",
                    px: 1.5,
                    height: "36px",
                    boxSizing: "border-box",
                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                    borderBottom: "none",
                  },
                  px: 1.5,
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <TableCell
                  sx={{
                    py: "6px",
                    px: 1.5,
                    height: "36px",
                    boxSizing: "border-box",
                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                    borderBottom: "none",
                  }}
                >
                  <Typography variant="body2">{time}</Typography>
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
                      "&:last-child": {
                        borderRight: "none",
                      },
                      py: "6px",
                      px: 1.5,
                      height: "36px",
                      boxSizing: "border-box",
                      borderRight: "1px solid rgba(224, 224, 224, 1)",
                      borderBottom: "none",
                      position: "relative",
                      cursor: "pointer",
                      ...(getBookingForTimeSlot(column.date, time).length ===
                        0 && {
                        "&:hover": {
                          bgcolor: "var(--off-white)",
                        },
                      }),
                    }}
                  >
                    {/* Render the bookings for each time slot */}
                    {getBookingForTimeSlot(column.date, time).map((booking) =>
                      renderBookingBox(booking)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
          sx={{ position: "absolute", left: 0 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h2">Calendar</Typography>
        <IconButton
          onClick={() => handleChangeWeek("next")}
          sx={{ position: "absolute", right: 0 }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box sx={{ display: "grid", placeItems: "center", height: "66vh" }}>
          <Loader />
        </Box>
      ) : (
        renderCalendar()
      )}
    </DefaultContainer>
  );
};

export default Calendar;
