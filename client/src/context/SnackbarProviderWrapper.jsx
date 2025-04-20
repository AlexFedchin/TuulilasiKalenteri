import React from "react";
import { SnackbarProvider, MaterialDesignContent } from "notistack";
import DoneIcon from "@mui/icons-material/TaskAltOutlined";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import WarningIcon from "@mui/icons-material/ErrorOutlineOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { styled } from "@mui/system";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  backgroundColor: "var(--white)",
  color: "var(--off-black)",
  borderRadius: "8px",
  boxShadow: "0 0px 16px rgba(0, 0, 0, 0.1)",
}));

const SnackbarProviderWrapper = ({ children }) => (
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
    autoHideDuration={3000}
    preventDuplicate
    Components={{
      success: StyledMaterialDesignContent,
      warning: StyledMaterialDesignContent,
      info: StyledMaterialDesignContent,
      error: StyledMaterialDesignContent,
    }}
    iconVariant={{
      success: <DoneIcon sx={{ color: "var(--success)", mr: 1 }} />,
      error: <CancelIcon sx={{ color: "var(--error)", mr: 1 }} />,
      warning: <WarningIcon sx={{ color: "var(--warning)", mr: 1 }} />,
      info: <InfoIcon sx={{ color: "var(--primary)", mr: 1 }} />,
    }}
  >
    {children}
  </SnackbarProvider>
);

export default SnackbarProviderWrapper;
