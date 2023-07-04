import React, { useEffect, useState } from "react";
import { useLocalState } from "../util/useLocalStorage";
import ajax from "../Services/fetchService";
import { Form, Button, Col, Row, Container, Badge, DropdownButton, ButtonGroup, Dropdown } from "react-bootstrap";

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
    <Container className="mt-5">
      <Row className="d-flex align-items-center">
        <Col>
          <h1>Assignment {assignmentId}</h1>
        </Col>
        <Col>
          <Badge pill bg="info" style={{ fontSize: "1em" }}>
            {assignment.status}
          </Badge>
        </Col>
      </Row>

      {assignment ? (
        <>
          <Form.Group as={Row} className="my-3" controlId="formPlaintextEmail">
            <Form.Label column sm="3" md="2">
              Assignment Number:
            </Form.Label>
            <Col sm="9" md="8" lg="6">
              <DropdownButton
                as={ButtonGroup}
                id="assignmentName"
                variant={"info"}
                title="Assignment 1"
              >
                {[1,2,3,4,5,6].map(assignmentNum => <Dropdown.Item eventKey={assignmentNum}>{assignmentNum}</Dropdown.Item>)}
              </DropdownButton>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="my-3" controlId="formPlaintextEmail">
            <Form.Label column sm="3" md="2">
              Github URL:
            </Form.Label>
            <Col sm="9" md="8" lg="6">
              <Form.Control
                type="url"
                id="githubUrl"
                placeholder="http://github.com/username/repo-name"
                value={assignment.githubUrl}
                onChange={(e) => updateAssignment("githubUrl", e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="3" md="2">
              Branch:
            </Form.Label>
            <Col sm="9" md="8" lg="6">
              <Form.Control
                type="text"
                id="branch"
                placeholder="Type in branch name"
                value={assignment.branch}
                onChange={(e) => updateAssignment("branch", e.target.value)}
              />
            </Col>
          </Form.Group>
          <Button size="lg" onClick={() => save()}>
            Submit Assignment
          </Button>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}
