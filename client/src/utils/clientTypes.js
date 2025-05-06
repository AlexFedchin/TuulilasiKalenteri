import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import { t } from "i18next";

export const clientTypes = [
  {
    name: t("bookingModal.clientTypes.private"),
    value: "private",
    icon: React.createElement(PersonIcon, { fontSize: "small" }),
  },
  {
    name: t("bookingModal.clientTypes.company"),
    value: "company",
    icon: React.createElement(BusinessIcon, { fontSize: "small" }),
  },
];
