import React, { useCallback, useEffect, useRef, useState } from "react";
import axios, { axiosPrivate } from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Tag } from "primereact/tag";
import ReactMarkdown from "react-markdown";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import useAuth from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

const SoloCollection = () => {
  const [collection, setCollection] = useState({});
  const [Loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [allowMarkdown, setAllowMarkdown] = useState(false);
  const [noMarkdownFields, setNoMarkdownFields] = useState(false);
  const [checkedSwitch, setCheckedSwitch] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const { auth } = useAuth();
  const { t } = useTranslation("soloCol");
  const dataTableRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();

  const getCollectionItems = useCallback(async () => {
    try {
      const response = await axios.get(`/item/${params.col_id}`);
      const formattedItems = response.data.map((item) => {
        const obj = {
          id: item.id,
          name: item.name,
          tags: item.tags.map((tag) => tag.label),
        };
        item.fieldsData.forEach((field) => {
          let value;
          switch (field.type) {
            case "textarea":
              value = <ReactMarkdown>{field.value}</ReactMarkdown>;
              break;
            case "checkbox":
              value = field.value ? "yes" : "no";
              break;
            default:
              value = field.value;
              break;
          }
          obj[field.name.toLowerCase().replaceAll(" ", "")] = value;
        });
        return obj;
      });
      setItems(formattedItems);
    } catch (error) {
      console.log(error);
    }
  }, [params.col_id]);

  const getSoloCollection = useCallback(async () => {
    try {
      const response = await axios.get(`/collection/${params.col_id}`);
      setCollection(response.data);
      const checkOwner = () => {
        if (response.data.authorId === auth.id || auth.role === 2) {
          setIsAllowed(true);
        }
      };
      checkOwner();
      setNoMarkdownFields(
        response.data.extraFields.filter((field) => field.type !== "markdown")
      );
      setFilters(() => {
        const result = {
          id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          tags: { value: null, matchMode: FilterMatchMode.CONTAINS },
        };
        response.data.extraFields.forEach((field) => {
          result[field.name.toLowerCase().replaceAll(" ", "")] = {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
          };
        });
        return result;
      });

      if (!response.data) navigate("/");
    } catch (error) {
      console.log(error);
    }
  }, [params.col_id, navigate]);

  const runAll = useCallback(async () => {
    try {
      await getSoloCollection();
      await getCollectionItems();
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    runAll();
  }, [getSoloCollection, getCollectionItems, runAll]);

  const tagsBody = (rowData, col) => {
    return rowData.tags.map((tag) => (
      <Tag
        key={tag + Math.random().toFixed(3) * 1000}
        className="me-1 mt-1"
        value={tag}
      />
    ));
  };

  const onRowClickHandler = ({ data, index }) => {
    navigate(`/item/${data.id}`);
  };

  const deleteItemHandler = async (id) => {
    try {
      await axiosPrivate.post(`/item/${id}/delete`);
      await getCollectionItems();
    } catch (error) {
      console.log(error);
    }
  };

  const exportCSV = (selectionOnly) => {
    dataTableRef.current.exportCSV({ selectionOnly });
  };

  const actionsBody = (rowData) => {
    return (
      <div className="d-flex justify-content-center">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="me-3"
          onClick={() =>
            navigate(`/item/${rowData.id}/edit`, {
              state: { from: collection.id },
            })
          }
        />
        <Button
          icon="pi pi-trash"
          rounded
          severity="danger"
          onClick={() => deleteItemHandler(rowData.id)}
        />
      </div>
    );
  };

  const headerTemplate = () => {
    return (
      <div
        style={{ height: 18 }}
        className="d-flex justify-content-end align-items-center"
      >
        <div className="d-flex">
          <label className="fw-light me-3" htmlFor="switch">
            {t("allowMarkdown")}
          </label>
          <InputSwitch
            id="switch"
            checked={checkedSwitch}
            onChange={(e) => {
              setCheckedSwitch(e.value);
              setAllowMarkdown(e.value);
            }}
          />
        </div>
        <Link
          hidden={!isAllowed}
          to={`/collection/${params.col_id}/newitem`}
          type="button"
          className="btn btn-secondary mx-3"
        >
          {t("newItem")}
        </Link>
        <Button
          size="sm"
          type="button"
          label={t("exportCSV")}
          icon="pi pi-file"
          onClick={() => exportCSV(false)}
          data-pr-tooltip="CSV"
        ></Button>
      </div>
    );
  };

  if (!Loaded) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="row gap-2 align-items-center">
        <div className="col-1">
          <img
            style={{ maxHeight: 80, maxWidth: 80 }}
            src={collection.imageUrl}
            alt="col_img"
          />
        </div>
        <div className="col me-3 text-start">
          <h5>{collection.name}</h5>
        </div>
      </div>
      <div className="row my-3">
        <DataTable
          ref={dataTableRef}
          header={headerTemplate}
          showGridlines
          rowHover
          role={"button"}
          onRowClick={onRowClickHandler}
          filters={filters}
          filterDisplay="row"
          removableSort
          value={items}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            align="center"
            style={{ maxWidth: 150 }}
            filter
            sortable
            field="id"
            header="ID"
          ></Column>
          <Column
            align="center"
            filter
            sortable
            field="name"
            header={t("name")}
          ></Column>
          <Column
            align="center"
            filter
            sortable
            field="tags"
            body={tagsBody}
            header={t("tags")}
          ></Column>
          {collection.extraFields
            .filter((field) => {
              if (!allowMarkdown && field.type === "markdown") {
                return false;
              } else {
                return true;
              }
            })
            .map((field) => {
              if (field.type === "markdown") {
                return (
                  <Column
                    exportable={false}
                    align="left"
                    key={field.id}
                    field={field.name.toLowerCase().replaceAll(" ", "")}
                    header={field.name}
                  />
                );
              }
              return (
                <Column
                  align="center"
                  filter
                  sortable
                  key={field.id}
                  field={field.name.toLowerCase().replaceAll(" ", "")}
                  header={field.name}
                />
              );
            })}
          <Column
            hidden={!isAllowed}
            body={actionsBody}
            exportable={false}
            style={{ width: "8rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default SoloCollection;
