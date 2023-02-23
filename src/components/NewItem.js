import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ReactTags } from "react-tag-autocomplete";
import "../styles/reactTag.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const NewItem = () => {
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collection, setCollection] = useState({});
  const [selected, setSelected] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [extraFields, setExtraFields] = useState();

  const getSoloCollection = useCallback(async () => {
    try {
      const response = await axiosPrivate.get(`/collection/${params.col_id}`);
      if (!response.data) return navigate("/");
      setCollection(response.data);
      setExtraFields(JSON.parse(response.data.extraFields));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [params.col_id, navigate, axiosPrivate]);

  useEffect(() => {
    getSoloCollection();
  }, [getSoloCollection]);

  useEffect(() => {
    console.log(extraFields);
  }, [extraFields]);

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
    console.log("submit");
  };

  // const extraFieldsJsx = () => {
  //   extraFields.map((field) => {
  //     if (field.type === "markdown") {
  //       return (
  //         <Form.Group
  //           className="mt-3"
  //           key={field.id}
  //           controlId="validationCustom07"
  //         >
  //           <Form.Label>{field.name}</Form.Label>
  //           <Form.Control
  //             as="textarea"
  //             required
  //             placeholder="Markdown is supported here!"
  //             style={{ height: "100px" }}
  //           />
  //         </Form.Group>
  //       );
  //     } else {
  //       return (
  //         <Form.Group
  //           className="mt-3"
  //           key={field.id}
  //           controlId="validationCustom01"
  //         >
  //           <Form.Label>{field.name}</Form.Label>
  //           <Form.Control required type={field.type} />
  //         </Form.Group>
  //       );
  //     }
  //   });
  // };

  return (
    <div className="container text-center">
      <h5>Create new item</h5>
      <Form onSubmit={formSubmitHandler}>
        <Row className="sm-3 align-items-center">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Item name</Form.Label>
            <Form.Control required type="text" />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Col md="6">
            <Form.Label>Choose item tags</Form.Label>
            <ReactTags
              allowNew={true}
              labelText="Add item tags"
              selected={selected}
              suggestions={suggestions}
              onAdd={onAdd}
              onDelete={onDelete}
              noOptionsText="No matching tags"
            />
          </Col>
        </Row>
        <Row className="mb-3">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            extraFields.map((field) => {
              if (field.type === "markdown") {
                return (
                  <Form.Group
                    className="mt-3"
                    key={field.id}
                    controlId={field.id}
                  >
                    <Form.Label>{field.name}</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Markdown is supported here!"
                      style={{ height: "100px" }}
                    />
                  </Form.Group>
                );
              } else if (field.type === "checkbox") {
                return (
                  <Form.Check
                    className="text-start mt-3"
                    type={field.type}
                    id={field.id}
                    label={field.name}
                  />
                );
              } else {
                return (
                  <Form.Group
                    className="mt-3"
                    key={field.id}
                    controlId={field.id}
                  >
                    <Form.Label>{field.name}</Form.Label>
                    <Form.Control required type={field.type} />
                  </Form.Group>
                );
              }
            })
          )}
        </Row>

        <Button type="submit" variant="primary" className="mt-3">
          Add new item
        </Button>
      </Form>
    </div>
  );
};

export default NewItem;
