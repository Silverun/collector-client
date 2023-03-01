import React, { useCallback, useEffect, useRef, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ReactTags } from "react-tag-autocomplete";
import "../styles/reactTag.css";

const EditItem = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagSuggest, setTagSuggest] = useState();
  const [invalidTags, setInvalidTags] = useState(false);
  const [collection, setCollection] = useState({});
  const [extraFields, setExtraFields] = useState();
  const [itemNameInput, setItemNameInput] = useState();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const inputsRef = useRef();
  const allFieldsRefs = [];

  const getItem = useCallback(async () => {
    try {
      const response = await axiosPrivate.post(`item/${params.item_id}`);
      const data = response.data;
      console.log("CurItem", data);
      setCurrentItem(data);
      setSelectedTags(data.tags);
      setItemNameInput(data.name);
    } catch (error) {
      console.log(error);
    }
  }, [axiosPrivate, params.item_id]);

  const getSoloCollection = useCallback(async () => {
    try {
      const response = await axiosPrivate.get(
        `/collection/${location.state.from}`
      );
      if (!response.data) return navigate("/");
      setCollection(response.data);
      setExtraFields(response.data.extraFields);
      console.log("response.data.extraFields", response.data.extraFields);
    } catch (error) {
      console.log(error);
    }
  }, [navigate, axiosPrivate, location.state.from]);

  const getAllTags = useCallback(async () => {
    try {
      let allTags = [];
      const response = await axiosPrivate.get("/item/getall");

      response.data.forEach((item) => {
        item.tags.forEach((tag) => {
          allTags.push(tag);
        });
      });
      const key = "label";
      const uniqueTags = [
        ...new Map(allTags.map((tag) => [tag[key], tag])).values(),
      ];
      return uniqueTags;
    } catch (error) {
      console.log(error);
    }
  }, [axiosPrivate]);

  const getData = useCallback(async () => {
    try {
      await getItem();
      await getSoloCollection();
      setTagSuggest(await getAllTags());

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [getSoloCollection, getAllTags, getItem]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    allFieldsRefs.forEach((field, i) => {
      if (field.type === "checkbox") {
        field.checked = currentItem.fieldsData[i].value;
      } else {
        field.value = currentItem.fieldsData[i].value;
      }
    });
  }, [isLoading]);

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
      name: itemNameInput,
      tags: JSON.stringify(selectedTags),
      fieldsData: JSON.stringify(extractedInputs()),
      collectionId: collection.id,
      authorId: collection.authorId,
    };

    try {
      const response = await axiosPrivate.post(
        `/item/${params.item_id}/update`,
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    console.log("submit");
    navigate(`/collection/${collection.id}`, { replace: true });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container text-center">
      <h5 className="mb-3">
        Editing {currentItem.name} in {collection.name}
      </h5>
      <Form onSubmit={formSubmitHandler}>
        <Row className="sm-3 align-items-center">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Item name</Form.Label>
            <Form.Control
              onChange={(e) => setItemNameInput(e.target.value)}
              value={itemNameInput}
              required
              type="text"
            />
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
          Save changes
        </Button>
      </Form>
    </div>
  );
};

export default EditItem;
