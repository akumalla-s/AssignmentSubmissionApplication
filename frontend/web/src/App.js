import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Homepage from "./Homepage";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import AssignmentView from "./AssignmentView";
import "bootstrap/dist/css/bootstrap.min.css";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import CodeReviewerDashboard from "./CodeReviewerDashboard";
import CodeReviewerAssignmentView from "./CodeReviewerAssignmentView";
import { useUser } from "./UserProvider";

function App() {

  const user = useUser();
  const [roles, setRoles] = useState(getRoleFromJWT());

  function getRoleFromJWT() {
    if (user.jwt) {
      const decodedJWT = jwt_decode(user.jwt);
      return decodedJWT.authorities;
    }
    return [];
  }

  useEffect(() => {
    setRoles(getRoleFromJWT());
  }, [user.jwt]);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Homepage />} />

        <Route
          exact
          path="/dashboard"
          element={
            roles.find((role) => role === "ROLE_CODE_REVIEWER") ? (
              <PrivateRoute>
                <CodeReviewerDashboard />
              </PrivateRoute>
            ) : (
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            )
          }
        />

        <Route
          exact
          path="/assignments/:id"
          element={
            roles.find((role) => role === "ROLE_CODE_REVIEWER") ? (
              <PrivateRoute>
                <CodeReviewerAssignmentView />
              </PrivateRoute>
            ) : (
              <PrivateRoute>
                <AssignmentView />
              </PrivateRoute>
            )
          }
        />

        <Route exact path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
