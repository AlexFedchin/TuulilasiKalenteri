import React from "react";
import { Typography } from "@mui/material";
import DefaultContainer from "../components/DefaultContainer";

const Calendar = () => {
  return (
    <DefaultContainer>
      <Typography variant="h2">Calendar</Typography>
      <Typography variant="body1">
        This is the calendar page, accessible to all authenticated users.
      </Typography>
      <Typography variant="body2">This is a subtext.</Typography>
    </DefaultContainer>
  );
};

export default Calendar;
