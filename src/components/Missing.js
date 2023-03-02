import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Missing = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="container text-center">
      <h3>This page is not found</h3>
    </div>
  );
};

export default Missing;
