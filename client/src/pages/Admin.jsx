import React from "react";
import { Typography } from "@mui/material";
import DefaultContainer from "../components/DefaultContainer";

const Admin = () => {
  return (
    <DefaultContainer>
      <Typography variant="h2">Admin</Typography>
      <Typography variant="body1">
        This is the admin page, accessible only to admins.
      </Typography>
      <Typography variant="body2">This is a subtext.</Typography>
    </DefaultContainer>
  );
};

export default Admin;
