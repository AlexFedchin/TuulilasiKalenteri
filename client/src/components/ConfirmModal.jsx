import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import useScreenSize from "../hooks/useScreenSize";
import Loader from "./loader/Loader";
import { useTranslation } from "react-i18next";

const ConfirmModal = ({ onConfirm, onClose, text }) => {
  const { isMobile } = useScreenSize();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleConfirm = () => {
    setLoading(true);
    onConfirm();
    setLoading(false);
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "relative",
          top: "50%",
          left: "50%",
          transform: "translate(calc(-50% - 16px), -50%)",
          width: "50%",
          minWidth: "min(500px, calc(100% - 32px))",
          maxWidth: "500px",
          bgcolor: "var(--white)",
          boxShadow: 24,
          p: isMobile ? 2 : 3,
          borderRadius: 2,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          gap: 2,
          mx: 2,
        }}
      >
        {loading && (
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
            }}
          >
            <Loader />
          </Box>
        )}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
          }}
        >
          <Typography variant="h4">{t("confirmModal.title")}</Typography>
          <IconButton onClick={onClose} sx={{ position: "absolute", right: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ backgroundColor: "var(--off-white)" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
            maxHeight: "60vh",
          }}
        >
          <Typography variant="body1">
            <span dangerouslySetInnerHTML={{ __html: text }} />
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            startIcon={<CloseIcon />}
            variant="cancel"
            onClick={onClose}
            sx={{ flexGrow: 1 }}
          >
            {t("confirmModal.cancel")}
          </Button>
          <Button
            startIcon={<DoneIcon />}
            variant="submit"
            onClick={handleConfirm}
            sx={{ flexGrow: 1 }}
          >
            {t("confirmModal.confirm")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
