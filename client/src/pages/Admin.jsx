import React, { useState } from "react";
import { Typography, Tabs, Tab, Box } from "@mui/material";
import DefaultContainer from "../components/DefaultContainer";
import UsersTab from "../components/admin/UsersTab";
import LocationsTab from "../components/admin/LocationsTab";
import InvoicesTab from "../components/admin/InvoicesTab";

const Admin = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <DefaultContainer>
      <Typography variant="h2" marginBottom={-2}>
        Admin
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Invoices" />
        <Tab label="Users" />
        <Tab label="Locations" />
      </Tabs>

      <Box sx={{ width: "100%" }}>
        {tabIndex === 0 && <InvoicesTab />}
        {tabIndex === 1 && <UsersTab />}
        {tabIndex === 2 && <LocationsTab />}
      </Box>
    </DefaultContainer>
  );
};

export default Admin;
