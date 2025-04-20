import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Divider,
  Switch,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import AbcIcon from "@mui/icons-material/Abc";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import Joi from "joi";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useScreenSize from "../hooks/useScreenSize";
import { useAuth } from "../context/AuthContext";
import { alert } from "../utils/alert";

const bookingValidationSchema = Joi.object({
  plateNumber: Joi.string()
    .pattern(/^[A-Za-z]{1,3}-[0-9]{1,3}$/)
    .min(2)
    .max(10)
    .required(),
  isWorkDone: Joi.boolean().required(),
  phoneNumber: Joi.string()
    .pattern(
      /^((04[0-9]{1})(\s?|-?)|050(\s?|-?)|0457(\s?|-?)|[+]?358(\s?|-?)50|0358(\s?|-?)50|00358(\s?|-?)50|[+]?358(\s?|-?)4[0-9]{1}|0358(\s?|-?)4[0-9]{1}|00358(\s?|-?)4[0-9]{1})(\s?|-?)(([0-9]{3,4})(\s|-)?[0-9]{1,4})$/
    )
    .min(10)
    .max(20)
    .required(),
  carModel: Joi.string().min(2).max(25).required(),
  eurocode: Joi.string().min(2).max(20).required(),
  inStock: Joi.boolean().required(),
  warehouseLocation: Joi.string()
    .min(2)
    .max(50)
    .when("inStock", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow(""),
    }),
  clientType: Joi.string().valid("private", "company").required(),
  payerType: Joi.string().valid("person", "company", "insurance").required(),
  insuranceCompany: Joi.string()
    .valid(
      "pohjolaVakuutus",
      "lahiTapiola",
      "ifVakuutus",
      "fennia",
      "turva",
      "pohjantahti",
      "alandia",
      "muu"
    )
    .when("payerType", {
      is: "insurance",
      then: Joi.required(),
      otherwise: Joi.allow(""),
    }),
  insuranceNumber: Joi.string()
    .min(5)
    .max(50)
    .when("payerType", {
      is: "insurance",
      then: Joi.required(),
      otherwise: Joi.allow(""),
    }),
  date: Joi.date().required(),
  duration: Joi.number().min(0.5).max(6).required(),
  notes: Joi.string().min(0).max(500).allow(""),
  location: Joi.string().length(24).hex().required().allow(""),
});

