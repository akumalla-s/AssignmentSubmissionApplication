import React, { useEffect, useState } from "react";
import { useLocalState } from "../util/useLocalStorage";
import { Link } from "react-router-dom";
import ajax from "../Services/fetchService";

export default function Dashboard() {
  const [jwt, setJwt] = useLocalState("", "jwt");
  const [assignments, setAssignments] = useState(null);

  // fetch assignments from database
  useEffect(() => {
    ajax("api/assignments", "GET", jwt).then((assignmentsData) => {
      setAssignments(assignmentsData);
    });
  }, [jwt]);

  function createAssignment() {
    ajax("api/assignments", "POST", jwt).then((assignment) => {
      window.location.href = `/assignments/${assignment.id}`;
    });
  }

  return (
    <div style={{ margin: "2em" }}>
      {assignments ? (
        assignments.map((assignment) => (
          <div key={assignment.id}>
            <Link to={`/assignments/${assignment.id}`}>
              Assignment ID: {assignment.id}
            </Link>
          </div>
        ))
      ) : (
        <></>
      )}
      <button onClick={() => createAssignment()}>Submit New Assignment</button>
    </div>
  );
}
