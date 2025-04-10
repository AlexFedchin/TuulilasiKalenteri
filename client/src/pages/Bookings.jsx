import { Typography } from "@mui/material";
import DefaultContainer from "../components/DefaultContainer";

const Bookings = () => {
  return (
    <DefaultContainer>
      <Typography variant="h2">Bookings</Typography>
      <Typography variant="body1">
        This is the bookings page, accessible to all authenticated users.
      </Typography>
      <Typography variant="body2">This is a subtext.</Typography>
    </DefaultContainer>
  );
};

export default Bookings;
