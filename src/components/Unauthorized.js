import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  const goBackHandler = () => navigate(-1);

  return (
    <div className="container text-center mt-5">
      <div className="modal-dialog modal-lg mb-3">
        You do not have permissions to view this page.
      </div>
      <button onClick={goBackHandler} type="button" className="btn btn-primary">
        Go back
      </button>
    </div>
  );
};

export default Unauthorized;
