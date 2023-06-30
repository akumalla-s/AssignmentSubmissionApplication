import { useState } from "react";
import { useLocalState } from "../util/useLocalStorage";
import ajax from "../Services/fetchService";
import { Button, Col, Container, Row, Form } from "react-bootstrap";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [jwt, setJwt] = useLocalState("", "jwt");

  function sendLoginRequest() {
    const reqBody = {
      username: username,
      password: password,
    };

    ajax("api/auth/login", "POST", null, reqBody, "loginRequest")
      .then(([body, headers]) => {
        setJwt(headers.get("authorization"));
        window.location.href = "dashboard";
      })
      .catch((message) => {
        alert(message);
      });
  }
  return (
    <>
      <Container className="mt-5">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="fs-4">
            Username
          </Form.Label>
          <Form.Control
            type="text"
            size="lg"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="fs-4">
            Password
          </Form.Label>
          <Form.Control
            type="password"
            size="lg"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button
          className="mt-2"
          variant="primary"
          size="lg"
          id="submit"
          type="button"
          onClick={() => sendLoginRequest()}
        >
          Login
        </Button>
      </Container>
    </>
  );
}
