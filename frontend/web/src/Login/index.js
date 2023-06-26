import { useState } from "react";
import { useLocalState } from "../util/useLocalStorage";
import ajax from "../Services/fetchService";

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
      <div>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button id="submit" type="button" onClick={() => sendLoginRequest()}>
          Login
        </button>
      </div>
    </>
  );
}
