import { useCallback, useEffect, useState } from "react";
import axios from "../api/axios";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router-dom";
import { TagCloud } from "react-tagcloud";
import "../styles/reactCloud.css";
import { Tag } from "primereact/tag";
import MiniSearch from "minisearch";
import { Sidebar } from "primereact/sidebar";
import { useTranslation } from "react-i18next";

const Home = () => {
  const [collections, setCollections] = useState([]);
  const [latestItems, setLatestItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [tags, setTags] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation("home");

  const miniSearch = new MiniSearch({
    fields: ["tags"],
    storeFields: ["name"],
    extractField: (document, fieldName) => {
      if (Array.isArray(document[fieldName])) {
        return document[fieldName].join(" ");
      } else {
        return document[fieldName];
      }
    },
  });

  miniSearch.addAll(latestItems);

  const getSortedCollections = useCallback(async () => {
    try {
      const response = await axios.get(`/collection/getsorted`);
      setCollections(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getAllItems = useCallback(async () => {
    try {
      const response = await axios.get("/item/getall");
      const items = response.data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          added: new Date(item.createdAt),
          tags: item.tags.map((tag) => tag.label),
        };
      });
      const sorted = items.sort((a, b) => b.added - a.added);
      setLatestItems(sorted);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getCloudTags = useCallback(async () => {
    try {
      const response = await axios.get("/item/gettags");
      setTags(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getSortedCollections();
    getAllItems();
    getCloudTags();
    setIsLoading(false);
  }, []);

  const tagClickHandler = (tag, e) => {
    const result = miniSearch.search(tag.value);
    setSearchResult(result);
    setVisible(true);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <h5 className="mb-5">{t("tagMatch")}</h5>
        <ListGroup variant="flush">
          {searchResult.map((result) => (
            <ListGroup.Item
              onClick={() => {
                navigate(`item/${result.id}`);
              }}
              action
              key={result.id + result.name}
            >
              {result.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Sidebar>
      <div className="row text-center">
        <TagCloud
          minSize={12}
          maxSize={50}
          tags={tags}
          onClick={(tag, e) => tagClickHandler(tag, e)}
        />
      </div>
      <div className="row">
        <div className="col mt-3">
          <h4 className="mb-3">{t("topCol")}</h4>
          <ListGroup variant="flush">
            {collections.map((col) => (
              <ListGroup.Item
                key={col.id}
                className="d-flex justify-content-between align-items-center"
                action
                onClick={() => navigate(`collection/${col.id}`)}
              >
                <img
                  style={{ maxWidth: 80, maxHeight: 80 }}
                  src={col.img}
                  alt="col_img"
                ></img>
                <p className="mx-2">{col.name}</p>
                <p>
                  <span className="fw-bolder">{col.itemCount}</span> items
                </p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        <div className="col mt-3">
          <h4 className="mb-3">{t("latestAdded")}</h4>
          <ListGroup variant="flush">
            {latestItems.map((item) => (
              <ListGroup.Item
                key={item.added}
                className="d-flex justify-content-between align-items-center"
                action
                onClick={() => navigate(`item/${item.id}`)}
              >
                <p className="ms-3">{item.name}</p>

                <p>
                  {item.tags.map((tag, i) => (
                    <Tag className="mx-1" key={tag + i} value={tag}></Tag>
                  ))}
                </p>
                <p>{item.added.toLocaleString()}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    </div>
  );
};

export default Home;
