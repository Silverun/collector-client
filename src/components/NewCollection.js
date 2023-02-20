import React, { useEffect, useRef, useState } from "react";
import { axiosPrivate } from "../api/axios";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
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
// import { useDropzone } from "react-dropzone";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode);

const NewCollection = (props) => {
  const [files, setFiles] = useState();
  const [theme, setTheme] = useState();
  const [extraFieldType, setExtraFieldType] = useState("text");
  const [extraFieldName, setExtraFieldName] = useState("");
  const [extraFields, setExtraFields] = useState([]);
  const nameRef = useRef();
  const descRef = useRef();

  useEffect(() => {
    console.log("Mounted");
    return () => {
      console.log("Unmounted");
    };
  }, []);

  const createFieldHandler = () => {
    console.log({ name: extraFieldName, type: extraFieldType });

    const newField = { name: extraFieldName, type: extraFieldType };
    setExtraFields((prev) => {
      return [...prev, newField];
    });
  };
  // CONSIDER THIS VARIANT
  // const extraFieldsVariant = [
  //   { id: "string1", name: "", type: "" },
  //   { id: "string2", name: "", type: "" },
  //   { id: "string3", name: "", type: "" },
  // ];

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const newCollectionData = {
      image: files?.file,
      name: nameRef.current.value,
      description: descRef.current.value,
      theme: theme,
      extraFields: extraFields,
    };
    console.log(newCollectionData);

    try {
      const response = await axiosPrivate.post(
        "/collection/new",
        newCollectionData
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-lg text-center">
      <h5>Create new collection</h5>
      <form className="container" onSubmit={formSubmitHandler}>
        <div className="row ">
          <div className="col-sm-4">
            <FilePond
              allowFileEncode={true}
              files={files}
              onupdatefiles={(file) => setFiles(file[0])}
              // storeAsFile={true}
              credits={null}
              instantUpload={false}
              stylePanelLayout="compact"
              name="files" /* sets the file input name, it's filepond by default */
              labelIdle='Drag & Drop image here or <span class="filepond--label-action">Browse</span>'
            />
          </div>
          <div className="col-md">
            <div className="row my-3">
              <label htmlFor="collection_name" className="form-label">
                Name
              </label>
              <input
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
              <input
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
                title={theme}
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
                onChange={(e) => {
                  setTheme(e.target.value);
                }}
                aria-label="Default select example"
                defaultValue={theme}
              >
                <option>Choose theme</option>
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
                  <ListGroup.Item key={i + Math.random().toFixed(3) * 1000}>
                    {i + 1}) Field name: {field.name} - type: {field.type}
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
        <button type="submit" className="btn btn-primary mt-3">
          Create new collection
        </button>
      </form>
    </div>
  );
};

export default NewCollection;
