import React from "react";
import { useLocalState } from "../util/useLocalStorage";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const [jwt, setJwt] = useLocalState("", "jwt");
  return jwt ? children : <Navigate to="/login" />;
}
