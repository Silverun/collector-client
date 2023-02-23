import React, { useEffect, useRef, useState } from "react";
// USE AXIOS PRIVATE HOOK INSTEAD OF REGULAR
// import { axiosPrivate } from "../api/axios";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import useAuth from "../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Spinner from "react-bootstrap/Spinner";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode);

const NewCollection = (props) => {
  const [files, setFiles] = useState();
  const [theme, setTheme] = useState();
  const [extraFieldType, setExtraFieldType] = useState("text");
  const [extraFieldName, setExtraFieldName] = useState("");
  const [extraFields, setExtraFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();
  const nameRef = useRef();
  const descRef = useRef();
  const navigate = useNavigate();
  const params = useParams();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    console.log("params", params.id);
  });

  const createFieldHandler = () => {
    const newField = {
      name: extraFieldName,
      type: extraFieldType,
      id: Math.random().toFixed(3) * 1000,
    };
    // console.log(newField);
    setExtraFields((prev) => {
      return [...prev, newField];
    });
    // console.log(extraFields);
  };

  const deleteFieldHandler = (id) => {
    const filteredExtraFields = extraFields.filter((field) => field.id !== id);
    setExtraFields(filteredExtraFields);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(extraFields);
    const formData = new FormData();
    formData.append("image", files?.file);
    formData.append("name", nameRef.current.value);
    formData.append("description", descRef.current.value);
    formData.append("theme", theme);
    formData.append("extraFields", JSON.stringify(extraFields));
    // author id from params id instead of auth id (if admin creates collection)
    formData.append("authorId", +params.id);
    // console.log(formData.get("image"));
    try {
      const response = await axiosPrivate.post("/collection/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setIsLoading(false);
      //changed from auth.id
      navigate(`/user/${params.id}`, { replace: true });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="container-lg text-center">
      <h5>Create new collection</h5>
      <form className="container needs-validation" onSubmit={formSubmitHandler}>
        <div className="row container">
          <div className="col-sm-4">
            <FilePond
              allowFileEncode={true}
              onupdatefiles={(files) => {
                return setFiles(files[0]);
              }}
              credits={null}
              instantUpload={false}
              stylePanelLayout="compact"
              name="files" /* sets the file input name, it's filepond by default */
              labelIdle='Drag & Drop image here or <span class="filepond--label-action">Browse</span>'
            />
          </div>
          <div className="col-sm px-5 text-start">
            <div className="row my-3">
              <label htmlFor="collection_name" className="form-label">
                Name
              </label>
              <input
                required
                ref={nameRef}
                type="text"
                className="form-control"
                id="collection_name"
              />
            </div>
            <div className="row my-3">
              <label htmlFor="col_description" className="form-label">
                Description
              </label>
              <textarea
                required
                ref={descRef}
                type="text"
                className="form-control"
                id="col_description"
              />
            </div>
            <div className="row my-4">
              {/* <DropdownButton
                variant="secondary"
                id="dropdown-basic-button"
                title="Choose theme"
              >
                <Dropdown.Item onClick={() => setTheme("Coins and Currency")}>
                  Coins and Currency
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTheme("Books")}>
                  Books
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTheme("Alcohol")}>
                  Alcohol
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTheme("Trading Cards")}>
                  Trading Cards
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTheme("Classic Cars")}>
                  Classic Cars
                </Dropdown.Item>
              </DropdownButton> */}

              <Form.Select
                required
                onChange={(e) => {
                  setTheme(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option value="">Choose theme</option>
                <option value="Coins and Currency">Coins and Currency</option>
                <option value="Books">Books</option>
                <option value="Alcohol">Alcohol</option>
                <option value="Trading Cards">Trading Cards</option>
                <option value="Classic Cars">Classic Cars</option>
              </Form.Select>
            </div>
            {/* Extra fields */}
            <div className="row">
              <h6 className="text-start mb-3">Extra fields</h6>
              <ListGroup className="mb-3">
                {extraFields.map((field, i) => (
                  <ListGroup.Item key={field.id}>
                    {i + 1}. {field.name} ({field.type})
                    <Button
                      onClick={() => deleteFieldHandler(field.id)}
                      className="ms-2"
                      variant="secondary"
                      size="sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash3"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                      </svg>
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <InputGroup className="mb-3">
                <Form.Control
                  value={extraFieldName}
                  onChange={(e) => {
                    setExtraFieldName(e.target.value);
                  }}
                  placeholder="Field name"
                  aria-label="Field type input"
                />
                <FloatingLabel controlId="floatingSelect" label="Field type">
                  <Form.Select
                    onChange={(e) => {
                      setExtraFieldType(e.target.value);
                    }}
                    aria-label="Default select example"
                    defaultValue={extraFieldType}
                  >
                    <option value="text">String</option>
                    <option value="number">Number</option>
                    <option value="markdown">Text(markdown)</option>
                    <option value="date">Date</option>
                    <option value="checkbox">Checkbox</option>
                  </Form.Select>
                </FloatingLabel>
                <Button onClick={createFieldHandler} variant="secondary">
                  Add
                </Button>
              </InputGroup>
            </div>
          </div>
        </div>
        {isLoading ? (
          <Spinner animation="border" />
        ) : (
          <button type="submit" className="btn btn-primary mt-3">
            Create new collection
          </button>
        )}
      </form>
    </div>
  );
};

export default NewCollection;
