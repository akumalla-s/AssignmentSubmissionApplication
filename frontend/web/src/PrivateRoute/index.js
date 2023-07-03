import React, { useState } from "react";
import { useLocalState } from "../util/useLocalStorage";
import { Navigate } from "react-router-dom";
import ajax from "../Services/fetchService";

export default function PrivateRoute({ children }) {
  const [jwt, setJwt] = useLocalState("", "jwt");
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(null);

  if (jwt) {
    ajax(`/api/auth/validate?token=${jwt}`, "get", jwt).then((isValid) => {
      setIsValid(isValid);
      setIsLoading(false);
    });
  } else {
    return <Navigate to="/login" />;
  }
  return isLoading ? (
    <div>Loading...</div>
  ) : isValid === true ? (
    children
  ) : (
    <Navigate to="/login" />
  );
}
