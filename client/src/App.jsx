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

function App() {
  const { user } = useAuth();

  return (
    <Router>
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
    </Router>
  );
}

export default App;
