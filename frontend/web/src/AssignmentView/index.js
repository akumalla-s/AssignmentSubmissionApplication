import React, { useEffect, useState } from "react";
import { useLocalState } from "../util/useLocalStorage";
import ajax from "../Services/fetchService";

export default function AssignmentView() {
  const [jwt, setJwt] = useLocalState("", "jwt");
  const assignmentId = window.location.href.split("/assignments/")[1];
  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
  });

  function updateAssignment(property, value) {
    const newAssignment = { ...assignment };
    newAssignment[property] = value;
    setAssignment(newAssignment);
  }

  function save() {
    ajax(`/api/assignments/${assignmentId}`, "PUT", jwt, assignment).then(
      (assignmentsData) => {
        setAssignment(assignmentsData);
      }
    );
  }

  useEffect(() => {
    ajax(`/api/assignments/${assignmentId}`, "GET", jwt).then(
      (assignmentsData) => {
        if (assignmentsData.branch === null) assignmentsData.branch = "";
        if (assignmentsData.githubUrl === null) assignmentsData.githubUrl = "";
        setAssignment(assignmentsData);
      }
    );
  }, []);

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
