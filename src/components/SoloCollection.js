import React, { useCallback, useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { TriStateCheckbox } from "primereact/tristatecheckbox";

const SoloCollection = () => {
  const [collection, setCollection] = useState({});
  const [Loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  // const [filters, setFilters] = useState(null);
  const [filters, setFilters] = useState({});

  // id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  //   name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  //   tags: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //   details: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //   dateofpurchase: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //   details: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //   flavoured: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //   year: { value: null, matchMode: FilterMatchMode.CONTAINS },

  const params = useParams();
  const navigate = useNavigate();

  const getCollectionItems = useCallback(async () => {
    try {
      const response = await axios.get(`/item/${params.col_id}`);
      // console.log(response.data);
      const formattedItems = response.data.map((item) => {
        const obj = {
          id: item.id,
          name: item.name,
          tags: item.tags.map((tag) => tag.label),
        };
        item.fieldsData.forEach((field) => {
          obj[field.name.toLowerCase().replaceAll(" ", "")] = field.value;
        });
        return obj;
      });
      setItems(formattedItems);
      console.log("set Items", formattedItems);
    } catch (error) {
      console.log(error);
    }
  }, [params.col_id]);

  const getSoloCollection = useCallback(async () => {
    try {
      const response = await axios.get(`/collection/${params.col_id}`);

      setCollection(response.data);
      console.log("set collection", response.data);

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
        console.log("set filters", result);
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

  const tagsBody = (rowData) => {
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

  if (!Loaded) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-2">
          <img
            style={{ maxHeight: 80, maxWidth: 80 }}
            src={collection.imageUrl}
            alt="col_img"
          />
        </div>
        <div className="col text-center">
          <h5>{collection.name}</h5>
        </div>
      </div>
      <div className="row my-3">
        <div className="card">
          <DataTable
            // showGridlines
            rowHover
            role={"button"}
            onRowClick={onRowClickHandler}
            filters={filters}
            filterDisplay="row"
            removableSort
            value={items}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column filter sortable field="id" header="ID"></Column>
            <Column filter sortable field="name" header="Name"></Column>
            <Column
              filter
              sortable
              field="tags"
              body={tagsBody}
              header="Tags"
            ></Column>
            {collection.extraFields &&
              collection.extraFields.map((field) => (
                <Column
                  filter
                  sortable
                  key={field.id}
                  field={field.name.toLowerCase().replaceAll(" ", "")}
                  header={field.name}
                />
              ))}
          </DataTable>
        </div>
      </div>
      <div className="row">
        <Link
          to={`/collection/${params.col_id}/newitem`}
          type="button"
          className="btn btn-secondary w-25"
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
      </div>
    </div>
  );
};

export default SoloCollection;
