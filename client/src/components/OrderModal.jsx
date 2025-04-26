import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
} from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import NotesIcon from "@mui/icons-material/Notes";
import BusinessIcon from "@mui/icons-material/Business";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { useAuth } from "../context/AuthContext";
import { alert } from "../utils/alert";
import { clients } from "../utils/clients";
import Joi from "joi";

const orderValidationSchema = Joi.object({
  eurocode: Joi.string().min(2).max(20).required().messages({
    "string.base": "Eurocode must be a string.",
    "string.empty": "Eurocode is required.",
    "string.min": "Eurocode must be at least 2 characters long.",
    "string.max": "Eurocode must be at most 20 characters long.",
    "any.required": "Eurocode is required.",
  }),
  client: Joi.string()
    .required()
    .valid(
      "pauli",
      "vip",
      "maalarium",
      "tammerwheels",
      "colormaster",
      "rantaperkionkatu",
      "other"
    )
    .messages({
      "string.base": "Client must be a string.",
      "any.only": "Client must be one of the predefined values.",
    }),
  clientName: Joi.string()
    .min(2)
    .max(50)
    .when("client", {
      is: "other",
      then: Joi.required(),
      otherwise: Joi.allow(""),
    })
    .messages({
      "string.base": "Client name must be a string.",
      "string.empty": "Client name is required when client is 'other'.",
      "string.min": "Client name must be at least 2 characters long.",
      "string.max": "Client name must be at most 50 characters long.",
      "any.required": "Client name is required when client is 'other'.",
    }),
  notes: Joi.string().max(500).allow("").messages({
    "string.base": "Notes must be a string.",
    "string.max": "Notes must be at most 500 characters long.",
  }),
});

const UserModal = ({ onClose, order, setOrders }) => {
  const { token } = useAuth();
  const isEdit = !!order;

  const [formData, setFormData] = useState({
    eurocode: order?.eurocode || "",
    client: order?.client || clients[0].value,
    clientName: order?.clientName || "",
    notes: order?.notes || "",
  });

  const [errors, setErrors] = useState({});

  const isSubmitDisabled =
    !formData.eurocode ||
    !formData.client ||
    (formData.client === "other" && !formData.clientName);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { error } = orderValidationSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
      console.error("Validation errors:", validationErrors);
      return;
    }

    setErrors({});

    // Add only not empty fields to updatedInfo
    const updatedInfo = {};
    if (formData.eurocode.trim())
      updatedInfo.eurocode = formData.eurocode.trim();
    if (formData.client.trim()) updatedInfo.client = formData.client.trim();
    if (formData.clientName.trim())
      updatedInfo.clientName = formData.clientName.trim();
    if (formData.notes.trim()) updatedInfo.notes = formData.notes.trim();

    const endpoint = isEdit ? `/api/orders/${order._id}` : "/api/orders";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedInfo),
      });

      const result = await response.json();

      if (!response.ok) {
        alert.error(`Error: ${result.error}`);
        console.error("Request failed:", result.error);
        return;
      }

      if (isEdit) {
        setOrders((prevOrder) =>
          prevOrder.map((o) => (o._id === result._id ? result : o))
        );
        alert.success("Order updated successfully!");
      } else {
        setOrders((prev) => [result, ...prev]);
        alert.success("Order created successfully!");
      }

      onClose();
    } catch (err) {
      alert.error("Unexpected error occurred");
      console.error("Request failed:", err);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          minWidth: "350px",
          boxSizing: "border-box",
          maxWidth: "600px",
          bgcolor: "var(--white)",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            position: "relative",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">
            {isEdit ? "Edit Order" : "New Order"}
          </Typography>
          <IconButton onClick={onClose} sx={{ position: "absolute", right: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Eurocode */}
          <Box>
            <Typography variant="textFieldLabel">
              <TagIcon fontSize="small" />
              Eurocode
            </Typography>
            <TextField
              size="small"
              fullWidth
              margin="none"
              type="text"
              placeholder="Eurocode"
              name="eurocode"
              value={formData["eurocode"].toUpperCase()}
              onChange={handleChange}
              error={!!errors["eurocode"]}
              helperText={errors["eurocode"] || ""}
            />
          </Box>

          {/* Cliet & Client Name */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {/* Client */}
            <Box sx={{ mb: "-5px", flexGrow: 1 }}>
              <Typography variant="textFieldLabel">
                <BusinessIcon fontSize="small" />
                Client
              </Typography>
              <FormControl fullWidth error={!!errors.client}>
                <Select
                  name="client"
                  size="small"
                  value={formData.client}
                  onChange={handleChange}
                >
                  {clients.map((client) => (
                    <MenuItem
                      key={client.value}
                      value={client.value}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: `var(--order-card-${client.value})`,
                          border: "1px solid var(--light-grey)",
                        }}
                      />
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.client || ""}</FormHelperText>
              </FormControl>
            </Box>
            {formData.client === "other" && (
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="textFieldLabel">
                  <BusinessIcon fontSize="small" />
                  Client Name
                </Typography>
                <TextField
                  placeholder="Client name"
                  name="clientName"
                  size="small"
                  value={formData.clientName}
                  onChange={handleChange}
                  error={!!errors.clientName}
                  helperText={errors.clientName || ""}
                  fullWidth
                />
              </Box>
            )}
          </Box>
          {/* Notes */}
          <Box>
            <Typography variant="textFieldLabel">
              <NotesIcon fontSize="small" />
              Notes
            </Typography>
            <TextField
              size="small"
              fullWidth
              margin="none"
              type="text"
              placeholder="Some additional information..."
              name="notes"
              value={formData["notes"]}
              onChange={handleChange}
              error={!!errors["notes"]}
              helperText={errors["notes"] || ""}
              multiline
              rows={4}
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose} variant="cancel" startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="submit"
            disabled={isSubmitDisabled}
            startIcon={<DoneIcon />}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UserModal;
