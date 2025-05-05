import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  TextField,
  Card,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Loader from "../loader/Loader";
import LocationCard from "./LocationCard";
import ConfirmModal from "../ConfirmModal";
import NewLocationCard from "./NewLocationCard";
import { useAuth } from "../../context/AuthContext";
import { alert } from "../../utils/alert";
import useScreenSize from "../../hooks/useScreenSize";
import { useTranslation } from "react-i18next";

const LocationsTab = () => {
  const { token } = useAuth();
  const { isMobile } = useScreenSize();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch locations data from the server
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/locations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        alert.error(
          `${t("alert.error")}: ${error.message || t("alert.unexpectedError")}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [token]);

  // Debounced search function
  const debounceSearch = useCallback(
    (term) => {
      setLoading(true);
      setTimeout(() => {
        const lowerCaseTerm = term.toLowerCase();
        const filtered = locations.filter(
          (location) =>
            location?.title?.toLowerCase().includes(lowerCaseTerm) ||
            location?.users?.some(
              (user) =>
                user?.username?.toLowerCase().includes(lowerCaseTerm) ||
                user?.firstName.toLowerCase().includes(lowerCaseTerm) ||
                user?.lastName?.toLowerCase().includes(lowerCaseTerm)
            )
        );
        setFilteredLocations(filtered);
        setLoading(false);
      }, 500);
    },
    [locations]
  );

  // Handle search input change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    debounceSearch(value);
  };

  const deleteLocation = async (locationId) => {
    try {
      const response = await fetch(`/api/locations/${locationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete location");
      }
      setLocations((prevLocations) =>
        prevLocations.filter((location) => location._id !== locationId)
      );
      alert.success(t("alert.locationDeleteSuccess"));
    } catch (error) {
      console.error("Error deleting location:", error);
      alert.error(`${t("alert.error")}: ${error.message}`);
    }
  };

  const onDeleteClick = (location) => {
    setSelectedLocation(location);
    setOpenConfirmModal(true);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  useEffect(() => {
    setFilteredLocations(locations);
  }, [locations]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          p: 1,
          maxWidth: "500px",
          width: "100%",
          boxSizing: isMobile ? "content-box" : "border-box",
        }}
      >
        <TextField
          placeholder={t("locationsTab.searchPlaceholder")}
          variant="outlined"
          fullWidth
          size="small"
          sx={{ width: "100%" }}
          value={searchTerm}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "var(--off-grey)" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Card>

      {loading ? (
        <Loader style={{ marginTop: "20vh" }} />
      ) : (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {filteredLocations.map((location) => (
              <LocationCard
                key={location._id}
                location={location}
                setLocations={setLocations}
                onDelete={onDeleteClick}
              />
            ))}
            {isAdding && (
              <NewLocationCard
                setLocations={setLocations}
                onCancel={handleCancelAdd}
              />
            )}
          </Box>
          {!isAdding && (
            <IconButton
              onClick={handleAddClick}
              sx={{
                width: "40px",
                height: "40px",
                alignSelf: "center",
                color: "var(--primary)",
                backgroundColor: "var(--white)",
                "&:hover": {
                  backgroundColor: "var(--white-onhover)",
                  color: "var(--primary-onhover)",
                },
              }}
            >
              <AddIcon />
            </IconButton>
          )}
        </>
      )}

      {/* Confirmation modal */}
      {openConfirmModal && (
        <ConfirmModal
          onConfirm={() => deleteLocation(selectedLocation._id)}
          onClose={() => setOpenConfirmModal(false)}
          text={t("locationsTab.confirmDelete", {
            locationName: selectedLocation?.title,
            userCount: selectedLocation?.users.length,
          })}
        />
      )}
    </Box>
  );
};

export default LocationsTab;
