import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ReactTags } from "react-tag-autocomplete";
import "../styles/reactTag.css";

const NewItem = () => {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [collection, setCollection] = useState({});
  const [selected, setSelected] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const getSoloCollection = useCallback(async () => {
    try {
      const response = await axiosPrivate.get(`/collection/${params.col_id}`);
      console.log(response.data);
      setCollection(response.data);
      if (!response.data) navigate("/");
    } catch (error) {
      console.log(error);
    }
  }, [params.col_id, navigate, axiosPrivate]);

  useEffect(() => {
    // console.log(params);
    getSoloCollection();
  }, [getSoloCollection, params]);

  const suggestions = [
    { value: 3, label: "Bananas" },
    { value: 4, label: "Mangos" },
    { value: 5, label: "Lemons" },
    { value: 6, label: "Apricots", disabled: true },
  ];

  const onAdd = useCallback(
    (newTag) => {
      setSelected([...selected, newTag]);
    },
    [selected]
  );

  const onDelete = useCallback(
    (tagIndex) => {
      setSelected(selected.filter((_, i) => i !== tagIndex));
    },
    [selected]
  );

  const formSubmitHandler = (e) => {
    e.preventDefault();
    // setIsLoading(true);
    console.log("submit");
    // setIsLoading(false);
  };

  return (
    <div className="container-lg text-center">
      <h5>Create new item</h5>
      <Form onSubmit={formSubmitHandler}>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Item name</Form.Label>
            <Form.Control required type="text" />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Col md="6">
            <ReactTags
              allowNew={true}
              labelText="Add item tags"
              selected={selected}
              suggestions={suggestions}
              onAdd={onAdd}
              onDelete={onDelete}
              noOptionsText="No matching tags"
              // classNames={{ input: "form-control" }}
            />
          </Col>
        </Row>
        <Row className="mb-3"></Row>

        <Button type="submit" variant="primary" className="mt-3">
          Add new item
        </Button>
      </Form>
    </div>
  );
};

export default NewItem;
