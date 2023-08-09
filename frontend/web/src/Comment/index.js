import React from "react";
import "../App.css";
import { useUser } from "../UserProvider";
import jwt_decode from "jwt-decode";

export default function Comment(props) {
  const user = useUser();
  const decodedJwt = jwt_decode(user.jwt);

  const {
    id,
    emitEditComment,
    createdDate,
    createdBy,
    text,
    emitDeleteComment,
  } = props;
  return (
    <div className="comment-bubble">
      <div className="d-flex gap-5" style={{ fontWeight: "bold" }}>
        <div>{` ${createdBy.name}: `}</div>
        {decodedJwt.sub === createdBy.username ? (
          <>
            <div
              onClick={() => {
                emitEditComment(id);
              }}
              style={{ cursor: "pointer", color: "blue" }}
            >
              edit
            </div>
            <div
              onClick={() => {
                emitDeleteComment(id);
              }}
              style={{ cursor: "pointer", color: "red" }}
            >
              delete
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div>{text}</div>
    </div>
  );
}
