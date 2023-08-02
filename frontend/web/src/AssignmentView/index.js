import React, { useEffect, useRef, useState } from "react";
import ajax from "../Services/fetchService";
import {
  Form,
  Button,
  Col,
  Row,
  Container,
  DropdownButton,
  ButtonGroup,
  Dropdown,
} from "react-bootstrap";
import StatusBadge from "../StatusBadge";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../UserProvider";

export default function AssignmentView() {
  let navigate = useNavigate();
  const user = useUser();
  const {assignmentId} = useParams();
  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
    number: null,
    status: null,
  });
  const [assignmentEnums, setAssignmentEnums] = useState([]);
  const [assignmentStatuses, setAssignmentStatuses] = useState([]);
  const [comment, setComment] = useState({
    text: "",
    assignmentId,
    user: user.jwt,
  });
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
    // This implies that the student is submitting the assignment for the first time
    if (status && assignment.status != status) {
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

  function submitComment() {
    ajax(`/api/comments`, "POST", user.jwt, comment).then((comment) => {
      console.log(comment);
    });
  }

  function updateComment(value) {
    const commentCopy = { ...comment };
    commentCopy.text = value;
    setComment(commentCopy);
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
          <Form.Group as={Row} className="my-3" controlId="assignmentName">
            <Form.Label column sm="3" md="2">
              Assignment Number:
            </Form.Label>
            <Col sm="9" md="8" lg="6">
              <DropdownButton
                as={ButtonGroup}
                variant={"info"}
                title={
                  assignment.number
                    ? `Assignment ${assignment.number}`
                    : "Select an Assignment"
                }
                onSelect={(selectedElement) => {
                  updateAssignment("number", selectedElement);
                }}
              >
                {assignmentEnums.map((assignmentEnum) => (
                  <Dropdown.Item
                    key={assignmentEnum.assignmentNum}
                    eventKey={assignmentEnum.assignmentNum}
                  >
                    {assignmentEnum.assignmentNum},{" "}
                    {assignmentEnum.assignmentName}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-3" controlId="githubUrl">
            <Form.Label column sm="3" md="2">
              Github URL:
            </Form.Label>
            <Col sm="9" md="8" lg="6">
              <Form.Control
                type="url"
                placeholder="http://github.com/username/repo-name"
                value={assignment.githubUrl}
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
                onChange={(e) => updateAssignment("branch", e.target.value)}
              />
            </Col>
          </Form.Group>

          {assignment.status === "Completed" ? (
            <>
              <Form.Group
                as={Row}
                className="d-flex align-items-center mb-3"
                controlId="branch"
              >
                <Form.Label column sm="3" md="2">
                  Code Review Vidoe URL:
                </Form.Label>
                <Col sm="9" md="8" lg="6">
                  <a
                    href={assignment.codeReviewVideoUrl}
                    style={{ fontWeight: "bold" }}
                  >
                    {assignment.codeReviewVideoUrl}
                  </a>
                </Col>
              </Form.Group>

              <div className="d-flex gap-5">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  Back
                </Button>
              </div>
            </>
          ) : assignment.status === "Pending Submission" ? (
            <div className="d-flex gap-5">
              <Button size="lg" onClick={() => save("Submitted")}>
                Submit Assignment
              </Button>
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
          ) : (
            <div className="d-flex gap-5">
              <Button size="lg" onClick={() => save("Resubmitted")}>
                Resubmit Assignment
              </Button>
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
          )}

          <div className="mt-5">
            <textarea
              style={{ width: "100%", borderRadius: "0.25em" }}
              onChange={(e) => updateComment(e.target.value)}
            ></textarea>
          </div>
          <Button
            onClick={() => {
              submitComment();
            }}
          >
            Post Comment
          </Button>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}
