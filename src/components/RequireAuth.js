import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // console.log(auth.role + " auth.role");
  // console.log(allowedRoles);

  if (allowedRoles.includes(auth.role)) {
    return <Outlet />;
  } else if (auth.id) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
