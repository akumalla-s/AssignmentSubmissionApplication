import React, { useEffect, useState } from "react";
import { useLocalState } from "../util/useLocalStorage";
import ajax from "../Services/fetchService";
import {
  Form,
  Button,
  Col,
  Row,
  Container,
  Badge,
  DropdownButton,
  ButtonGroup,
  Dropdown,
} from "react-bootstrap";

export default function AssignmentView() {
  const [jwt, setJwt] = useLocalState("", "jwt");
  const assignmentId = window.location.href.split("/assignments/")[1];
  const [assignment, setAssignment] = useState({
    branch: "",
    githubUrl: "",
    number: null,
    status: null,
  });
  const [assignmentEnums, setAssignmentEnums] = useState([]);
  const [assignmentStatuses, setAssignmentStatuses] = useState([]);

  useEffect(() => {
    ajax(`/api/assignments/${assignmentId}`, "GET", jwt).then(
      (assignmentsResponse) => {
        let assignmentsData = assignmentsResponse.assignment;
        if (assignmentsData.branch === null) assignmentsData.branch = "";
        if (assignmentsData.githubUrl === null) assignmentsData.githubUrl = "";
        setAssignment(assignmentsData);
        setAssignmentEnums(assignmentsResponse.assignmentEnums);
        setAssignmentStatuses(assignmentsResponse.statusEnums);
      }
    );
  }, [assignmentId, jwt]);

  function updateAssignment(property, value) {
    const newAssignment = { ...assignment };
    newAssignment[property] = value;
    setAssignment(newAssignment);
  }

  function save() {
    // This implies that the student is submitting the assignment for the first time
    let updatedAssignment = { ...assignment };
    if (assignment.status === assignmentStatuses[0].status) {
      updatedAssignment = {
        ...assignment,
        status: assignmentStatuses[1].status,
      };
    }

    ajax(
      `/api/assignments/${assignmentId}`,
      "PUT",
      jwt,
      updatedAssignment
    ).then((assignmentsData) => {
      setAssignment(assignmentsData);
    });
  }

  return (
    <Container className="mt-5">
      <Row className="d-flex align-items-center">
        <Col>
          {assignment.number ? <h1>Assignment {assignment.number}</h1> : <></>}
        </Col>
        <Col>
          <Badge pill bg="info" style={{ fontSize: "1em" }}>
            {assignment.status}
          </Badge>
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
          <div className="d-flex gap-5">
            <Button size="lg" onClick={() => save()}>
              Submit Assignment
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              Back
            </Button>
          </div>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}
