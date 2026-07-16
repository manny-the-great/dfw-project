import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.authToken;
  const is_verified = userData?.otp_verified;

  return token && is_verified ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
