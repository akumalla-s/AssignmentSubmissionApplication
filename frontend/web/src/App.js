import { useEffect } from "react";
import { useLocalState } from "./util/useLocalStorage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Homepage from "./Homepage";

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
    <Router>
      <Routes>
        <Route exact path="/" element={ <Homepage/> } />
        <Route exact path="/dashboard" element={ <Dashboard/> } />
    </Routes>
    </Router>   
  );
}

export default App;
