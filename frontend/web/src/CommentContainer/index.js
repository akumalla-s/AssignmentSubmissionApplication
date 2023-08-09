import React, { useEffect, useState } from "react";
import ajax from "../Services/fetchService";
import { useUser } from "../UserProvider";
import { Button } from "react-bootstrap";
import Comment from "../Comment";

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

  useEffect(() => {
    ajax(
      `/api/comments?assignmentId=${assignmentId}`,
      "GET",
      user.jwt,
      null
    ).then((commentsData) => {
      setComments(commentsData);
    });
  }, []);

  function submitComment() {
    if (comment.id) {
      ajax(`/api/comments/${comment.id}`, "PUT", user.jwt, comment).then(
        (d) => {
          const commentsCopy = [...comments];
          const i = commentsCopy.findIndex((comment) => comment.id === d.id);
          commentsCopy[i] = d;
          setComments(commentsCopy);
          setComment(emptyComment);
        }
      );
    } else {
      ajax(`/api/comments`, "POST", user.jwt, comment).then((d) => {
        const commentsCopy = [...comments];
        commentsCopy.push(d);
        setComments(commentsCopy);
        setComment(emptyComment);
      });
    }
  }

  function updateComment(value) {
    const commentCopy = { ...comment };
    commentCopy.text = value;
    setComment(commentCopy);
  }

  function handleDeleteComment(commentId) {
    //TODO: send DELETE request to server
    ajax(`/api/comments/${commentId}`, "DELETE", user.jwt).then((msg) => {
      const commentsCopy = [...comments];
      const i = commentsCopy.findIndex((comment) => commentId === comment.id);
      commentsCopy.splice(i, 1);
      setComments(commentsCopy);
    });
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

  return (
    <>
      <div className="mt-5">
        <textarea
          style={{ width: "100%", borderRadius: "0.25em" }}
          onChange={(e) => updateComment(e.target.value)}
          value={comment.text}
        ></textarea>
        <Button onClick={() => submitComment()}>Post Comment</Button>
      </div>
      <div className="mt-5">
        {comments.map((comment) => (
          <Comment
            createdDate={comment.createdDate}
            createdBy={comment.createdBy}
            text={comment.text}
            emitDeleteComment={handleDeleteComment}
            emitEditComment={handleEditComment}
            id={comment.id}
          />
        ))}
      </div>
    </>
  );
}
