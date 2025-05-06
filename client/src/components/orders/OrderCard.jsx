import React, { useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Card,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { clients } from "../../utils/clients";
import { useTranslation } from "react-i18next";

const OrderCard = ({ order, onEditClick, onDeleteClick }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Find the client name based on the client value
  const clientName =
    order.client === "other"
      ? order.clientName
      : clients.find((client) => client.value === order.client)?.name ||
        order.client;

  return (
    <Card
      sx={{
        width: "100%",
        boxSizing: "border-box",
        p: 1,
        bgcolor: `var(--order-card-${order.client})`,
        color: "var(--off-black)",
        borderRadius: 0.5,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        position: "relative",
        height: "auto",
        overflow: "visible",
      }}
    >
      {/* Note actions menu */}
      <Box
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <MoreVertIcon
          fontSize="small"
          role="button"
          tabIndex={0}
          aria-controls={open ? "order-menu" : undefined}
          onClick={handleMenuOpen}
          sx={{
            cursor: "pointer",
            transition: "color 0.2s ease-in-out",
            outline: "none",
            color: "var(--off-grey)",
            "&:hover": { color: "var(--off-black)" },
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onEditClick(order);
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            {t("menu.edit")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onDeleteClick(order);
            }}
            sx={{
              color: "var(--error)",
              "&:hover": { color: "var(--error-onhover)" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            {t("menu.delete")}
          </MenuItem>
        </Menu>
      </Box>

      <Typography
        variant="h5"
        color="inherit"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          wordBreak: "break-word",
          maxWidth: "calc(100% - 20px)",
        }}
      >
        {clientName}
      </Typography>

      {order.products.map((product, index) => (
        <Typography
          key={index}
          variant="card"
          color="inherit"
          sx={{
            wordBreak: "break-word",
            overflow: "hidden",
            hyphens: "auto",
            pl: 0.5,
            color: product.status === "inStock" ? "inherit" : "var(--accent)",
            fontWeight: product.status === "inStock" ? "unset" : 500,
          }}
        >
          {product.eurocode.toUpperCase()}, {product.amount}pc, €{product.price}
        </Typography>
      ))}

      {order.notes && (
        <>
          <Divider />

          <Typography
            variant="card"
            color="inherit"
            sx={{
              wordBreak: "break-word",
              overflow: "hidden",
              hyphens: "auto",
              fontStyle: "italic",
            }}
          >
            {order.notes}
          </Typography>
        </>
      )}
    </Card>
  );
};

export default OrderCard;
