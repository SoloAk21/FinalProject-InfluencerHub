import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function EmailRoute({ path }) {
  const { email } = useSelector((state) => state.email);
  return <>{email ? <Outlet /> : <Navigate to={path} />}</>;
}
