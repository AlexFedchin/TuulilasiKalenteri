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
      <Typography variant="h2">Admin</Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Users" />
        <Tab label="Locations" />
        <Tab label="Invoices" />
      </Tabs>

      <Box>
        {tabIndex === 0 && <UsersTab />}
        {tabIndex === 1 && <LocationsTab />}
        {tabIndex === 2 && <InvoicesTab />}
      </Box>
    </DefaultContainer>
  );
};

export default Admin;
