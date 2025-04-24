import { Typography } from "@mui/material";
import DefaultContainer from "../components/DefaultContainer";

const NotFound = () => {
  return (
    <DefaultContainer sx={{ height: "calc(100vh - 128px)", gap: 3 }}>
      <Typography variant="h1" sx={{ color: "var(--accent)", mb: -3 }}>
        404
      </Typography>
      <Typography variant="h2" sx={{ color: "var(--off-black)" }}>
        Page Not Found
      </Typography>
      <Typography variant="body2">
        The page you are looking for does not exist.
      </Typography>
    </DefaultContainer>
  );
};

export default NotFound;
