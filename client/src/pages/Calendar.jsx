import { useState } from "react";
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

const Calendar = () => {
  dayjs.extend(isoWeek);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const { isMobile } = useScreenSize();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mode, setMode] = useState(isAdmin ? "locations" : "week");

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

  const getHeaderText = () => {
    if (mode === "week") {
      const startOfWeek = currentDate.startOf("isoWeek");
      const endOfWeek = currentDate.endOf("isoWeek");
      return `${startOfWeek.format("DD.MM")} - ${endOfWeek.format("DD.MM")}`;
    } else if (mode === "locations") {
      return currentDate.format("dddd, MMMM D");
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
    <DefaultContainer sx={{ maxWidth: "1600px !important", gap: 3 }}>
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "cenetr",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <IconButton
            onClick={() => handleChangeDate("prev")}
            sx={{
              display: "grid",
              placeItems: "center",
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
          <Typography variant="h3">{getHeaderText()}</Typography>
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
          gap: 2,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Box sx={{ display: "flex", width: isMobile ? "100%" : "80%" }}>
          {renderCalendar()}
        </Box>
        <Box
          sx={{
            boxSizing: "border-box",
            maxHeight: "696.55px",
            py: 0.5,
            width: isMobile ? "100%" : "20%",
          }}
        >
          <Notes />
        </Box>
      </Box>
    </DefaultContainer>
  );
};

export default Calendar;
