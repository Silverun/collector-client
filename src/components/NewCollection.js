import React, { useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
// import { useDropzone } from "react-dropzone";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode);

const NewCollection = (props) => {
  const [files, setFiles] = useState();
  const [dropdownState, setDropdownState] = useState("Theme");
  const [extraFieldType, setExtraFieldType] = useState("");
  const [extraFieldName, setExtraFieldName] = useState("");
  const [extraFields, setExtraFields] = useState([]);

  const createFieldHandler = () => {
    console.log({ name: extraFieldName, type: extraFieldType });

    const newField = { name: extraFieldName, type: extraFieldType };
    setExtraFields((prev) => {
      return [...prev, newField];
    });
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(extraFields);

    if (files) {
      const formData = new FormData();
      formData.append("image", files.file);
      try {
        const response = await axios.post(
          "https://api.imgbb.com/1/upload",
          formData,
          {
            params: {
              expiration: "600",
              key: "a0039a07ef71946ce2aae03fef02d685",
            },
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(response.data.data.url);
      } catch (error) {
        console.log(error);
      }
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
              //   storeAsFile={true}
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
                type="text"
                className="form-control"
                id="col_description"
              />
            </div>
            <div className="row my-3">
              <DropdownButton
                variant="secondary"
                id="dropdown-basic-button"
                title={dropdownState}
              >
                <Dropdown.Item
                  onClick={() => setDropdownState("Coins and Currency")}
                >
                  Coins and Currency
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDropdownState("Books")}>
                  Books
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDropdownState("Alcohol")}>
                  Alcohol
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setDropdownState("Trading Cards")}
                >
                  Trading Cards
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDropdownState("Classic Cars")}>
                  Classic Cars
                </Dropdown.Item>
              </DropdownButton>
            </div>
            {/* Extra fields */}
            <div className="row">
              <h6 className="text-start mb-3">Extra fields</h6>
              <ListGroup className="mb-3">
                {extraFields.map((field, i) => (
                  <ListGroup.Item key={i + field.name}>
                    {i + 1}) {field.name} - Type: {field.type}
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
                  >
                    <option value="String">String</option>
                    <option value="Number">Number</option>
                    <option value="Text">Text(markdown)</option>
                    <option value="Date">Date</option>
                    <option value="Checkbox">Checkbox</option>
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
