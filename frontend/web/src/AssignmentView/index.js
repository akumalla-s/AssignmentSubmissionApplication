import React, { useEffect, useState } from "react";
import { useLocalState } from "../util/useLocalStorage";

export default function AssignmentView() {
  const [jwt, setJwt] = useLocalState("", "jwt");
  const assignmentId = window.location.href.split("/assignments/")[1];
  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
  });

  function updateAssignment(property, value) {
    const newAssignment = {...assignment};
    newAssignment[property] = value;
    setAssignment(newAssignment);
  }

  function save() {
    fetch(`/api/assignments/${assignmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(assignment),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((assignmentsData) => {
        setAssignment(assignmentsData);
      });
  }

  useEffect(() => {
    fetch(`/api/assignments/${assignmentId}`, {
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
        setAssignment(assignmentsData);
      });
  }, [jwt]);

  return (
    <div>
      <h1>Assignment {assignmentId}</h1>
      {assignment ? (
        <>
          <h2>Status: {assignment.status} </h2>
          <h3>
            Github URL:{" "}
            <input
              type="url"
              id="githubUrl"
              value={assignment.githubUrl}
              onChange={(e) => updateAssignment("githubUrl", e.target.value)}
            />
          </h3>
          <h3>
            Branch:{" "}
            <input
              type="text"
              id="branch"
              value={assignment.branch}
              onChange={(e) => updateAssignment("branch", e.target.value)}
            />
          </h3>
          <button onClick={() => save()}>Submit Assignment</button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
