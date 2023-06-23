import React, { useEffect, useState } from "react";
import { useLocalState } from "../util/useLocalStorage";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [jwt, setJwt] = useLocalState("", "jwt");
  const [assignments, setAssignments] = useState(null);

  // fetch assignments from database
  useEffect(() => {
    fetch("api/assignments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((assignmentsData) => {
        setAssignments(assignmentsData);
      });
  }, [jwt]);

  function createAssignment() {
    fetch("api/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((assignment) => {
        window.location.href = `/assignments/${assignment.id}`;
      });
  }

  return (
    <div style={{ margin: "2em" }}>
      {assignments ? (
        assignments.map((assignment) => (
          <div>
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
