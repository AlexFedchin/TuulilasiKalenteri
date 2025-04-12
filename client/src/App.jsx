import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";
import CustomAppBar from "./components/CustomAppBar";
import useScreenSize from "./hooks/useScreenSize";
import createCustomTheme from "./styles/theme";
import { ThemeProvider } from "@mui/material";
import { lazy, Suspense } from "react";
import Loader from "./components/loader/Loader";

const Authentication = lazy(() => import("./pages/Authentication"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Admin = lazy(() => import("./pages/Admin"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { isMobile, isTablet } = useScreenSize();
  const { user } = useAuth();
  const theme = createCustomTheme({ isMobile, isTablet });

  return (
    <Router>
      <ThemeProvider theme={theme}>
        {user && <CustomAppBar />}

        <Suspense fallback={<Loader fullScreen />}>
          <Routes>
            <Route
              path="/"
              element={user ? <Calendar /> : <Authentication />}
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
      </ThemeProvider>
    </Router>
  );
}

export default App;
