import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import axios from "axios";
// import { useDropzone } from "react-dropzone";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode);

const NewCollection = (props) => {
  const [dropdownState, setDropdownState] = useState("Theme");
  const [files, setFiles] = useState();

  const formSubmitHandler = async (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="container-lg text-center">
      <h5>Create new collection</h5>
      <form onSubmit={formSubmitHandler}>
        <div className="row">
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
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Create new collection
        </button>
      </form>
    </div>
  );
};

export default NewCollection;
