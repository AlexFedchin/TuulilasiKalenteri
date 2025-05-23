import React, { useEffect, useState } from "react";
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
  Alert,
  InputAdornment,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import LocationIcon from "@mui/icons-material/LocationPin";
import PasswordIcon from "@mui/icons-material/Lock";
import RoleIcon from "@mui/icons-material/TheaterComedy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import DoneIcon from "@mui/icons-material/Done";
import { useAuth } from "../context/AuthContext";
import { alert } from "../utils/alert";
import useScreenSize from "../hooks/useScreenSize";
import { useTranslation } from "react-i18next";
import { userValidationSchema } from "../validation/userValidationSchema";

const UserModal = ({ onClose, user, setUsers }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { isMobile, isTablet } = useScreenSize();
  const isEdit = !!user;

  const [formData, setFormData] = useState({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    location: "",
    role: user?.role || "regular",
    password: "",
  });

  const [locations, setLocations] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const roles = [
    {
      value: "regular",
      name: t("userCard.regular"),
      image: "/icons/regular.webp",
    },
    { value: "admin", name: t("userCard.admin"), image: "/icons/admin.webp" },
  ];

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isSubmitDisabled =
    !formData.username ||
    !formData.firstName ||
    !formData.lastName ||
    !formData.email ||
    (!formData.role && !isEdit) ||
    (!formData.password && !isEdit) ||
    (formData.role !== "admin" && !formData.location && !isEdit);

  // Fetch locations
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

    if (!isEdit) {
      fetchLocations();
    }
  }, [token, isEdit, formData.location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "username" || name === "password"
          ? value.replace(/\s/g, "")
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const { error } = userValidationSchema.validate(formData, {
      abortEarly: false,
      context: { isEdit },
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

    // Add only not empty fields to updatedInfo
    const updatedInfo = {};
    if (formData.username.trim())
      updatedInfo.username = formData.username.trim();
    if (formData.firstName.trim())
      updatedInfo.firstName = formData.firstName.trim();
    if (formData.lastName.trim())
      updatedInfo.lastName = formData.lastName.trim();
    if (formData.email.trim()) updatedInfo.email = formData.email.trim();
    if (formData.location) updatedInfo.location = formData.location;
    if (formData.role) updatedInfo.role = formData.role;
    if (formData.password.trim())
      updatedInfo.password = formData.password.trim();

    const endpoint = isEdit ? `/api/users/${user._id}` : "/api/auth/register";
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
        throw new Error(result.error || t("alert.unexpectedError"));
      }

      if (isEdit) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === result.id
              ? {
                  ...u,
                  username: result.username,
                  firstName: result.firstName,
                  lastName: result.lastName,
                  email: result.email,
                }
              : u
          )
        );
        alert.success(t("alert.userUpdateSuccess"));
      } else {
        setUsers((prev) => [result, ...prev]);
        alert.success(t("alert.userCreateSuccess"));
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
            {isEdit ? t("userModal.titleEdit") : t("userModal.titleNew")}
          </Typography>
          <IconButton
            onClick={onClose}
            disabled={submitting}
            sx={{ position: "absolute", right: 0 }}
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
            maxHeight: "50vh",
            overflowY: "auto",
            pr: 2,
            pb: 2,
          }}
        >
          {/* Username */}
          <Box>
            <Typography variant="textFieldLabel">
              <SettingsIcon fontSize="small" />
              {t("userModal.username")}
            </Typography>
            <TextField
              placeholder={t("userModal.username")}
              name="username"
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
              size="small"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username || ""}
              fullWidth
            />
          </Box>

          {/* First & Last names */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="textFieldLabel">
                <PersonIcon fontSize="small" />
                {t("userModal.firstName")}
              </Typography>
              <TextField
                placeholder={t("userModal.firstName")}
                name="firstName"
                size="small"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName || ""}
                fullWidth
              />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="textFieldLabel">
                <PersonIcon fontSize="small" />
                {t("userModal.lastName")}
              </Typography>
              <TextField
                placeholder={t("userModal.lastName")}
                name="lastName"
                size="small"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName || ""}
                fullWidth
              />
            </Box>
          </Box>

          {/* Email */}
          <Box>
            <Typography variant="textFieldLabel">
              <EmailIcon fontSize="small" />
              {t("userModal.email")}
            </Typography>
            <TextField
              placeholder={t("userModal.email")}
              name="email"
              size="small"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email || ""}
              fullWidth
            />
          </Box>

          {/* Password */}
          <Box>
            <Typography variant="textFieldLabel">
              <PasswordIcon fontSize="small" />
              {t("userModal.password")}
            </Typography>
            <TextField
              placeholder={t("userModal.password")}
              name="password"
              size="small"
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || ""}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{
                          color: showPassword
                            ? "var(--accent-color)"
                            : "var(--off-white-color)",
                        }}
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {isEdit && (
              <Alert severity="info" size="small" sx={{ mt: 1 }}>
                {t("userModal.passwordResetInfo")}
              </Alert>
            )}
          </Box>

          {/* Location & Role */}
          {!isEdit ? (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: "column",
                flexWrap: "wrap",
                p: 2,
                mt: 1,
                borderRadius: 1,
                border: "1px solid var(--warning)",
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
                  color: "var(--warning)",
                  px: 1,
                  fontWeight: 600,
                }}
              >
                {t("userModal.unchangeableFields")}
              </Typography>

              <Alert severity="warning" sx={{ mb: -1 }}>
                {t("userModal.unchangeableFieldsWarning")}
              </Alert>

              {/* Role */}
              <Box sx={{ mb: "-5px" }}>
                <Typography variant="textFieldLabel">
                  <RoleIcon fontSize="small" />
                  {t("userModal.role")}
                </Typography>
                <FormControl fullWidth error={!!errors.role}>
                  <Select
                    name="role"
                    size="small"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    {roles.map((role) => (
                      <MenuItem
                        key={role.value}
                        value={role.value}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          component="img"
                          src={role.image}
                          sx={{ width: 16, height: 16 }}
                        />
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.role || ""}</FormHelperText>
                </FormControl>
              </Box>

              {/* Location */}
              {formData.role !== "admin" ? (
                <Box sx={{ mb: "-4px" }}>
                  <Typography variant="textFieldLabel">
                    <LocationIcon fontSize="small" />
                    {t("userModal.location")}
                  </Typography>
                  <FormControl fullWidth error={!!errors.location}>
                    <Select
                      name="location"
                      size="small"
                      value={formData.location}
                      onChange={handleChange}
                    >
                      {locations.map((loc) => (
                        <MenuItem key={loc._id} value={loc._id}>
                          {loc.title}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.location || ""}</FormHelperText>
                  </FormControl>
                </Box>
              ) : null}
            </Box>
          ) : null}
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
            {t("userModal.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="submit"
            loading={submitting}
            loadingPosition="start"
            disabled={isSubmitDisabled}
            startIcon={<DoneIcon />}
            sx={{ flexGrow: isMobile || isTablet ? 1 : 0 }}
          >
            {isEdit ? t("userModal.update") : t("userModal.create")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UserModal;
