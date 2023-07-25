import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Homepage from "./Homepage";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import AssignmentView from "./AssignmentView";
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from "jwt-decode";
import { useState } from "react";
import { useLocalState } from "./util/useLocalStorage";
import CodeReviewerDashboard from "./CodeReviewerDashboard";
import CodeReviewerAssignmentView from "./CodeReviewerAssignmentView";

function App() {
  const [jwt, setJwt] = useLocalState("","jwt");
  const [roles, setRoles] = useState(getRoleFromJWT());

  function getRoleFromJWT(){
    if(jwt){
      const decodedJWT = jwt_decode(jwt);
      return decodedJWT.authorities;
    }
    return [];
  }
  return (
    <Router>
      <Routes>

        <Route exact path="/" element={<Homepage />} />

        <Route
          exact
          path="/dashboard"
          element={roles.find((role)=> role === "ROLE_CODE_REVIEWER") ? (
            <PrivateRoute>
              <CodeReviewerDashboard/>
            </PrivateRoute>
          ) :(
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>)}
        />

        <Route
          exact
          path="/assignments/:id"
          element={
            roles.find((role)=> role === "ROLE_CODE_REVIEWER") ? (
              <PrivateRoute>
                <CodeReviewerAssignmentView/>
              </PrivateRoute>
            ) :(
            <PrivateRoute>
              <AssignmentView/>
            </PrivateRoute>)
          }
        />

        <Route exact path="/login" element={<Login />} />
        
      </Routes>
    </Router>
  );
}

export default App;
