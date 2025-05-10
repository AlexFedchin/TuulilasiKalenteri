import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Card,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import DefaultContainer from "../components/DefaultContainer";
import ArrowForwardIcon from "@mui/icons-material/KeyboardBackspace";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isoWeek from "dayjs/plugin/isoWeek";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/fi";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import useScreenSize from "../hooks/useScreenSize";
import Notes from "../components/notes/NotesBlock";
import WeekCalendar from "../components/calendar/WeekCalendar";
import LocationsCalendar from "../components/calendar/LocationsCalendar";
import Orders from "../components/orders/OrdersBlock";
import { useTranslation } from "react-i18next";

const Calendar = () => {
  const { i18n, t } = useTranslation();
  dayjs.extend(isoWeek);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(updateLocale);
  useEffect(() => {
    dayjs.locale(i18n.language);

    dayjs.updateLocale(i18n.language, {
      weekStart: 1,
    });
  }, [i18n.language]);

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
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

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
      const startOfWeek = currentDate.startOf("isoWeek").locale(i18n.language);
      const endOfWeek = currentDate.endOf("isoWeek").locale(i18n.language);
      return `${startOfWeek.format("DD.MM")} - ${endOfWeek.format("DD.MM")}`;
    } else if (mode === "locations") {
      return currentDate.locale(i18n.language).format("ddd, MMMM D");
    }
    return "";
  };

  const renderCalendar = () => {
    return mode === "week" ? (
      <WeekCalendar
        currentDate={currentDate}
        setMode={setMode}
        location={selectedLocation}
        searchTerm={searchTerm}
      />
    ) : mode === "locations" ? (
      <LocationsCalendar
        currentDate={currentDate}
        setMode={setMode}
        setSelectedLocation={setSelectedLocation}
        searchTerm={searchTerm}
      />
    ) : null;
  };

  return (
    <DefaultContainer
      sx={{
        maxWidth: "1600px !important",
        gap: isMobile ? 1 : 3,
        ...(isMobile && { px: "8px !important" }),
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 1 : isTablet ? 2 : 8,
        }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={i18n.language}
        >
          {/* Desktop Calendar Section */}
          {!isMobile && (
            <Card
              sx={{
                p: 1,
                maxWidth: "300px",
                width: "25%",
                boxSizing: "border-box",
                flexShrink: 1,
              }}
            >
              <DatePicker
                value={currentDate}
                format="D MMM YYYY"
                onChange={(newValue) => {
                  setCurrentDate(newValue);
                }}
                shouldDisableDate={(date) => {
                  const day = date.day();
                  return day === 0 || day === 6;
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    variant: "outlined",
                    InputProps: {
                      sx: {
                        fontSize: isMobile
                          ? "0.9rem"
                          : isTablet
                          ? "0.95rem"
                          : "1rem",
                      },
                    },
                  },
                }}
              />
            </Card>
          )}

          {/* Middle Section */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              minWidth: isMobile ? "200px" : isTablet ? "275px" : "275px",
              maxWidth: isMobile ? "250px" : "unset",
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
            <Box sx={{ flexShrink: 0 }}>
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

          {/* Desktop Search Section */}
          {!isMobile && (
            <Card
              sx={{
                p: 1,
                maxWidth: "300px",
                width: "25%",
                boxSizing: "border-box",
                flexShrink: 1,
              }}
            >
              <TextField
                placeholder={t("calendar.searchPlaceholder")}
                variant="outlined"
                fullWidth
                size="small"
                sx={{ width: "100%" }}
                value={searchTerm}
                onChange={handleSearchChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "var(--off-grey)" }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end" sx={{ mr: "-12px" }}>
                        <IconButton onClick={() => setSearchTerm("")}>
                          <CloseIcon
                            fontSize="small"
                            sx={{ color: "var(--off-grey)" }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Card>
          )}

          {/* Mobile calendar and search */}
          {isMobile && (
            <Card
              sx={{
                display: "flex",
                gap: 1,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
                boxSizing: "border-box",
              }}
            >
              <MobileDatePicker
                value={currentDate}
                format="D.M.YYYY"
                onChange={(newValue) => {
                  setCurrentDate(newValue);
                }}
                shouldDisableDate={(date) => {
                  const day = date.day();
                  return day === 0 || day === 6;
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    variant: "outlined",
                    InputProps: {
                      sx: {
                        fontSize: isMobile
                          ? "0.9rem"
                          : isTablet
                          ? "0.95rem"
                          : "1rem",
                      },
                    },
                  },
                }}
              />

              <TextField
                placeholder={t("calendar.searchPlaceholder")}
                variant="outlined"
                fullWidth
                size="small"
                sx={{ width: "100%" }}
                value={searchTerm}
                onChange={handleSearchChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "var(--off-grey)" }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end" sx={{ mr: "-12px" }}>
                        <IconButton onClick={() => setSearchTerm("")}>
                          <CloseIcon
                            fontSize="small"
                            sx={{ color: "var(--off-grey)" }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Card>
          )}
        </LocalizationProvider>
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
            maxHeight: "676px",
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
