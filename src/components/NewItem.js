import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ReactTags } from "react-tag-autocomplete";
import "../styles/reactTag.css";

const NewItem = () => {
  const [invalidTags, setInvalidTags] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collection, setCollection] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [extraFields, setExtraFields] = useState();
  const itemNameRef = useRef();
  const inputsRef = useRef();
  const allFieldsRefs = [];

  const getSoloCollection = useCallback(async () => {
    try {
      const response = await axiosPrivate.get(`/collection/${params.col_id}`);
      if (!response.data) return navigate("/");
      setCollection(response.data);

      //PARSE WAS HERE
      setExtraFields(response.data.extraFields);
      setIsLoading(false);
      console.log(extraFields);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [params.col_id, navigate, axiosPrivate]);

  useEffect(() => {
    getSoloCollection();
  }, [getSoloCollection]);

  const suggestTags = [
    { label: "Bananas" },
    { value: 4, label: "Mangos" },
    { value: 5, label: "Lemons" },
    { value: 6, label: "Apricots", disabled: true },
  ];

  const onAddTag = useCallback(
    (newTag) => {
      console.log(newTag);
      return setSelectedTags([...selectedTags, newTag]);
    },
    [selectedTags]
  );

  const onDeleteTag = useCallback(
    (tagIndex) => {
      setSelectedTags(selectedTags.filter((_, i) => i !== tagIndex));
    },
    [selectedTags]
  );

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (selectedTags.length < 1) {
      setInvalidTags(true);
      console.log("Tags empty");
      return;
    } else {
      setInvalidTags(false);
    }

    const extractedInputs = () => {
      const result = allFieldsRefs.map((field) => {
        return {
          name: field.name,
          type: field.type,
          value: field.type !== "checkbox" ? field.value : field.checked,
          id: field.id,
        };
      });
      return result;
    };

    const formData = {
      name: itemNameRef.current.value,
      tags: JSON.stringify(selectedTags),
      fieldsData: JSON.stringify(extractedInputs()),
      collectionId: collection.id,
      authorId: collection.authorId,
    };

    // send tags to DB
    const createTags = async () => {
      try {
        const response = await axiosPrivate.post("/item/newtag");
      } catch (error) {
        console.log(error);
      }
    };

    try {
      const response = await axiosPrivate.post("/item/new", formData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    console.log(formData);
    console.log("submit");
    navigate(`/collection/${collection.id}`, { replace: true });
  };

  return (
    <div className="container text-center">
      <h5 className="mb-3">New item for {collection.name}</h5>
      <Form onSubmit={formSubmitHandler}>
        <Row className="sm-3 align-items-center">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Item name</Form.Label>
            <Form.Control ref={itemNameRef} required type="text" />
          </Form.Group>
          <Col md="6">
            <Form.Label>Choose item tags</Form.Label>
            <ReactTags
              allowNew={true}
              labelText="Add item tags"
              selected={selectedTags}
              suggestions={suggestTags}
              onAdd={onAddTag}
              onDelete={onDeleteTag}
              noOptionsText="No matching tags"
              isInvalid={invalidTags}
              ariaErrorMessage="overlay-example"
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
                      ref={(ref) => allFieldsRefs.push(ref)}
                      as="textarea"
                      required
                      name={field.name}
                      placeholder="Markdown is supported here!"
                      style={{ height: "100px" }}
                    />
                  </Form.Group>
                );
              } else if (field.type === "checkbox") {
                return (
                  <Form.Check
                    ref={(ref) => allFieldsRefs.push(ref)}
                    key={field.id}
                    className="text-start mt-3"
                    type={field.type}
                    id={field.id}
                    label={field.name}
                    name={field.name}
                  />
                );
              } else {
                return (
                  <Form.Group
                    itemRef={inputsRef}
                    className="mt-3"
                    key={field.id}
                    controlId={field.id}
                  >
                    <Form.Label>{field.name}</Form.Label>
                    <Form.Control
                      name={field.name}
                      ref={(ref) => allFieldsRefs.push(ref)}
                      required
                      type={field.type}
                    />
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
