import { useEffect } from "react";
import { useLocalState } from "./util/useLocalStorage";

function App() {
  const [jwt, setJwt] = useLocalState("", "jwt");

  useEffect(() => {
    if(!jwt){
      const reqBody = {
        username: "test",
        password: "test",
      };
  
      fetch("api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      })
        .then((response) => Promise.all([response.json(), response.headers]))
        .then(([body, headers]) => {
          setJwt(headers.get("authorization"));
        });
    }
  }, [jwt, setJwt]);

  return (
    <div className="App">
      <h1>Hello World!</h1>
      <div>Jwt value is {jwt}</div>
    </div>
  );
}

export default App;
