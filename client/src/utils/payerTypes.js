import React from "react";
import { t } from "i18next";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import InsuranceCompanyIcon from "@mui/icons-material/AccountBalance";

export const payerTypes = [
  {
    name: t("bookingModal.payerTypes.person"),
    value: "person",
    icon: React.createElement(PersonIcon, { fontSize: "small" }),
  },
  {
    name: t("bookingModal.payerTypes.company"),
    value: "company",
    icon: React.createElement(BusinessIcon, { fontSize: "small" }),
  },
  {
    name: t("bookingModal.payerTypes.insurance"),
    value: "insurance",
    icon: React.createElement(InsuranceCompanyIcon, { fontSize: "small" }),
  },
];
