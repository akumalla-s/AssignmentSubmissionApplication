import { useState } from "react";
import { useLocalState } from "../util/useLocalStorage";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Login() {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [jwt, setJwt] = useLocalState("", "jwt");

  function sendLoginRequest() {
    const reqBody = {
      username: username,
      password: password,
    };

    fetch("/api/auth/login",{
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(reqBody),
    })
    .then((response) => {
      if(response.status === 200){
        return Promise.all([response.json(), response.headers]);
      }else{
        return Promise.reject("Invalid login attempt");
      }
    })
    .then(([body, headers]) => {
      setJwt(headers.get("authorization"));
      navigate("/dashboard", {replace: true});
    }).catch((message) => {
      alert(message);
    })
  }
  return (
    <>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md="8" lg="6">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="fs-4">Username</Form.Label>
              <Form.Control
                type="text"
                size="lg"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md="8" lg="6">
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="fs-4">Password</Form.Label>
              <Form.Control
                type="password"
                size="lg"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col
            md="8"
            lg="6"
            className="mt-2 d-flex flex-column gap-5 flex-md-row justify-content-md-between"
          >
            <Button
              variant="primary"
              size="lg"
              id="submit"
              type="button"
              onClick={() => sendLoginRequest()}
            >
              Login
            </Button>
            <Button
              variant="secondary"
              size="lg"
              id="submit"
              type="button"
              onClick={() => (navigate("/"))}
            >
              Exit
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
