import { useCallback, useEffect, useState } from "react";
import axios from "../api/axios";

const Home = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllCollections = useCallback(async () => {
    try {
      const response = await axios.get(`/collection/getall`);
      console.log(response.data);
      setCollections(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllCollections();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <ul></ul>
        </div>
        <div className="col"></div>
      </div>
      <div className="row"></div>
    </div>
  );
};

export default Home;
