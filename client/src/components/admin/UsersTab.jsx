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
import { useAuth } from "../../context/AuthContext";
import { alert } from "../../utils/alert";
import Loader from "../loader/Loader";
import ConfirmModal from "../ConfirmModal";
import UserModal from "../UserModal";
import UserCard from "./UserCard";
import useScreenSize from "../../hooks/useScreenSize";

const UsersTab = () => {
  const { isMobile } = useScreenSize();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  // Fetch users data from the server
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();

        // Filter out the current user from the list
        const users = data.filter((u) => u._id !== user.id);

        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, user.id]);

  // Debounced search function
  const debounceSearch = useCallback(
    (term) => {
      setLoading(true);
      setTimeout(() => {
        const lowerCaseTerm = term.toLowerCase();
        const filtered = users.filter(
          (user) =>
            user?.username?.toLowerCase().includes(lowerCaseTerm) ||
            user?.firstName?.toLowerCase().includes(lowerCaseTerm) ||
            user?.lastName?.toLowerCase().includes(lowerCaseTerm) ||
            user?.role?.toLowerCase().includes(lowerCaseTerm) ||
            user?.email?.toLowerCase().includes(lowerCaseTerm)
        );
        setFilteredUsers(filtered);
        setLoading(false);
      }, 500);
    },
    [users]
  );

  // Handle search input change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    debounceSearch(value);
  };

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const onEdit = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const onCreate = () => {
    setSelectedUser(null);
    setOpenEditModal(true);
  };

  const onDeleteClick = async (user) => {
    setSelectedUser(user);
    setOpenConfirmModal(true);
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert.error(`Error: ${error.message}`);
    } finally {
      setOpenConfirmModal(false);
      setSelectedUser(null);
    }
  };

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
          placeholder="Search for users..."
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
            {filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onEdit={onEdit}
                onDelete={onDeleteClick}
              />
            ))}
          </Box>
          <IconButton
            onClick={onCreate}
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
        </>
      )}

      {openConfirmModal && (
        <ConfirmModal
          onConfirm={() => deleteUser(selectedUser._id)}
          onClose={() => setOpenConfirmModal(false)}
          text={`Are you sure you want to delete the <b>${selectedUser?.username}</b> user? The user and all of their bookings will be deleted. This action <b>cannot be undone</b>.`}
        />
      )}

      {openEditModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setOpenEditModal(false)}
          setUsers={setUsers}
        />
      )}
    </Box>
  );
};

export default UsersTab;
