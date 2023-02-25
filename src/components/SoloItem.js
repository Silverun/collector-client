import React from "react";
import { useParams } from "react-router-dom";

const SoloItem = () => {
  const params = useParams();

  return <div>SoloItem ${params.item_id}</div>;
};

export default SoloItem;
