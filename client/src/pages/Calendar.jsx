import { useEffect, useState } from "react";
import { Typography, Box, IconButton } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import DefaultContainer from "../components/DefaultContainer";
import ArrowForwardIcon from "@mui/icons-material/KeyboardBackspace";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isoWeek from "dayjs/plugin/isoWeek";
import useScreenSize from "../hooks/useScreenSize";
import Notes from "../components/notes/NotesBlock";
import WeekCalendar from "../components/calendar/WeekCalendar";
import LocationsCalendar from "../components/calendar/LocationsCalendar";
import Orders from "../components/orders/OrdersBlock";

const Calendar = () => {
  dayjs.extend(isoWeek);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const getInitialDate = () => {
    const today = dayjs();

    const isWeekend = today.day() === 0 || today.day() === 6;
    if (isWeekend) {
      return today.day() === 0
        ? today.subtract(2, "day")
        : today.subtract(1, "day");
    }
    return today;
  };

  const { isMobile, isTablet } = useScreenSize();
  const { user, token } = useAuth();
  const isAdmin = user?.role === "admin";
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mode, setMode] = useState(isAdmin ? "locations" : "week");
  const [currentDate, setCurrentDate] = useState(getInitialDate());

  const handleChangeDate = (direction) => {
    if (direction === "next") {
      if (mode === "week") {
        setCurrentDate((prevDate) => prevDate.add(7, "day"));
      } else if (mode === "locations") {
        setCurrentDate((prevDate) => {
          const nextDate = prevDate.add(1, "day");
          return nextDate.day() === 6
            ? nextDate.add(2, "day")
            : nextDate.day() === 0
            ? nextDate.add(1, "day")
            : nextDate;
        });
      }
    } else if (direction === "prev") {
      if (mode === "week") {
        setCurrentDate((prevDate) => prevDate.subtract(7, "day"));
      } else if (mode === "locations") {
        setCurrentDate((prevDate) => {
          const prevDateAdjusted = prevDate.subtract(1, "day");
          return prevDateAdjusted.day() === 0
            ? prevDateAdjusted.subtract(2, "day")
            : prevDateAdjusted.day() === 6
            ? prevDateAdjusted.subtract(1, "day")
            : prevDateAdjusted;
        });
      }
    }
  };

  useEffect(() => {
    if (user.role === "admin" || mode === "week") return;

    const fetchLocation = async () => {
      const response = await fetch("api/locations", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.status !== 200) {
        console.error("Error fetching location:", data);
        return;
      }
      if (data) {
        setSelectedLocation(data[0]);
      }
    };

    fetchLocation();
  }, [mode, token, user]);

  const getHeaderText = () => {
    if (mode === "week") {
      const startOfWeek = currentDate.startOf("isoWeek");
      const endOfWeek = currentDate.endOf("isoWeek");
      return `${startOfWeek.format("DD.MM")} - ${endOfWeek.format("DD.MM")}`;
    } else if (mode === "locations") {
      return currentDate.format("ddd, MMMM D");
    }
    return "";
  };

  const renderCalendar = () => {
    return mode === "week" ? (
      <WeekCalendar
        currentDate={currentDate}
        setMode={setMode}
        location={selectedLocation}
      />
    ) : mode === "locations" ? (
      <LocationsCalendar
        currentDate={currentDate}
        setMode={setMode}
        setSelectedLocation={setSelectedLocation}
      />
    ) : null;
  };

  return (
    <DefaultContainer
      sx={{ maxWidth: "1600px !important", gap: isMobile ? 1 : 3 }}
    >
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "cenetr",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            minWidth: "min(100%, 350px)",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            onClick={() => handleChangeDate("prev")}
            sx={{
              display: "grid",
              placeItems: "center",
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
          <Box>
            <Typography variant="h3">{getHeaderText()}</Typography>
            {selectedLocation && mode === "week" ? (
              <Typography variant="body2" letterSpacing={2}>
                {selectedLocation.title}
              </Typography>
            ) : null}
          </Box>
          <IconButton
            onClick={() => handleChangeDate("next")}
            sx={{
              display: "grid",
              placeItems: "center",
            }}
          >
            <ArrowForwardIcon sx={{ transform: "rotate(180deg)" }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          gap: 1,
          flexDirection: isMobile
            ? "column"
            : isTablet
            ? isAdmin
              ? "column"
              : "row"
            : "row",
        }}
      >
        <Box
          sx={{
            width: isAdmin
              ? isMobile || isTablet
                ? "100%"
                : "64%"
              : isMobile
              ? "100%"
              : "80%",
          }}
        >
          {renderCalendar()}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: "row",
            alignItems: "stretch",
            boxSizing: "border-box",
            maxHeight: "670.88px",
            py: 0.5,
            width: isAdmin
              ? isMobile || isTablet
                ? "100%"
                : "36%"
              : isMobile
              ? "100%"
              : "20%",
          }}
        >
          {isAdmin && <Orders />}

          <Notes />
        </Box>
      </Box>
    </DefaultContainer>
  );
};

export default Calendar;
