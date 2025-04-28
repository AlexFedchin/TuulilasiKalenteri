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
  InputAdornment,
} from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import BusinessIcon from "@mui/icons-material/Business";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useAuth } from "../context/AuthContext";
import { alert } from "../utils/alert";
import { clients } from "../utils/clients";
import Joi from "joi";
import useScreenSize from "../hooks/useScreenSize";

const orderValidationSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        eurocode: Joi.string().min(2).max(20).required().messages({
          "string.base": "Eurocode must be a string.",
          "string.empty": "Eurocode is required.",
          "string.min": "Eurocode must be at least 2 characters long.",
          "string.max": "Eurocode must be at most 20 characters long.",
          "any.required": "Eurocode is required.",
        }),
        amount: Joi.number().integer().min(1).required().messages({
          "number.base": "Amount must be a number.",
          "number.integer": "Amount must be an integer.",
          "number.min": "Amount must be at least 1.",
          "any.required": "Amount is required.",
        }),
        price: Joi.number().integer().min(0).required().messages({
          "number.base": "Price must be a number.",
          "number.integer": "Price must be an integer.",
          "number.min": "Price must be at least 0.",
          "any.required": "Price is required.",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Products must be an array.",
      "array.includesRequiredUnknowns":
        "Each product must have eurocode, amount, and price.",
      "any.required": "Products are required.",
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

const OrderModal = ({ onClose, order, setOrders }) => {
  const { isMobile, isTablet } = useScreenSize();
  const { token } = useAuth();
  const isEdit = !!order;

  const [formData, setFormData] = useState({
    products: order?.products.map(({ eurocode, amount, price }) => ({
      eurocode,
      amount,
      price,
    })) || [{ eurocode: "", amount: 1, price: 0 }],
    client: order?.client || clients[0].value,
    clientName: order?.clientName || "",
    notes: order?.notes || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e, index, field) => {
    const { value } = e.target;
    setFormData((prevFormData) => {
      const updatedProducts = [...prevFormData.products];
      updatedProducts[index][field] = value;
      return { ...prevFormData, products: updatedProducts };
    });
  };

  const handleAddProduct = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      products: [
        ...prevFormData.products,
        { eurocode: "", amount: 1, price: 0 },
      ],
    }));
  };

  const handleRemoveProduct = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      products: prevFormData.products.filter((_, i) => i !== index),
    }));
  };

  const isSubmitDisabled =
    formData.products.length === 0 ||
    !formData.products.every(
      (product) =>
        product.eurocode.trim() !== "" &&
        product.amount > 0 &&
        product.price >= 0
    ) ||
    !formData.client.trim() ||
    (formData.client === "other" && formData.clientName.trim() === "");

  const handleSubmit = async () => {
    const { error } = orderValidationSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.path.join(".")] = detail.message;
      });
      setErrors(validationErrors);
      console.error("Validation errors:", validationErrors);
      return;
    }

    setErrors({});

    const endpoint = isEdit ? `/api/orders/${order._id}` : "/api/orders";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert.error(`Error: ${result.error}`);
        console.error("Request failed:", result.error);
        return;
      }

      if (isEdit) {
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o._id === result._id ? result : o))
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
          {/* Client & Client Name */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      client: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientName: e.target.value,
                    }))
                  }
                  error={!!errors.clientName}
                  helperText={errors.clientName || ""}
                  fullWidth
                />
              </Box>
            )}
          </Box>

          {/* Products */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: "column",
              flexWrap: "nowrap",
              p: 2,
              pr: 1,
              pt: 1,
              mt: 1,
              borderRadius: 1,
              border: "1px solid var(--primary)",
              position: "relative",
            }}
          >
            <Typography
              variant="textFieldLabel"
              sx={{
                position: "absolute",
                top: -12,
                left: 12,
                backgroundColor: "var(--white)",
                color: "var(--primary)",
                px: 1,
                fontWeight: 600,
              }}
            >
              Products
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: 1,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {formData.products.map((product, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    gap: 1,
                    pr: 1,
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flexDirection: "row",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      flexDirection: isMobile || isTablet ? "column" : "row",
                      flexWrap: "wrap",
                    }}
                  >
                    <TextField
                      size="small"
                      type="text"
                      fullWidth
                      label="Eurocode"
                      name={`products[${index}].eurocode`}
                      value={product.eurocode}
                      onChange={(e) => handleChange(e, index, "eurocode")}
                      error={!!errors[`products.${index}.eurocode`]}
                      helperText={errors[`products.${index}.eurocode`] || ""}
                      sx={{
                        width:
                          isMobile || isTablet ? "100%" : "calc(50% - 4px)",
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        flexWrap: "nowrap",
                        width:
                          isMobile || isTablet ? "100%" : "calc(50% - 4px)",
                      }}
                    >
                      <TextField
                        size="small"
                        type="number"
                        label="Amount"
                        value={product.amount}
                        onChange={(e) => {
                          const value = Math.max(1, Number(e.target.value));
                          handleChange({ target: { value } }, index, "amount");
                        }}
                        error={!!errors[`products.${index}.amount`]}
                        helperText={errors[`products.${index}.amount`] || ""}
                        sx={{ width: "40%" }}
                      />

                      <TextField
                        size="small"
                        type="number"
                        label="Price"
                        value={product.price}
                        onChange={(e) => {
                          const value = Math.max(0, Number(e.target.value));
                          handleChange({ target: { value } }, index, "price");
                        }}
                        error={!!errors[`products.${index}.price`]}
                        helperText={errors[`products.${index}.price`] || ""}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                €
                              </InputAdornment>
                            ),
                          },
                        }}
                        sx={{ width: "60%" }}
                      />
                    </Box>
                  </Box>

                  <IconButton
                    onClick={() => handleRemoveProduct(index)}
                    disabled={formData.products.length === 1}
                    sx={{
                      p: 0,
                      color: "var(--error)",
                      "&:hover": { color: "var(--error-onhover)" },
                    }}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Button
              onClick={handleAddProduct}
              startIcon={<AddCircleIcon />}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Add Product
            </Button>
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
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              error={!!errors.notes}
              helperText={errors.notes || ""}
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
            startIcon={<DoneIcon />}
            disabled={isSubmitDisabled}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OrderModal;
