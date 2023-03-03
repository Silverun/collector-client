import React, { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import Spinner from "react-bootstrap/Spinner";

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
    return (
      <div className="container">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (isBlocked) {
    console.log("BLOCKED");
    return <Navigate to="/blocked" state={{ from: location }} replace />;
  } else {
    console.log("FREE");
    return <Outlet />;
  }
};

export default CheckStatus;
