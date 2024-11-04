// src/components/PrivateRoute.js
import React from "react";
import { Navigate, Route, Router } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ element, ...rest }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Route {...rest} element={user ? element : <Navigate to="/login" />} />
  );
};

export default PrivateRoute;
