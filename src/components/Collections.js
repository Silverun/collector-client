import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../img/cltr_logo_100.png";
import { useCallback, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";

const Collections = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [collections, setCollections] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("collections");

  const getCollections = useCallback(async () => {
    try {
      const response = await axiosPrivate.get(`/user/${params.id}`);
      setCollections(response.data.result);
    } catch (error) {
      console.log(error);
    }
  }, [axiosPrivate, params]);

  useEffect(() => {
    getCollections();
  }, [getCollections]);

  const deleteCollectionHandler = async (id, e) => {
    e.stopPropagation();
    try {
      await axiosPrivate.post("/collection/delete", { id });
      getCollections();
    } catch (error) {
      console.log(error);
    }
  };
  const editCollectionHandler = (id, e) => {
    e.stopPropagation();
    navigate(`/user/${params.id}/collection/${id}/edit`, {
      state: { collection: collections.find((col) => col.id === id) },
    });
  };

  const openCollectionHandler = (col_id) => {
    navigate(`/collection/${col_id}`);
  };

  return (
    <div className="container-lg">
      <Link
        to={`/user/${params.id}/newcollection`}
        type="button"
        className="btn btn-secondary btn-lg"
        style={{ borderRadius: 30 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fillRule="currentColor"
          className="bi bi-plus-circle"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
        </svg>
      </Link>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">{t("colName")}</th>
            <th scope="col">{t("colDesc")}</th>
            <th scope="col">{t("colTheme")}</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection) => {
            return (
              <tr
                onClick={() => {
                  openCollectionHandler(collection.id);
                }}
                role="button"
                key={collection.id}
                className="align-middle"
              >
                <td>
                  <img
                    style={{
                      minHeight: 40,
                      minWidth: 40,
                      maxHeight: 80,
                      maxWidth: 80,
                    }}
                    className="img-fluid"
                    src={
                      collection.imageUrl === "../img/cltr_logo_100.png"
                        ? logo
                        : collection.imageUrl
                    }
                    alt="col_logo"
                  />
                </td>
                <td>{collection.name}</td>
                <td>
                  <ReactMarkdown>{collection.description}</ReactMarkdown>
                </td>
                <td>{collection.theme}</td>
                <td>
                  <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="me-1"
                    onClick={(e) => editCollectionHandler(collection.id, e)}
                  />
                </td>
                <td>
                  <Button
                    onClick={(e) => deleteCollectionHandler(collection.id, e)}
                    icon="pi pi-trash"
                    rounded
                    severity="danger"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Collections;
