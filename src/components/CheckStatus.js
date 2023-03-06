import React, { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Spinner from "react-bootstrap/Spinner";

const CheckStatus = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState();

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
  }, []);

  if (isLoading) {
    return (
      <div className="container">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (isBlocked) {
    return <Navigate to="/blocked" state={{ from: location }} replace />;
  } else {
    return <Outlet />;
  }
};

export default CheckStatus;
