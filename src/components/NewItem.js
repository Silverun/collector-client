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
  const [tagSuggest, setTagSuggest] = useState();
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
      setExtraFields(response.data.extraFields);
      console.log("response.data.extraFields", response.data.extraFields);
    } catch (error) {
      console.log(error);
    }
  }, [params.col_id, navigate, axiosPrivate]);

  const getAllTags = useCallback(async () => {
    try {
      let allTags = [];
      const response = await axiosPrivate.get("/item/getall");
      console.log("getAllTags", response.data);

      response.data.forEach((item) => {
        item.tags.forEach((tag) => {
          console.log(tag);
          allTags.push(tag);
        });
      });
      console.log("tags", allTags);

      const key = "label";

      const uniqueTags = [
        ...new Map(allTags.map((tag) => [tag[key], tag])).values(),
      ];

      console.log("unique tags", uniqueTags);
      return uniqueTags;
    } catch (error) {
      console.log(error);
    }
  }, [axiosPrivate]);

  const getData = useCallback(async () => {
    try {
      await getSoloCollection();
      setTagSuggest(await getAllTags());
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [getSoloCollection, getAllTags]);

  useEffect(() => {
    getData();
  }, [getData]);

  const onAddTag = useCallback(
    (newTag) => {
      const formattedTag = {
        value:
          newTag.value
            .replaceAll(" ", "")
            .toLowerCase()
            .charAt(0)
            .toUpperCase() +
          newTag.value.replaceAll(" ", "").toLowerCase().substring(1),
        label:
          newTag.label
            .replaceAll(" ", "")
            .toLowerCase()
            .charAt(0)
            .toUpperCase() +
          newTag.label.replaceAll(" ", "").toLowerCase().substring(1),
      };
      console.log(formattedTag);
      return setSelectedTags([...selectedTags, formattedTag]);
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

  if (isLoading) return <p>Loading...</p>;

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
              suggestions={tagSuggest}
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
