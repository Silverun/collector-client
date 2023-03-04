import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refreshToken = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      console.log("verifyRefreshToken ran");
      try {
        console.log("auth before refresh token", auth);
        await refreshToken();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    console.log("Persist login ran");
    console.log("!auth?.accessToken", !auth?.accessToken);
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  const spinner = (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  return <>{isLoading ? spinner : <Outlet />}</>;
};

export default PersistLogin;
