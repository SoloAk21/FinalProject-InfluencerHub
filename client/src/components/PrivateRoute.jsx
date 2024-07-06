// components/PrivateRoute.jsx

import React from "react";
import { useSelector } from "react-redux";
import { Route, Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ userTypeAllowed, ...props }) {
  const { currentUser } = useSelector((state) => state.user);
  const isAuthenticated =
    currentUser && currentUser.userType === userTypeAllowed;

  return isAuthenticated || userTypeAllowed === null ? (
    <Outlet {...props} />
  ) : (
    <Navigate to="/signin" />
  );
}
