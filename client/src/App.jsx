import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";
import CustomAppBar from "./components/CustomAppBar";
import useScreenSize from "./hooks/useScreenSize";
import createCustomTheme from "./styles/theme";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { lazy, Suspense } from "react";
import { useSnackbar } from "notistack";
import { setUseSnackbarRef } from "./utils/alert";
import Loader from "./components/loader/Loader";
import CustomFoter from "./components/CustomFooter";

const Authentication = lazy(() => import("./pages/Authentication"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Admin = lazy(() => import("./pages/Admin"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { isMobile, isTablet } = useScreenSize();
  const { user } = useAuth();
  const theme = createCustomTheme({ isMobile, isTablet });
  const snackbar = useSnackbar();
  setUseSnackbarRef(snackbar);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {user && <CustomAppBar />}

          <Box sx={{ flexGrow: 1 }}>
            <Suspense fallback={<Loader fullScreen />}>
              <Routes>
                <Route
                  path="/"
                  element={user ? <Calendar /> : <Authentication />}
                />
                <Route
                  path="/reset-password/:resetToken"
                  element={<ResetPassword />}
                />
                <Route
                  path="/bookings"
                  element={
                    <PrivateRoute>
                      <Bookings />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-profile"
                  element={
                    <PrivateRoute>
                      <MyProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />
                <Route path="*" element={<NotFound to="/" />} />
              </Routes>
            </Suspense>
          </Box>

          {user && <CustomFoter />}
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
