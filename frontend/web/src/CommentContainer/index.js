import React, { useEffect, useState } from "react";
import ajax from "../Services/fetchService";
import { useUser } from "../UserProvider";
import { Button, Col, Row } from "react-bootstrap";
import Comment from "../Comment";
import useInterval from "../util/useInterval";
import dayjs from "dayjs";

export default function CommentContainer(props) {
  const { assignmentId } = props;
  const user = useUser();

  const emptyComment = {
    id: null,
    text: "",
    assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
    user: user.jwt,
    createdDate: null,
  };

  const [comment, setComment] = useState(emptyComment);
  const [comments, setComments] = useState([]);

  useInterval(() => {
    updateCommentTimeDisplay();
  }, 1000 * 5);
  function updateCommentTimeDisplay() {
    const commentsCopy = [...comments];
    commentsCopy.forEach(
      (comment) => (comment.createdDate = dayjs(comment.createdDate))
    );
    formatComments(commentsCopy);
  }

  function handleEditComment(commentId) {
    const i = comments.findIndex((comment) => comment.id === commentId);
    const commentCopy = {
      id: comments[i].id,
      text: comments[i].text,
      assignmentId: assignmentId != null ? parseInt(assignmentId) : null,
      user: user.jwt,
      createdDate: comments[i].createdDate,
    };
    setComment(commentCopy);
  }

  function handleDeleteComment(commentId) {
    //TODO: send DELETE request to server
    ajax(`/api/comments/${commentId}`, "DELETE", user.jwt).then((msg) => {
      const commentsCopy = [...comments];
      const i = commentsCopy.findIndex((comment) => commentId === comment.id);
      commentsCopy.splice(i, 1);
      formatComments(commentsCopy);
    });
  }

  function formatComments(commentsCopy) {
    commentsCopy.forEach((comment) => {
      if (typeof comment.createDate === "string") {
        comment.createDate = dayjs(comment.createDate);
      }
    });
    setComments(commentsCopy);
  }

  useEffect(() => {
    ajax(
      `/api/comments?assignmentId=${assignmentId}`,
      "GET",
      user.jwt,
      null
    ).then((commentsData) => {
      formatComments(commentsData);
    });
  }, []);

  function updateComment(value) {
    const commentCopy = { ...comment };
    commentCopy.text = value;
    setComment(commentCopy);
  }

  function submitComment() {
    if (comment.id) {
      ajax(`/api/comments/${comment.id}`, "PUT", user.jwt, comment).then(
        (d) => {
          const commentsCopy = [...comments];
          const i = commentsCopy.findIndex((comment) => comment.id === d.id);
          commentsCopy[i] = d;
          formatComments(commentsCopy);
          setComment(emptyComment);
        }
      );
    } else {
      ajax(`/api/comments`, "POST", user.jwt, comment).then((d) => {
        const commentsCopy = [...comments];
        commentsCopy.push(d);
        formatComments(commentsCopy);
        setComment(emptyComment);
      });
    }
  }

  return (
    <>
      <div className="mt-5">
        <h4>Comments</h4>
      </div>
      <Row>
        <Col lg="8" md="10" sm="12">
          <textarea
            style={{ width: "100%", borderRadius: "0.25em" }}
            onChange={(e) => updateComment(e.target.value)}
            value={comment.text}
          ></textarea>
        </Col>
      </Row>
      <Button onClick={() => submitComment()}>Post Comment</Button>
      <div className="mt-5">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            commentData={comment}
            emitDeleteComment={handleDeleteComment}
            emitEditComment={handleEditComment}
          />
        ))}
      </div>
    </>
  );
}
