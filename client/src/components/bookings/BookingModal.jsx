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
  InputAdornment,
} from "@mui/material";
import AbcIcon from "@mui/icons-material/Abc";
import PhoneIcon from "@mui/icons-material/Phone";
import CarIcon from "@mui/icons-material/DirectionsCar";
import TagIcon from "@mui/icons-material/Tag";
import PriceIcon from "@mui/icons-material/SellOutlined";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import InsuranceIcon from "@mui/icons-material/DescriptionOutlined";
import PaymentIcon from "@mui/icons-material/Euro";
import DeductibleIcon from "@mui/icons-material/PaymentsOutlined";
import DateIcon from "@mui/icons-material/CalendarMonth";
import DurationIcon from "@mui/icons-material/AccessTime";
import LocationIcon from "@mui/icons-material/LocationPin";
import NotesIcon from "@mui/icons-material/Notes";
import InsuranceCompanyIcon from "@mui/icons-material/AccountBalance";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import dayjs from "dayjs";
import "dayjs/locale/fi";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useScreenSize from "../../hooks/useScreenSize";
import { useAuth } from "../../context/AuthContext";
import { alert } from "../../utils/alert";
import { insuranceCompanies } from "../../utils/insuranceCompanies";
import { clientTypes } from "../../utils/clientTypes";
import { payerTypes } from "../../utils/payerTypes";
import { deductibleValues } from "../../utils/deductibleValues";
import { useTranslation } from "react-i18next";
import { bookingValidationSchema } from "../../validation/bookingValidationSchema";
import { validateEuropeanPlateNumber } from "../../validation/validateEuropeanPlateNumber";
import { validateFinnishPhoneNumber } from "../../validation/validateFinnishPhoneNumber";

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
  const { t, i18n } = useTranslation();
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    weekStart: 1,
  });
  dayjs.locale(i18n.language);

  // Figure out the initial date
  if (date) {
    date = dayjs(date).format("YYYY-MM-DDTHH:mmZ");
  } else if (booking) {
    date = dayjs(booking?.date).format("YYYY-MM-DDTHH:mmZ");
  } else {
    let nearestDate = dayjs().add(1, "day").hour(8).minute(0);

    let nearestWorkday = nearestDate;
    if (nearestDate.day() === 6) {
      nearestWorkday = nearestDate.add(2, "day");
    } else if (nearestDate.day() === 0) {
      nearestWorkday = nearestDate.add(1, "day");
    }
    const localDate = dayjs.tz(nearestWorkday, "Europe/Helsinki");
    date = localDate.format("YYYY-MM-DDTHH:mmZ");
  }

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = !!booking;
  const isAdmin = user?.role === "admin";
  const isEditable =
    (isAdmin || !dayjs(date).isBefore(dayjs(), "day")) &&
    !submitting &&
    !deleting;
  const isSubmittable = isAdmin || !dayjs(date).isBefore(dayjs(), "day");

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    plateNumber: booking?.plateNumber || "",
    isWorkDone: booking?.isWorkDone || false,
    phoneNumber: booking?.phoneNumber || "",
    carModel: booking?.carModel || "",
    eurocode: booking?.eurocode || "",
    price: booking?.price || 0,
    inStock: booking?.inStock || false,
    warehouseLocation: booking?.warehouseLocation || "",
    isOrdered: booking?.isOrdered || false,
    clientType: booking?.clientType || "private",
    companyName: booking?.companyName || "",
    payerType: booking?.payerType || "person",
    insuranceCompany: booking?.insuranceCompany || "pohjolaVakuutus",
    insuranceCompanyName: booking?.insuranceCompanyName || "",
    insuranceNumber: booking?.insuranceNumber || "",
    deductible: booking?.deductible || 0,
    date: dayjs(date).format("YYYY-MM-DDTHH:mmZ"),
    duration: booking?.duration || 1,
    notes: booking?.notes || "",
    location: booking?.location || location || "",
    invoiceMade: booking?.invoiceMade || false,
  });
  const [tmpPrice, setTmpPrice] = useState(formData["price"]);
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

  // Handle form data changes
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

      if (name === "price") {
        updatedData.price = Math.max(Math.round(Number(value)), 0);
        setTmpPrice(Math.max(Math.round(Number(value)), 0));
      }

      return updatedData;
    });
  };

  // Fetch locations on mount if user is admin
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
          if (!isEdit && !booking && !formData.location) {
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

    if (user.role === "admin" && locations?.length === 0) {
      fetchLocations();
    }
  }, [token, user.role, isEdit, booking, formData.location, locations?.length]);

  // Submit function
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const { error } = bookingValidationSchema.validate(formData, {
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
        throw new Error(result.error || t("alert.unexpectedError"));
      }

      if (isEdit) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === result._id ? result : booking
          )
        );
        alert.success(t("alert.bookingEditSuccess"));
      } else {
        setBookings((prev) => [result, ...prev]);
        alert.success(t("alert.bookingCreateSuccess"));
      }

      onClose();
    } catch (error) {
      alert.error(`${t("alert.error")}: ${error.message}`);
      console.error("Request failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Deleting a booking
  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/bookings/${booking._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("alert.unexpectedError"));
      }

      const deletedBookingId = data.deletedBookingId;

      setBookings((prevBookings) =>
        prevBookings.filter((note) => note._id !== deletedBookingId)
      );

      alert.success(t("alert.bookingDeleteSuccess"));

      onClose();
    } catch (error) {
      alert.error(
        `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
      );
      console.error("Request failed:", error);
    } finally {
      setDeleting(false);
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
            {isEdit ? t("bookingModal.titleEdit") : t("bookingModal.titleNew")}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 0 }}
            disabled={submitting || deleting}
          >
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
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="textFieldLabel">
                <AbcIcon fontSize="small" />
                {t("bookingModal.plateNumber")}
              </Typography>
              <TextField
                size="small"
                disabled={!isEditable}
                fullWidth
                margin="none"
                type="text"
                placeholder={t("bookingModal.plateNumberPlaceholder")}
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
              <Typography variant="textFieldLabel">
                {t("bookingModal.workDone")}
              </Typography>
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
          {europeanPlateNumberWarning && (
            <Alert severity="warning" sx={{ mt: -1 }}>
              {t("bookingModal.plateNumberWarning")}
            </Alert>
          )}

          {/* Phone number */}
          <Box>
            <Typography variant="textFieldLabel">
              <PhoneIcon fontSize="small" />
              {t("bookingModal.phoneNumber")}
            </Typography>
            <TextField
              size="small"
              fullWidth
              disabled={!isEditable}
              margin="none"
              type="phone"
              placeholder={t("bookingModal.phoneNumberPlaceholder")}
              name="phoneNumber"
              value={formData["phoneNumber"]}
              onChange={handleChange}
              error={!!errors["phoneNumber"]}
              helperText={errors["phoneNumber"] || ""}
            />
            {finnishPhoneNumberWarning && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                {t("bookingModal.phoneNumberWarning")}
              </Alert>
            )}
          </Box>

          {/* Car model */}
          <Box>
            <Typography variant="textFieldLabel">
              <CarIcon fontSize="small" />
              {t("bookingModal.carModel")}
            </Typography>
            <TextField
              size="small"
              fullWidth
              disabled={!isEditable}
              margin="none"
              type="text"
              placeholder={t("bookingModal.carModelPlaceholder")}
              name="carModel"
              value={formData["carModel"]}
              onChange={handleChange}
              error={!!errors["carModel"]}
              helperText={errors["carModel"] || ""}
            />
          </Box>

          {/* Eurocode */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="textFieldLabel">
                <TagIcon fontSize="small" />
                {t("bookingModal.eurocode")}
              </Typography>
              <TextField
                size="small"
                fullWidth
                margin="none"
                disabled={!isEditable}
                type="text"
                placeholder={t("bookingModal.eurocodePlaceholder")}
                name="eurocode"
                value={formData["eurocode"].toUpperCase()}
                onChange={handleChange}
                error={!!errors["eurocode"]}
                helperText={errors["eurocode"] || ""}
              />
            </Box>
            <Box sx={{ width: "40%" }}>
              <Typography variant="textFieldLabel">
                <PriceIcon fontSize="small" />
                {t("bookingModal.price")}
              </Typography>
              <TextField
                size="small"
                fullWidth
                margin="none"
                disabled={!isEditable}
                type="number"
                placeholder={t("bookingModal.pricePlaceholder")}
                name="price"
                value={tmpPrice}
                onChange={(e) => {
                  setTmpPrice(e.target.value);
                }}
                onBlur={(e) => {
                  let value = 0;

                  if (e.target.value === "") {
                    value = 0;
                  } else {
                    value = Number(e.target.value);
                  }

                  handleChange({ target: { name: "price", value } });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.target.blur();
                  }
                }}
                error={!!errors["price"]}
                helperText={errors["price"] || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">€</InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* In stock, Location in warehouse & is ordered */}
          <Box sx={{ display: "flex", gap: isMobile ? 1 : 2 }}>
            <Box
              sx={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="textFieldLabel">
                {t("bookingModal.inStock")}
              </Typography>
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

            <Box sx={{ flexGrow: 1, flexShrink: 1, overflow: "hidden" }}>
              <Typography
                variant="textFieldLabel"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <WarehouseIcon fontSize="small" />
                <Box
                  component="span"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("bookingModal.warehouseLocation")}
                </Box>
              </Typography>

              <TextField
                size="small"
                fullWidth
                disabled={!formData["inStock"] || !isEditable}
                margin="none"
                type="text"
                placeholder={t("bookingModal.warehouseLocationPlaceholder")}
                name="warehouseLocation"
                value={formData["warehouseLocation"]}
                onChange={handleChange}
                error={!!errors["warehouseLocation"]}
                helperText={errors["warehouseLocation"] || ""}
              />
            </Box>

            {!formData["inStock"] && (
              <Box
                sx={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="textFieldLabel">
                  {t("bookingModal.ordered")}
                </Typography>
                <Switch
                  checked={formData["isOrdered"] || false}
                  name="isOrdered"
                  disabled={!isEditable}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      isOrdered: e.target.checked,
                    }));
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Client type & Company name*/}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="textFieldLabel">
                <PersonIcon fontSize="small" />
                {t("bookingModal.client")}
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

            {formData["clientType"] === "company" && (
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="textFieldLabel">
                  <BusinessIcon fontSize="small" />
                  {t("bookingModal.companyName")}
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  disabled={!isEditable}
                  margin="none"
                  type="text"
                  placeholder={t("bookingModal.companyNamePlaceholder")}
                  name="companyName"
                  value={formData["companyName"]}
                  onChange={handleChange}
                  error={!!errors["companyName"]}
                  helperText={errors["companyName"] || ""}
                />
              </Box>
            )}
          </Box>

          {/* Payer */}
          <Box>
            <Typography variant="textFieldLabel">
              <PaymentIcon fontSize="small" />
              {t("bookingModal.payer")}
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

          {/* Insurance company, insurance company name, insurance number, deductible */}
          {formData["payerType"] === "insurance" ? (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {/* Insurance Company */}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="textFieldLabel">
                  <InsuranceCompanyIcon fontSize="small" />
                  {t("bookingModal.insuranceCompany")}
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

              {/* Insurance Number */}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="textFieldLabel">
                  <InsuranceIcon fontSize="small" />
                  {t("bookingModal.insuranceNumber")}
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  margin="none"
                  type="text"
                  disabled={!isEditable}
                  placeholder={t("bookingModal.insuranceNumberPlaceholder")}
                  name="insuranceNumber"
                  value={formData["insuranceNumber"].toUpperCase()}
                  onChange={handleChange}
                  error={!!errors["insuranceNumber"]}
                  helperText={errors["insuranceNumber"] || ""}
                />
              </Box>

              {/* Deductible */}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="textFieldLabel">
                  <DeductibleIcon fontSize="small" />
                  {t("bookingModal.deductible")}
                </Typography>
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errors["deductible"]}
                  sx={{ mb: "-5px" }}
                >
                  <Select
                    name="deductible"
                    onChange={handleChange}
                    value={formData["deductible"]}
                    disabled={!isEditable}
                  >
                    {deductibleValues.map((deductible) => (
                      <MenuItem
                        value={deductible.value}
                        key={deductible.value}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {deductible.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors["deductible"] || ""}</FormHelperText>
                </FormControl>
              </Box>

              {/* Insurance Company Name */}
              {formData["insuranceCompany"] === "other" && (
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="textFieldLabel">
                    <InsuranceCompanyIcon fontSize="small" />
                    {t("bookingModal.insuranceCompanyName")}
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    margin="none"
                    disabled={!isEditable}
                    type="text"
                    placeholder={t(
                      "bookingModal.insuranceCompanyNamePlaceholder"
                    )}
                    name="insuranceCompanyName"
                    value={formData["insuranceCompanyName"]}
                    onChange={handleChange}
                    error={!!errors["insuranceCompanyName"]}
                    helperText={errors["insuranceCompanyName"] || ""}
                  />
                </Box>
              )}
            </Box>
          ) : null}

          {/* Date & Duration */}
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={i18n.language}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                mb: "-5px",
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="textFieldLabel">
                  <DateIcon fontSize="small" />
                  {t("bookingModal.dateTime")}
                </Typography>
                <DateTimePicker
                  format="DD.MM.YYYY HH:mm"
                  value={dayjs(formData["date"])}
                  readOnly={!isEditable}
                  sx={{
                    pointerEvents: isEditable ? "auto" : "none",
                  }}
                  onChange={(newValue) =>
                    handleChange({
                      target: {
                        name: "date",
                        value: dayjs(newValue).format("YYYY-MM-DDTHH:mmZ"),
                      },
                    })
                  }
                  shouldDisableDate={(date) => {
                    const day = date.day();
                    return day === 0 || day === 6;
                  }}
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
                      InputProps: {
                        sx: {
                          fontSize: isMobile
                            ? "0.9rem"
                            : isTablet
                            ? "0.95rem"
                            : "1rem",
                        },
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="textFieldLabel">
                  <DurationIcon fontSize="small" />
                  {t("bookingModal.duration")}
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
                          {val}{" "}
                          {val === 1
                            ? t("bookingModal.hour")
                            : t("bookingModal.hours")}
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
                {t("bookingModal.location")}
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
              {t("bookingModal.notes")}
            </Typography>
            <TextField
              size="small"
              fullWidth
              margin="none"
              type="text"
              placeholder={t("bookingModal.notesPlaceholder")}
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
        {isSubmittable && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isMobile || isTablet ? "column-reverse" : "row",
              gap: isMobile || isTablet ? 1 : 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ width: isMobile || isTablet ? "100%" : "auto" }}>
              {isEdit && (
                <Button
                  startIcon={<DeleteIcon />}
                  disabled={submitting}
                  loading={deleting}
                  loadingPosition="start"
                  variant="delete"
                  onClick={handleDelete}
                  sx={{ width: isMobile || isTablet ? "100%" : "auto" }}
                >
                  {t("bookingModal.delete")}
                </Button>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                width: isMobile || isTablet ? "100%" : "auto",
                gap: isMobile || isTablet ? 1 : 2,
                justifyContent: isMobile || isTablet ? "center" : "flex-end",
                flexGrow: 1,
              }}
            >
              <Button
                startIcon={<CloseIcon />}
                variant="cancel"
                disabled={submitting || deleting}
                onClick={onClose}
                sx={{ flexGrow: isMobile || isTablet ? 1 : 0 }}
              >
                {t("bookingModal.cancel")}
              </Button>
              <Button
                startIcon={<DoneIcon />}
                variant="submit"
                loading={submitting}
                loadingPosition="start"
                disabled={isSubmitDisabled || deleting}
                onClick={handleSubmit}
                sx={{ flexGrow: isMobile || isTablet ? 1 : 0 }}
              >
                {isEdit ? t("bookingModal.update") : t("bookingModal.create")}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default BookingModal;
