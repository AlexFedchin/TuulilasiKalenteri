import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  /* Check if user is logged in
     If not, redirect to home page
     If user is logged in, render the children (bookings page)
  */
  if (!user) return <Navigate to="/" />;
  return children;
};

export default PrivateRoute;
