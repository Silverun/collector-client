import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Tag } from "primereact/tag";
import ReactMarkdown from "react-markdown";
import { Panel } from "primereact/panel";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../styles/SoloItem.css";
import { useTranslation } from "react-i18next";

const SoloItem = () => {
  const params = useParams();
  const [curItem, setCurrentItem] = useState();
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heartToggle, setHeartToggle] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { t } = useTranslation("soloItem");

  const getItem = useCallback(async () => {
    try {
      const response = await axios.post(`item/${params.item_id}`);
      setCurrentItem(response.data);
      const checkOwner = () => {
        if (response.data.authorId === auth.id || auth.role === 2) {
          setIsAllowed(true);
        }
      };
      checkOwner();
    } catch (error) {
      console.log(error);
    }
  }, [params.item_id]);

  const getItemComments = useCallback(async () => {
    try {
      const response = await axios.get(`item/${params.item_id}/getcomments`);
      setComments(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [params.item_id]);

  const getItemLikes = useCallback(async () => {
    try {
      const response = await axios.get(`item/${params.item_id}/getlikes`);
      const locatedUser = response.data.some(
        (like) => like.byUserId === auth.id
      );
      if (locatedUser) setHeartToggle(true);
      setLikes(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [params.item_id]);

  const runAll = useCallback(async () => {
    try {
      await getItem();
      await getItemLikes();
      await getItemComments();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [getItem, getItemComments, getItemLikes]);

  useEffect(() => {
    runAll();
  }, [runAll]);

  useEffect(() => {
    const interval = setInterval(() => getItemComments(), 5000);
    return () => {
      clearInterval(interval);
    };
  });

  const addCommentHandler = async () => {
    const commentData = {
      value: commentInput,
      byUserName: auth.username,
      byUserId: auth.id,
      itemId: curItem.id,
    };
    try {
      await axiosPrivate.post("item/addcoment", commentData);
    } catch (error) {
      console.log(error);
    }
    setCommentInput("");
    await getItemComments();
  };

  const likeHandler = async () => {
    const likeData = {
      byUserId: auth.id,
      itemId: curItem.id,
    };
    if (!heartToggle) {
      setHeartToggle(true);
      try {
        await axiosPrivate.post("/item/addlike", likeData);
      } catch (error) {
        console.error(error);
      }
      await getItemLikes();
    }
    if (heartToggle) {
      setHeartToggle(false);
      try {
        await axiosPrivate.get(`item/${params.item_id}/removelike/${auth.id}`);
      } catch (error) {
        console.error(error);
      }
      await getItemLikes();
    }
  };

  const fieldData = (field) => {
    if (field.type === "checkbox") {
      return field.value ? (
        <i className="pi pi-check" style={{ color: "slateblue" }}></i>
      ) : (
        <i className="pi pi-times" style={{ color: "red" }}></i>
      );
    } else if (field.type === "textarea") {
      return <ReactMarkdown>{field.value}</ReactMarkdown>;
    } else {
      return <p>{field.value}</p>;
    }
  };

  const commentDate = (dateISO) => {
    const date = new Date(dateISO);
    const formattedDate = `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
    return formattedDate;
  };

  if (isLoading)
    return (
      <div className="container d-flex justify-content-center">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
      </div>
    );

  return (
    <>
      <Container fluid="sm">
        <Row>
          <Col>
            <h3>{curItem.name}</h3>
            <i
              role="button"
              onClick={auth.id ? likeHandler : null}
              className={heartToggle ? "pi pi-heart-fill" : "pi pi-heart"}
              style={{ color: "red", marginRight: 10, fontSize: 20 }}
            ></i>
            <span style={{ fontSize: 18 }} className="me-3">
              {likes.length}
            </span>
            {curItem.tags.map((tag) => (
              <Tag
                key={Math.random().toFixed(3) * 1000}
                className="mx-1 mt-1"
                value={tag.label}
              />
            ))}
          </Col>
        </Row>
        <Row className="mt-3">
          {curItem.fieldsData.map((field) => {
            return (
              <Col key={field.id}>
                <Panel
                  key={field.id}
                  toggleable
                  header={field.name}
                  className="mt-3"
                >
                  {fieldData(field)}
                </Panel>
              </Col>
            );
          })}
        </Row>
        <Row>
          <Panel header={t("comments")} className="my-5">
            <div hidden={!auth.id} className="p-inputgroup flex-1">
              <InputText
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={t("addNewComment")}
              />
              <Button onClick={addCommentHandler} label=" + " />
            </div>
            {comments.map((comment) => (
              <div key={comment.id} className="card my-3">
                <Card
                  subTitle={commentDate(comment.createdAt)}
                  title={comment.byUserName}
                >
                  <p className="m-0">{comment.value}</p>
                </Card>
              </div>
            ))}
          </Panel>
        </Row>
      </Container>
    </>
  );
};

export default SoloItem;