const BookingModal = ({
  open,
  onClose,
  booking,
  date = null,
  location,
  setBookings,
}) => {
  const { token, user } = useAuth();
  const { isMobile } = useScreenSize();
  if (date) {
    date = dayjs(date).format("YYYY-MM-DDTHH:mm");
  } else if (booking) {
    date = dayjs(booking?.date).format("YYYY-MM-DDTHH:mm");
  }

  const isEdit = !!booking;

  const insuranceCompanies = [
    { name: "Pohjola Vakuutus", value: "pohjolaVakuutus" },
    { name: "LähiTapiola-ryhmä", value: "lahiTapiola" },
    { name: "If Vahinkovakuutus Oyj", value: "ifVakuutus" },
    { name: "Fennia", value: "fennia" },
    { name: "Turva", value: "turva" },
    { name: "Pohjantähti", value: "pohjantahti" },
    { name: "Alandia", value: "alandia" },
    { name: "Muu", value: "muu" },
  ];
  const clientTypes = [
    { name: "Private Client", value: "private" },
    { name: "Company Client", value: "company" },
  ];
  const payerTypes = [
    { name: "Person", value: "person" },
    { name: "Company", value: "company" },
    { name: "Insurance Company", value: "insurance" },
  ];

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    plateNumber: booking?.plateNumber || "",
    isWorkDone: booking?.isWorkDone || false,
    phoneNumber: booking?.phoneNumber || "",
    carModel: booking?.carModel || "",
    eurocode: booking?.eurocode || "",
    inStock: booking?.inStock || false,
    warehouseLocation: booking?.warehouseLocation || "",
    clientType: booking?.client || "private",
    payerType: booking?.payer || "person",
    insuranceCompany: booking?.insuranceCompany || "pohjolaVakuutus",
    insuranceNumber: booking?.insuranceNumber || "",
    date: dayjs(date).format("YYYY-MM-DDTHH:mm"),
    duration: booking?.duration || 1,
    notes: booking?.notes || "",
    location: booking?.location || location || "",
  });

  console.log(formData.date);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedData = {
        ...prev,
        [name]: value,
      };

      // If payerType is changed and not "insurance", clear related fields
      if (name === "payerType" && value !== "insurance") {
        updatedData.insuranceNumber = "";
        updatedData.insuranceCompany = "";
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.insuranceNumber;
          delete updatedErrors.insuranceCompany;
          return updatedErrors;
        });
      }

      if (name === "payerType" && value === "insurance") {
        updatedData.insuranceCompany = insuranceCompanies[0].value;
        updatedData.insuranceNumber = "";
      }

      if (name === "inStock") {
        updatedData.warehouseLocation = value ? prev.warehouseLocation : "";
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          if (!value) {
            updatedErrors.warehouseLocation = "";
          }
          return updatedErrors;
        });
      }

      return updatedData;
    });
  };

  // Fetch locations if user is admin
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          console.error("Server error:", data.error);
          return;
        } else {
          setFormData((prev) => ({
            ...prev,
            location: data[0]?._id || "",
          }));
          console.log("Location set to:", data[0]?._id);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    if (user.role === "admin") {
      fetchLocations();
    }
  }, []);

  // Submit function
  const handleSubmit = async () => {
    const { error } = bookingValidationSchema.validate(formData, {
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
    const endpoint = isEdit ? `/api/bookings/${booking._id}` : "/api/bookings";
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
        return;
      }

      if (isEdit) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === result._id ? result : booking
          )
        );
        alert.success("Booking updated successfully!");
      } else {
        setBookings((prev) => [result, ...prev]);
        alert.success("Booking created successfully!");
      }

      onClose();
    } catch (err) {
      alert.error("Unexpected error occurred");
      console.error("Request failed:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/bookings/${booking._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        alert.error(`Error: ${data.error}`);
        console.error("Error deleting booking:", data.error);
        return;
      }

      const deletedBookingId = data.deletedBookingId;

      setBookings((prevBookings) =>
        prevBookings.filter((note) => note._id !== deletedBookingId)
      );

      alert.success("Booking deleted successfully!");

      onClose();
    } catch (err) {
      alert.error("Unexpected error occurred");
      console.error("Request failed:", err);
    }
  };

  const labelStyles = {
    fontWeight: "bold",
    color: "var(--off-black)",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    mb: 0.5,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          minWidth: "350px",
          maxWidth: "800px",
          bgcolor: "var(--white)",
          boxShadow: 24,
          p: isMobile ? 2 : 3,
          borderRadius: 2,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          gap: 2,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h4">
          {isEdit ? "Edit Booking" : "New Booking"}
        </Typography>

        <Divider sx={{ backgroundColor: "var(--off-white)" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
            maxHeight: "60vh",
            pr: 2,
            pb: 2,
          }}
        >
          {/* Plate number & is work done */}
          <Box>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" sx={labelStyles}>
                  <AbcIcon fontSize="small" />
                  Plate number
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  margin="none"
                  type="text"
                  placeholder="XXX-123"
                  name="plateNumber"
                  value={formData["plateNumber"].toUpperCase()}
                  onChange={handleChange}
                  error={!!errors["plateNumber"]}
                  helperText={errors["plateNumber"] || ""}
                />
              </Box>
              <Box
                sx={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h5" sx={labelStyles}>
                  Work done
                </Typography>
                <Switch
                  name="isWorkDone"
                  checked={formData["isWorkDone"] || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isWorkDone: e.target.checked,
                    }))
                  }
                />
              </Box>
            </Box>
          </Box>

          {/* Phone number */}
          <Box>
            <Typography variant="h5" sx={labelStyles}>
              Phone number
            </Typography>
            <TextField
              size="small"
              fullWidth
              margin="none"
              type="phone"
              placeholder="+358 40 123 4567"
              name="phoneNumber"
              value={formData["phoneNumber"]}
              onChange={handleChange}
              error={!!errors["phoneNumber"]}
              helperText={errors["phoneNumber"] || ""}
            />
          </Box>

          {/* Car model */}
          <Box>
            <Typography variant="h5" sx={labelStyles}>
              Car model
            </Typography>
            <TextField
              size="small"
              fullWidth
              margin="none"
              type="text"
              placeholder="Car model"
              name="carModel"
              value={formData["carModel"]}
              onChange={handleChange}
              error={!!errors["carModel"]}
              helperText={errors["carModel"] || ""}
            />
          </Box>

          {/* Eurocode */}
          <Box>
            <Typography variant="h5" sx={labelStyles}>
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

          {/* In stock & Location in warehouse */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box
              sx={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="h5" sx={labelStyles}>
                In stock?
              </Typography>
              <Switch
                checked={formData["inStock"] || false}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    inStock: e.target.checked,
                  }));
                  if (!e.target.checked) {
                    setFormData((prev) => ({
                      ...prev,
                      warehouseLocation: "",
                    }));
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      warehouseLocation: "",
                    }));
                  }
                }}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={labelStyles}>
                Location in warehouse
              </Typography>
              <TextField
                size="small"
                fullWidth
                disabled={!formData["inStock"]}
                margin="none"
                type="text"
                placeholder="Location in warehouse"
                name="warehouseLocation"
                value={formData["warehouseLocation"]}
                onChange={handleChange}
                error={!!errors["warehouseLocation"]}
                helperText={errors["warehouseLocation"] || ""}
              />
            </Box>
          </Box>

          {/* Client */}
          <Box>
            <Typography variant="h5" sx={labelStyles}>
              Client
            </Typography>
            <FormControl
              fullWidth
              size="small"
              error={!!errors["clientType"]}
              sx={{ mb: "-5px" }}
            >
              <Select
                name="clientType"
                defaultValue="private"
                onChange={handleChange}
              >
                {clientTypes.map((client) => (
                  <MenuItem key={client.value} value={client.value}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors["clientType"] || ""}</FormHelperText>
            </FormControl>
          </Box>

          {/* Payer */}
          <Box>
            <Typography variant="h5" sx={labelStyles}>
              Payer
            </Typography>
            <FormControl
              fullWidth
              size="small"
              error={!!errors["payerType"]}
              sx={{ mb: "-5px" }}
            >
              <Select
                name="payerType"
                defaultValue="person"
                onChange={handleChange}
              >
                {payerTypes.map((payer) => (
                  <MenuItem key={payer.value} value={payer.value}>
                    {payer.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors["payerType"] || ""}</FormHelperText>
            </FormControl>
          </Box>

          {/* Insurance company & number */}
          {formData["payerType"] === "insurance" ? (
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" sx={labelStyles}>
                  Insurance company
                </Typography>
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errors["insuranceCompany"]}
                  sx={{ mb: "-5px" }}
                >
                  <Select
                    name="insuranceCompany"
                    defaultValue="pohjolaVakuutus"
                    onChange={handleChange}
                  >
                    {insuranceCompanies.map((company) => (
                      <MenuItem value={company.value}>{company.name}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors["payer"] || ""}</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" sx={labelStyles}>
                  Insurance number
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  margin="none"
                  type="text"
                  placeholder="Insurance number"
                  name="insuranceNumber"
                  value={formData["insuranceNumber"].toUpperCase()}
                  onChange={handleChange}
                  error={!!errors["insuranceNumber"]}
                  helperText={errors["insuranceNumber"] || ""}
                />
              </Box>
            </Box>
          ) : null}

          {/* Date & Duration */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" sx={labelStyles}>
                  Date & Time
                </Typography>
                <DateTimePicker
                  format="DD.MM.YYYY hh:mm"
                  value={dayjs(formData["date"])}
                  onChange={(newValue) =>
                    handleChange({
                      target: {
                        name: "date",
                        value: dayjs(newValue).format("YYYY-MM-DDTHH:mm"),
                      },
                    })
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      variant: "outlined",
                      error: !!errors["date"],
                      helperText: errors["date"] || "",
                    },
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" sx={labelStyles}>
                  Duration
                </Typography>
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errors["duration"]}
                >
                  <Select
                    name="duration"
                    defaultValue={1}
                    onChange={handleChange}
                  >
                    {[...Array(12)].map((_, i) => {
                      const val = 0.5 + i * 0.5;
                      return (
                        <MenuItem key={val} value={val}>
                          {val} {val === 1 ? "hour" : "hours"}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>{errors["duration"] || ""}</FormHelperText>
                </FormControl>
              </Box>
            </Box>
          </LocalizationProvider>

          {/* Notes */}
          <Box>
            <Typography variant="h5" sx={labelStyles}>
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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            {isEdit && (
              <Button
                startIcon={<DeleteIcon />}
                variant="cancel"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              startIcon={<CloseIcon />}
              variant="cancel"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              startIcon={<DoneIcon />}
              variant="submit"
              onClick={handleSubmit}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default BookingModal;
