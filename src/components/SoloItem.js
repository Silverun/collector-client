import { useCallback, useEffect, useState } from "react";
import { Await, useParams } from "react-router-dom";
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

const SoloItem = () => {
  const params = useParams();
  const [curItem, setCurrentItem] = useState();
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heartToggle, setHeartToggle] = useState(false);

  const [commentInput, setCommentInput] = useState("");
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const getItem = useCallback(async () => {
    try {
      const response = await axios.post(`item/${params.item_id}`);
      console.log("CurItem", response.data);
      setCurrentItem(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [params.item_id]);

  const getItemComments = useCallback(async () => {
    try {
      const response = await axios.get(`item/${params.item_id}/getcomments`);
      console.log("comments", response.data);
      setComments(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [params.item_id]);

  const getItemLikes = useCallback(async () => {
    try {
      const response = await axios.get(`item/${params.item_id}/getlikes`);
      console.log("likes", response.data);
      const locatedUser = response.data.some(
        (like) => like.byUserId === auth.id
      );
      if (locatedUser) setHeartToggle(true);

      setLikes(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [params.item_id]);

  useEffect(() => {
    getItem();
    getItemLikes();
    getItemComments();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [getItem, getItemComments, getItemLikes]);

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
    console.log(commentData);
    try {
      const response = await axiosPrivate.post("item/addcoment", commentData);
      console.log(response.data);
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
        const response = await axiosPrivate.post("/item/addlike", likeData);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
      await getItemLikes();
    }
    if (heartToggle) {
      setHeartToggle(false);
      try {
        const response = await axiosPrivate.get(
          `item/${params.item_id}/removelike/${auth.id}`
        );
        console.log(response.data);
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
      <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
    );

  return (
    <>
      <Container fluid="md">
        <Row>
          <Col>
            <h3>{curItem.name}</h3>
            <i
              role="button"
              onClick={likeHandler}
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
        {curItem.fieldsData.map((field) => {
          return (
            <Panel
              key={field.id}
              toggleable
              header={field.name}
              className="mt-3"
            >
              {fieldData(field)}
            </Panel>
          );
        })}
        <Row className="my-3">
          <Panel header="Comments" className="mt-3">
            <div className="p-inputgroup flex-1">
              <InputText
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add new comment"
              />
              <Button onClick={addCommentHandler} label="Add" />
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
