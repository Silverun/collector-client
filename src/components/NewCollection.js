import React, { useRef, useState } from "react";
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
import { useTranslation } from "react-i18next";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode);

const NewCollection = () => {
  const [files, setFiles] = useState();
  const [theme, setTheme] = useState();
  const [extraFieldType, setExtraFieldType] = useState("text");
  const [extraFieldName, setExtraFieldName] = useState("");
  const [extraFields, setExtraFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const nameRef = useRef();
  const descRef = useRef();
  const navigate = useNavigate();
  const params = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { t } = useTranslation("newCol");

  const createFieldHandler = () => {
    const newField = {
      name: extraFieldName,
      type: extraFieldType,
      id: Math.random().toFixed(3) * 1000,
    };
    setExtraFields((prev) => {
      return [...prev, newField];
    });
  };

  const deleteFieldHandler = (id) => {
    const filteredExtraFields = extraFields.filter((field) => field.id !== id);
    setExtraFields(filteredExtraFields);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", files?.file);
    formData.append("name", nameRef.current.value);
    formData.append("description", descRef.current.value);
    formData.append("theme", theme);
    formData.append("extraFields", JSON.stringify(extraFields));
    formData.append("authorId", +params.id);
    try {
      await axiosPrivate.post("/collection/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false);
      navigate(`/user/${params.id}`, { replace: true });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="container-lg text-center mt-3">
      <h5>{t("newCol")}</h5>
      <form
        className="container needs-validation my-4"
        onSubmit={formSubmitHandler}
      >
        <div className="row container">
          <div className="col-sm-4">
            <label htmlFor="collection_name" className="form-label">
              {t("newName")}
            </label>
            <input
              required
              ref={nameRef}
              type="text"
              className="form-control mb-4"
              id="collection_name"
            />
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
            <Form.Select
              className="mt-4"
              required
              onChange={(e) => {
                setTheme(e.target.value);
              }}
              aria-label="Default select example"
            >
              <option value="">{t("choose")}</option>
              <option value="Coins and Currency">Coins and Currency</option>
              <option value="Books">Books</option>
              <option value="Alcohol">Alcohol</option>
              <option value="Trading Cards">Trading Cards</option>
              <option value="Classic Cars">Classic Cars</option>
            </Form.Select>
          </div>
          <div className="col-sm text-start">
            <label htmlFor="col_description" className="form-label">
              {t("desc")}
            </label>
            <textarea
              required
              ref={descRef}
              type="text"
              rows={"10"}
              className="form-control mb-3"
              id="col_description"
            />
            <h6 className="text-start">{t("extra")}</h6>
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
                placeholder={t("fieldName")}
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
                +
              </Button>
            </InputGroup>
          </div>
        </div>
        {isLoading ? (
          <Spinner animation="border" />
        ) : (
          <button type="submit" className="btn btn-primary mt-3">
            {t("newC")}
          </button>
        )}
      </form>
    </div>
  );
};

export default NewCollection;
