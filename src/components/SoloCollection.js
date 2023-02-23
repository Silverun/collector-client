import React, { useCallback, useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const SoloCollection = () => {
  const [collection, setCollection] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  const getSoloCollection = useCallback(async () => {
    try {
      const response = await axios.get(`/collection/${params.col_id}`);
      console.log(response.data);
      setCollection(response.data);
      if (!response.data) navigate("/");
    } catch (error) {
      console.log(error);
    }
  }, [params.col_id, navigate]);

  useEffect(() => {
    console.log(params);
    getSoloCollection();
  }, [getSoloCollection, params]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-2">
          <img
            style={{ maxHeight: 80, maxWidth: 80 }}
            src={collection.imageUrl}
            alt="col_img"
          />
        </div>
        <div className="col text-center">
          <h5>{collection.name}</h5>
        </div>
      </div>
      <div className="row">
        <div className="col-2">
          <Link
            to={`/collection/${params.col_id}/newitem`}
            type="button"
            className="btn btn-secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fillRule="currentColor"
              className="bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
            </svg>
          </Link>
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
};

export default SoloCollection;
