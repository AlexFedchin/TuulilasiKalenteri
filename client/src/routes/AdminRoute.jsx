import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  /* Check if user is logged in and has admin role
     If not, redirect to home page
     If user is logged in and has admin role, render the children (admin page)
  */
  if (!user || user.role !== "admin") return <Navigate to="/" />;
  return children;
};

export default AdminRoute;
