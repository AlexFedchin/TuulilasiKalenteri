import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Authentication from "./pages/Authentication";
import Calendar from "./pages/Calendar";
import Bookings from "./pages/Bookings";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import CustomAppBar from "./components/CustomAppBar";
import useScreenSize from "./hooks/useScreenSize";
import createCustomTheme from "./styles/theme";
import { ThemeProvider } from "@mui/material";

function App() {
  const { isMobile, isTablet } = useScreenSize();
  const { user } = useAuth();
  const theme = createCustomTheme({ isMobile, isTablet });

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CustomAppBar />

        <Routes>
          <Route path="/" element={user ? <Calendar /> : <Authentication />} />

          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <Bookings />
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

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<NotFound to="/" />} />

          {/* API routes */}
          <Route path="/api/*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
