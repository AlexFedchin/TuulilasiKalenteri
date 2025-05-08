import React, { useState } from "react";
import { Typography, Tabs, Tab, Box } from "@mui/material";
import DefaultContainer from "../components/DefaultContainer";
import OrdersTab from "../components/admin/OrdersTab";
import UsersTab from "../components/admin/UsersTab";
import LocationsTab from "../components/admin/LocationsTab";
import InvoicesTab from "../components/admin/InvoicesTab";
import { useTranslation } from "react-i18next";
import Orders from "../components/orders/OrdersBlock";

const Admin = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <DefaultContainer>
      <Typography variant="h2" marginBottom={-1}>
        {t("admin.title")}
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label={t("admin.tabs.orders")} />
        <Tab label={t("admin.tabs.invoices")} />
        <Tab label={t("admin.tabs.users")} />
        <Tab label={t("admin.tabs.locations")} />
      </Tabs>

      <Box sx={{ width: "100%" }}>
        {tabIndex === 0 && <OrdersTab />}
        {tabIndex === 1 && <InvoicesTab />}
        {tabIndex === 2 && <UsersTab />}
        {tabIndex === 3 && <LocationsTab />}
      </Box>
    </DefaultContainer>
  );
};

export default Admin;
