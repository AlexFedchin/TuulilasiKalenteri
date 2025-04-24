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
  Alert,
} from "@mui/material";
import AbcIcon from "@mui/icons-material/Abc";
import PhoneIcon from "@mui/icons-material/Phone";
import CarIcon from "@mui/icons-material/DirectionsCar";
import TagIcon from "@mui/icons-material/Tag";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import InsuranceIcon from "@mui/icons-material/RequestQuoteOutlined";
import PaymentIcon from "@mui/icons-material/Euro";
import DateIcon from "@mui/icons-material/CalendarMonth";
import DurationIcon from "@mui/icons-material/AccessTime";
import LocationIcon from "@mui/icons-material/LocationPin";
import NotesIcon from "@mui/icons-material/Notes";
import InsuranceCompanyIcon from "@mui/icons-material/AccountBalance";
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
    .pattern(/^[A-Z0-9]{1,4}[-\s]?[A-Z0-9]{1,4}[-\s]?[A-Z0-9]{0,4}$/)
    .min(2)
    .max(14)
    .required(),
  isWorkDone: Joi.boolean().required(),
  phoneNumber: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
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
      "other"
    )
    .when("payerType", {
      is: "insurance",
      then: Joi.required(),
      otherwise: Joi.allow(""),
    }),
  insuranceCompanyName: Joi.string()
    .min(2)
    .max(50)
    .when("payerType", {
      is: "insurance",
      then: Joi.when("insuranceCompany", {
        is: "other",
        then: Joi.required(),
        otherwise: Joi.allow(""),
      }),
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
  invoiceMade: Joi.boolean().required().default(false),
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
  const { isMobile, isTablet } = useScreenSize();
  if (date) {
    date = dayjs(date).format("YYYY-MM-DDTHH:mmZ");
  } else if (booking) {
    date = dayjs(booking?.date).format("YYYY-MM-DDTHH:mmZ");
  }

  const isEdit = !!booking;
  const isAdmin = user?.role === "admin";
  const isEditable = isAdmin || !dayjs(date).isBefore(dayjs(), "day");

  const validateFinnishPhoneNumber = (value) => {
    const finnishPhoneRegex =
      /^((04[0-9]{1})(\s?|-?)|050(\s?|-?)|0457(\s?|-?)|[+]?358(\s?|-?)50|0358(\s?|-?)50|00358(\s?|-?)50|[+]?358(\s?|-?)4[0-9]{1}|0358(\s?|-?)4[0-9]{1}|00358(\s?|-?)4[0-9]{1})(\s?|-?)(([0-9]{3,4})(\s|-)?[0-9]{1,4})$/;
    return !finnishPhoneRegex.test(value) && value.length >= 10;
  };
  const validateEuropeanPlateNumber = (value) => {
    const finnishPlateRegex = /^[A-ZÄÖÅ]{2,3}-[0-9]{1,3}$/;
    const swedishPlateRegex = /^[A-Z]{3}[0-9]{2}[0-9A-Z]{1}$/;
    const estonianPlateRegex = /^[0-9]{3}\s?[A-Z]{3}$|^[A-Z]{2}\s?[0-9]{3}$/;

    return (
      !finnishPlateRegex.test(value) &&
      !swedishPlateRegex.test(value) &&
      !estonianPlateRegex.test(value) &&
      value.length >= 5
    );
  };

  const insuranceCompanies = [
    {
      name: "Pohjola Vakuutus",
      value: "pohjolaVakuutus",
      logo: "/insurance-companies-logos/pohjola-logo.webp",
    },
    {
      name: "LähiTapiola-ryhmä",
      value: "lahiTapiola",
      logo: "/insurance-companies-logos/lahitapiola-logo.webp",
    },
    {
      name: "If Vahinkovakuutus Oyj",
      value: "ifVakuutus",
      logo: "/insurance-companies-logos/if-logo.webp",
    },
    {
      name: "Fennia",
      value: "fennia",
      logo: "/insurance-companies-logos/fennia-logo.webp",
    },
    {
      name: "Turva",
      value: "turva",
      logo: "/insurance-companies-logos/turva-logo.webp",
    },
    {
      name: "Pohjantähti",
      value: "pohjantahti",
      logo: "/insurance-companies-logos/pohjantahti-logo.webp",
    },
    {
      name: "Alandia",
      value: "alandia",
      logo: "/insurance-companies-logos/alandia-logo.webp",
    },
    { name: "Other", value: "other" },
  ];
  const clientTypes = [
    {
      name: "Private Client",
      value: "private",
      icon: <PersonIcon fontSize="small" />,
    },
    {
      name: "Business Client",
      value: "company",
      icon: <BusinessIcon fontSize="small" />,
    },
  ];
  const payerTypes = [
    {
      name: "Person",
      value: "person",
      icon: <PersonIcon fontSize="small" />,
    },
    {
      name: "Business",
      value: "company",
      icon: <BusinessIcon fontSize="small" />,
    },
    {
      name: "Insurance Company",
      value: "insurance",
      icon: <InsuranceCompanyIcon fontSize="small" />,
    },
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
    clientType: booking?.clientType || "private",
    payerType: booking?.payerType || "person",
    insuranceCompany: booking?.insuranceCompany || "pohjolaVakuutus",
    insuranceCompanyName: booking?.insuranceCompanyName || "",
    insuranceNumber: booking?.insuranceNumber || "",
    date: dayjs(date).format("YYYY-MM-DDTHH:mmZ"),
    duration: booking?.duration || 1,
    notes: booking?.notes || "",
    location: booking?.location || location || "",
    invoiceMade: booking?.invoiceMade || false,
  });
  const [locations, setLocations] = useState([]);
  const [finnishPhoneNumberWarning, setFinnishPhoneNumberWarning] = useState(
    validateFinnishPhoneNumber(formData.phoneNumber)
  );
  const [europeanPlateNumberWarning, setEuropeanPlateNumberWarning] = useState(
    validateEuropeanPlateNumber(formData.plateNumber)
  );

  // Soft check to disable submit button
  const isSubmitDisabled = !(
    // Check if the text fields are not empty
    (
      formData.plateNumber &&
      formData.phoneNumber &&
      formData.carModel &&
      formData.eurocode &&
      formData.clientType &&
      formData.payerType &&
      formData.date &&
      formData.duration &&
      // Check if warehouseLocation is provided when inStock is true
      !(formData.inStock && !formData.warehouseLocation) &&
      !(
        formData.payerType === "insurance" &&
        (!formData.insuranceNumber || !formData.insuranceCompany)
      ) &&
      !(
        formData.payerType === "insurance" &&
        formData.insuranceCompany === "other" &&
        !formData.insuranceCompanyName
      )
    )
  );

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
        updatedData.insuranceCompanyName = "";
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.insuranceNumber;
          delete updatedErrors.insuranceCompanyName;
          delete updatedErrors.insuranceCompany;
          return updatedErrors;
        });
      }

      if (name === "insuranceCompany" && value !== "other") {
        updatedData.insuranceCompanyName = "";
        setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors.insuranceCompanyName;
          return updatedErrors;
        });
      }

      if (name === "payerType" && value === "insurance") {
        updatedData.insuranceCompany = insuranceCompanies[0].value;
        updatedData.insuranceNumber = "";
        updatedData.insuranceCompanyName = "";
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

      // Validate phone number to be finnish
      if (name === "phoneNumber") {
        setFinnishPhoneNumberWarning(validateFinnishPhoneNumber(value));
      }

      // Validate plate number to be european
      if (name === "plateNumber") {
        setEuropeanPlateNumberWarning(validateEuropeanPlateNumber(value));
        updatedData.plateNumber = value.toUpperCase();
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
          setLocations(data);
          if (!isEdit && !formData.location) {
            setFormData((prev) => ({
              ...prev,
              location: data[0]?._id || "",
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    if (user.role === "admin") {
      fetchLocations();
    }
  }, [token, user.role, isEdit]);

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

  // Deleting a booking
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(calc(-50% - 8px), -50%)",
          width: "50%",
          minWidth: "min(350px, calc(100% - 16px))",
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
          mx: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
          }}
        >
          <Typography variant="h4">
            {isEdit ? "Edit Booking" : "New Booking"}
          </Typography>
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
            pr: 2,
            pb: 2,
          }}
        >
          {/* Plate number & is work done */}
          <Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="textFieldLabel">
                  <AbcIcon fontSize="small" />
                  Plate number
                </Typography>
                <TextField
                  size="small"
                  disabled={!isEditable}
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
                {europeanPlateNumberWarning && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    This license plate doesn't look like a regular Finnish,
                    Swedish or Estonian plate number. Please, check it to make
                    sure it is correct.
                  </Alert>
                )}
              </Box>
              <Box
                sx={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="textFieldLabel">Work done</Typography>
                <Switch
                  name="isWorkDone"
                  checked={formData["isWorkDone"] || false}
                  disabled={!isEditable}
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
            <Typography variant="textFieldLabel">
              <PhoneIcon fontSize="small" />
              Phone number
            </Typography>
            <TextField
              size="small"
              fullWidth
              disabled={!isEditable}
              margin="none"
              type="phone"
              placeholder="040 123 4567"
              name="phoneNumber"
              value={formData["phoneNumber"]}
              onChange={handleChange}
              error={!!errors["phoneNumber"]}
              helperText={errors["phoneNumber"] || ""}
            />
            {finnishPhoneNumberWarning && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                This phone number doesn't look like regular Finnish phone
                number. Please, check it to make sure it is correct.
              </Alert>
            )}
          </Box>

          {/* Car model */}
          <Box>
            <Typography variant="textFieldLabel">
              <CarIcon fontSize="small" />
              Car model
            </Typography>
            <TextField
              size="small"
              fullWidth
              disabled={!isEditable}
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
            <Typography variant="textFieldLabel">
              <TagIcon fontSize="small" />
              Eurocode
            </Typography>
            <TextField
              size="small"
              fullWidth
              margin="none"
              disabled={!isEditable}
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
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="textFieldLabel">In stock</Typography>
              <Switch
                checked={formData["inStock"] || false}
                name="inStock"
                disabled={!isEditable}
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
              <Typography variant="textFieldLabel">
                <WarehouseIcon fontSize="small" />
                Location in warehouse
              </Typography>
              <TextField
                size="small"
                fullWidth
                disabled={!formData["inStock"] || !isEditable}
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
            <Typography variant="textFieldLabel">
              <PersonIcon fontSize="small" />
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
                value={formData["clientType"]}
                onChange={handleChange}
                disabled={!isEditable}
              >
                {clientTypes.map((client) => (
                  <MenuItem
                    key={client.value}
                    value={client.value}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {client.icon}
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors["clientType"] || ""}</FormHelperText>
            </FormControl>
          </Box>

          {/* Payer */}
          <Box>
            <Typography variant="textFieldLabel">
              <PaymentIcon fontSize="small" />
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
                value={formData["payerType"]}
                onChange={handleChange}
                disabled={!isEditable}
              >
                {payerTypes.map((payer) => (
                  <MenuItem
                    key={payer.value}
                    value={payer.value}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {payer.icon}
                    {payer.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors["payerType"] || ""}</FormHelperText>
            </FormControl>
          </Box>

          {/* Insurance company, insurance company name & insurance number */}
          {formData["payerType"] === "insurance" ? (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="textFieldLabel">
                  <InsuranceCompanyIcon fontSize="small" />
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
                    onChange={handleChange}
                    value={formData["insuranceCompany"]}
                    disabled={!isEditable}
                  >
                    {insuranceCompanies.map((company) => (
                      <MenuItem
                        value={company.value}
                        key={company.value}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {company.logo && (
                          <Box
                            component="img"
                            src={company.logo}
                            sx={{
                              width: "auto",
                              height: "auto",
                              maxWidth: "24px",
                            }}
                          />
                        )}

                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors["payer"] || ""}</FormHelperText>
                </FormControl>
              </Box>

              {formData["insuranceCompany"] === "other" && (
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="textFieldLabel">
                    <InsuranceCompanyIcon fontSize="small" />
                    Insurance company name
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    margin="none"
                    disabled={!isEditable}
                    type="text"
                    placeholder="Insurance company name"
                    name="insuranceCompanyName"
                    value={formData["insuranceCompanyName"]}
                    onChange={handleChange}
                    error={!!errors["insuranceCompanyName"]}
                    helperText={errors["insuranceCompanyName"] || ""}
                  />
                </Box>
              )}

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="textFieldLabel">
                  <InsuranceIcon fontSize="small" />
                  Insurance number
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  margin="none"
                  type="text"
                  disabled={!isEditable}
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
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: "-5px" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="textFieldLabel">
                  <DateIcon fontSize="small" />
                  Date & Time
                </Typography>
                <DateTimePicker
                  format="DD.MM.YYYY HH:mm"
                  value={dayjs(formData["date"])}
                  disabled={!isEditable}
                  onChange={(newValue) =>
                    handleChange({
                      target: {
                        name: "date",
                        value: dayjs(newValue).format("YYYY-MM-DDTHH:mmZ"),
                      },
                    })
                  }
                  ampm={false}
                  minDate={isAdmin ? undefined : dayjs().startOf("day")}
                  minTime={dayjs().startOf("day").add(8, "hour")}
                  maxTime={dayjs()
                    .startOf("day")
                    .add(15, "hour")
                    .add(30, "minute")}
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
                <Typography variant="textFieldLabel">
                  <DurationIcon fontSize="small" />
                  Duration
                </Typography>
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errors["duration"]}
                >
                  <Select
                    name="duration"
                    value={formData["duration"]}
                    onChange={handleChange}
                    disabled={!isEditable}
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

          {/* Location */}
          {isAdmin && (
            <Box>
              <Typography variant="textFieldLabel">
                <LocationIcon fontSize="small" />
                Location
              </Typography>
              <FormControl
                fullWidth
                size="small"
                error={!!errors["location"]}
                sx={{ mb: "-5px" }}
              >
                <Select
                  name="location"
                  onChange={handleChange}
                  value={formData["location"]}
                  disabled={!isEditable}
                >
                  {locations.map((location) => (
                    <MenuItem
                      value={location._id}
                      key={location._id}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      {location.title}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors["location"] || ""}</FormHelperText>
              </FormControl>
            </Box>
          )}

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
              disabled={!isEditable}
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
        {isEditable && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isMobile || isTablet ? "column-reverse" : "row",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
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
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: isMobile || isTablet ? "center" : "flex-end",
                flexGrow: 1,
              }}
            >
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
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
              >
                {isEdit ? "Update" : "Create"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default BookingModal;
