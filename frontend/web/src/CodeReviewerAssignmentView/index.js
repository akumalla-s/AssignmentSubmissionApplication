import React, { useEffect, useRef, useState } from "react";
import ajax from "../Services/fetchService";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import StatusBadge from "../StatusBadge";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../UserProvider";
import CommentContainer from "../CommentContainer";

export default function CodeReviewerAssignmentView() {
  let navigate = useNavigate();
  const user = useUser();
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
    number: null,
    status: null,
  });
  const [assignmentEnums, setAssignmentEnums] = useState([]);
  const [assignmentStatuses, setAssignmentStatuses] = useState([]);
  const prevAssignmentValue = useRef(assignment);

  useEffect(() => {
    if (
      assignment &&
      prevAssignmentValue.current.status !== assignment.status
    ) {
      persist();
    }
    prevAssignmentValue.current = assignment;
  }, [assignment]);

  useEffect(() => {
    ajax(`/api/assignments/${assignmentId}`, "GET", user.jwt).then(
      (assignmentsResponse) => {
        let assignmentsData = assignmentsResponse.assignment;
        if (assignmentsData.branch === null) assignmentsData.branch = "";
        if (assignmentsData.githubUrl === null) assignmentsData.githubUrl = "";
        setAssignment(assignmentsData);
        setAssignmentEnums(assignmentsResponse.assignmentEnums);
        setAssignmentStatuses(assignmentsResponse.statusEnums);
      }
    );
  }, [assignmentId, user.jwt]);

  function updateAssignment(property, value) {
    const newAssignment = { ...assignment };
    newAssignment[property] = value;
    setAssignment(newAssignment);
  }

  function save(status) {
    if (status && assignment.status !== status) {
      updateAssignment("status", status);
    } else {
      persist();
    }
  }

  function persist() {
    ajax(`/api/assignments/${assignmentId}`, "PUT", user.jwt, assignment).then(
      (assignmentsData) => {
        setAssignment(assignmentsData);
      }
    );
  }

  return (
    <Container className="mt-5">
      <Row className="d-flex align-items-center">
        <Col>
          {assignment.number ? <h1>Assignment {assignment.number}</h1> : <></>}
        </Col>
        <Col>
          <StatusBadge text={assignment.status} />
        </Col>
      </Row>

      {assignment ? (
        <>
          <Form.Group as={Row} className="my-3" controlId="githubUrl">
            <Form.Label column sm="3" md="2">
              Github URL:
            </Form.Label>
            <Col sm="9" md="8" lg="6">
              <Form.Control
                type="url"
                placeholder="http://github.com/username/repo-name"
                value={assignment.githubUrl}
                readOnly
                onChange={(e) => updateAssignment("githubUrl", e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="branch">
            <Form.Label column sm="3" md="2">
              Branch:
            </Form.Label>
            <Col sm="9" md="8" lg="6">
              <Form.Control
                type="text"
                placeholder="Type in branch name"
                value={assignment.branch}
                readOnly
                onChange={(e) => updateAssignment("branch", e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="videoreviewurl">
            <Form.Label column sm="3" md="2">
              Video Review URL:
            </Form.Label>
            <Col sm="9" md="8" lg="6">
              <Form.Control
                type="text"
                placeholder="http://screencast-o-matic.com/something"
                value={assignment.codeReviewVideoUrl}
                onChange={(e) =>
                  updateAssignment("codeReviewVideoUrl", e.target.value)
                }
              />
            </Col>
          </Form.Group>

          <div className="d-flex gap-5">
            {assignment.status === "Completed" ? (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => save(assignmentStatuses[2].status)}
              >
                Re-Claim
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => save(assignmentStatuses[4].status)}
              >
                Complete Review
              </Button>
            )}

            {assignment.status === "Needs Update" ? (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => save(assignmentStatuses[2].status)}
              >
                Re-Claim
              </Button>
            ) : (
              <Button
                size="lg"
                variant="danger"
                onClick={() => save(assignmentStatuses[3].status)}
              >
                Reject Assignment
              </Button>
            )}

            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Back
            </Button>
          </div>
          <CommentContainer assignmentId={assignmentId} />
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}
