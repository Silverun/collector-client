import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";

const Blocked = () => {
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      logout();
      navigate("/");
    }, 3000);
  }, []);

  return (
    <div className="container text-center mt-5">
      <div className="modal-dialog modal-lg mb-3">
        You have been blocked and will be logged out.
      </div>
    </div>
  );
};

export default Blocked;
