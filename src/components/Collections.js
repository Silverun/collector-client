import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../img/cltr_logo_100.png";
import { useCallback, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

const Collections = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [collections, setCollections] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("collections");

  const getCollections = useCallback(async () => {
    try {
      console.log(params.id);
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
        className="btn btn-secondary"
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
                  <button
                    onClick={(e) => editCollectionHandler(collection.id, e)}
                    type="button"
                    className="btn btn-secondary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                      <path
                        fill="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      ></path>
                    </svg>
                  </button>
                </td>
                <td>
                  <button
                    onClick={(e) => deleteCollectionHandler(collection.id, e)}
                    type="button"
                    className="btn btn-danger"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"></path>
                    </svg>
                  </button>
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
