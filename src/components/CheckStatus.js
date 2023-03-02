import React, { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

const CheckStatus = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState();
  const logout = useLogout();

  const checkBlock = useCallback(async () => {
    try {
      const response = await axios.post("/user/checkblocked", auth);
      const status = response.data;
      if (status === "active") {
        setIsBlocked(false);
        setIsLoading(false);
      }
      if (status === "blocked") {
        setIsBlocked(true);
        //   await logout();
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    checkBlock();
  }, [checkBlock]);

  if (isLoading) {
    console.log("LOADING");
    return <p>Loading...</p>;
  }

  if (isBlocked) {
    console.log("BLOCKED");

    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  } else {
    console.log("FREE");
    return <Outlet />;
  }

  //   } else if (auth.id) {
  //     return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  //   } else {
  //     return <Navigate to="/login" state={{ from: location }} replace />;
  //   }
};

export default CheckStatus;
