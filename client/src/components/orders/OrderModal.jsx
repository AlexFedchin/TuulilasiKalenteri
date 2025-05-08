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
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import BusinessIcon from "@mui/icons-material/Business";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useAuth } from "../../context/AuthContext";
import { alert } from "../../utils/alert";
import { clients } from "../../utils/clients";
import useScreenSize from "../../hooks/useScreenSize";
import { useTranslation } from "react-i18next";
import { orderValidationSchema } from "../../validation/orderValidationSchema";

const OrderModal = ({ onClose, order, setOrders }) => {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useScreenSize();
  const { token } = useAuth();
  const isEdit = !!order;
  console.log("Order:", order);

  const [formData, setFormData] = useState({
    products: order?.products.map(({ eurocode, amount, price, status }) => ({
      eurocode,
      amount,
      tmpAmount: amount,
      price,
      tmpPrice: price,
      status,
    })) || [
      {
        eurocode: "",
        amount: 1,
        tmpAmount: 1,
        price: 0,
        tmpPrice: 0,
        status: "inStock",
      },
    ],
    client: order?.client || clients[0].value,
    clientName: order?.clientName || "",
    notes: order?.notes || "",
  });
  const [submitting, setSubmitting] = useState(false);
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
        {
          eurocode: "",
          amount: 1,
          tmpAmount: 1,
          price: 0,
          tmpPrice: 0,
          status: "inStock",
        },
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

  // Submit function
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    // Clean products array by removing tmp fields
    const cleanedProducts = formData.products.map(
      ({ eurocode, amount, price, status }) => ({
        eurocode,
        amount,
        price,
        status,
      })
    );

    // Create cleaned formData to send
    const payload = {
      ...formData,
      products: cleanedProducts,
    };

    const { error } = orderValidationSchema.validate(payload, {
      abortEarly: false,
    });

    if (error) {
      const validationErrors = {};
      error.details.forEach((detail) => {
        validationErrors[detail.path.join(".")] = detail.message;
      });
      setErrors(validationErrors);

      setSubmitting(false);
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
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("alert.unexpectedError"));
      }

      if (isEdit) {
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o._id === result._id ? result : o))
        );
        alert.success(t("alert.orderUpdateSuccess"));
      } else {
        setOrders((prev) => [result, ...prev]);
        alert.success(t("alert.orderCreteSuccess"));
      }

      onClose();
    } catch (error) {
      alert.error(
        `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
      );
      console.error("Request failed:", error);
    } finally {
      setSubmitting(false);
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
          p: isMobile ? 2 : 3,
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
            {isEdit ? t("orderModal.titleEdit") : t("orderModal.titleNew")}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 0 }}
            disabled={submitting}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pr: 1,
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          {/* Client & Client Name */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ mb: "-5px", flexGrow: 1 }}>
              <Typography variant="textFieldLabel">
                <BusinessIcon fontSize="small" />
                {t("orderModal.client")}
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
                  {t("orderModal.clientName")}
                </Typography>
                <TextField
                  placeholder={t("orderModal.clientName")}
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
              p: isMobile ? 1 : 2,
              pr: isMobile ? 0.5 : 1,
              pt: isMobile ? 1 : 2,
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
              {t("orderModal.products")} ({formData.products.length})
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: 1,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {formData.products.map((product, index) => (
                <React.Fragment key={index}>
                  <Box
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
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          flexWrap: "nowrap",
                          width: "100%",
                        }}
                      >
                        <TextField
                          size="small"
                          type="text"
                          fullWidth
                          label={t("orderModal.eurocode")}
                          name={`products[${index}].eurocode`}
                          value={product.eurocode}
                          onChange={(e) => handleChange(e, index, "eurocode")}
                          error={!!errors[`products.${index}.eurocode`]}
                          helperText={
                            errors[`products.${index}.eurocode`] || ""
                          }
                        />
                        <TextField
                          size="small"
                          type="number"
                          label={t("orderModal.amount")}
                          value={product.tmpAmount}
                          onChange={(e) => {
                            handleChange(
                              { target: { value: e.target.value } },
                              index,
                              "tmpAmount"
                            );
                          }}
                          onBlur={(e) => {
                            let value = 1;

                            if (e.target.value === "") {
                              value = 1;
                            } else {
                              value = Math.max(
                                Math.round(Number(e.target.value)),
                                1
                              );
                            }
                            handleChange(
                              { target: { value } },
                              index,
                              "amount"
                            );
                            handleChange(
                              { target: { value } },
                              index,
                              "tmpAmount"
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.target.blur();
                            }
                          }}
                          error={!!errors[`products.${index}.amount`]}
                          helperText={errors[`products.${index}.amount`] || ""}
                          sx={{ width: "40%" }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          width: "100%",
                          alignItems: isMobile ? "flex-start" : "center",
                          flexDirection: "row",
                        }}
                      >
                        <TextField
                          size="small"
                          type="number"
                          label={t("orderModal.price")}
                          value={product.tmpPrice}
                          sx={{
                            flexGrow: 1,
                            flexShrink: 0,
                            width: isMobile || isTablet ? "40%" : "60%",
                          }}
                          onChange={(e) => {
                            handleChange(
                              { target: { value: e.target.value } },
                              index,
                              "tmpPrice"
                            );
                          }}
                          onBlur={(e) => {
                            let value = 0;

                            if (e.target.value === "") {
                              value = 0;
                            } else {
                              value = Math.max(
                                Math.round(Number(e.target.value)),
                                0
                              );
                            }
                            handleChange({ target: { value } }, index, "price");
                            handleChange(
                              { target: { value } },
                              index,
                              "tmpPrice"
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.target.blur();
                            }
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
                        />
                        <ToggleButtonGroup
                          size="small"
                          value={product.status}
                          exclusive
                          onChange={(e) => {
                            handleChange(
                              { target: { value: e.target.value } },
                              index,
                              "status"
                            );
                          }}
                          sx={{
                            flexShrink: 0,
                          }}
                        >
                          <ToggleButton value="inStock" sx={{ flexShrink: 0 }}>
                            {t("orderModal.inStock")}
                          </ToggleButton>
                          <ToggleButton
                            value="order"
                            sx={{
                              flexShrink: 0,
                              "&.Mui-selected": {
                                backgroundColor: "var(--error)",
                                color: "var(--white)",
                                "&:hover": {
                                  backgroundColor: "var(--error-onhover)",
                                },
                              },
                            }}
                          >
                            {t("orderModal.order")}
                          </ToggleButton>
                        </ToggleButtonGroup>
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
                  {index < formData.products.length - 1 && (
                    <Divider sx={{ mr: 1 }} />
                  )}
                </React.Fragment>
              ))}
            </Box>

            <Button
              onClick={handleAddProduct}
              startIcon={<AddCircleIcon />}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              {t("orderModal.addProduct")}
            </Button>
          </Box>

          {/* Notes */}
          <Box>
            <Typography variant="textFieldLabel">
              <NotesIcon fontSize="small" />
              {t("orderModal.notes")}
            </Typography>
            <TextField
              size="small"
              fullWidth
              margin="none"
              type="text"
              placeholder={t("orderModal.notes")}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: isMobile || isTablet ? 1 : 2,
          }}
        >
          <Button
            onClick={onClose}
            variant="cancel"
            startIcon={<CloseIcon />}
            disabled={submitting}
            sx={{ flexGrow: isMobile || isTablet ? 1 : 0 }}
          >
            {t("orderModal.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="submit"
            startIcon={<DoneIcon />}
            loading={submitting}
            loadingPosition="start"
            disabled={isSubmitDisabled}
            sx={{ flexGrow: isMobile || isTablet ? 1 : 0 }}
          >
            {isEdit ? t("orderModal.update") : t("orderModal.create")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OrderModal;
