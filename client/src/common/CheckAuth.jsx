import React from "react";
import { Navigate } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/user/dashboard" />;
      }
    }
  }

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("signup")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("signup"))
  ) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/user/dashboard" />;
    }
  }
  if (
    isAuthenticated &&
    location.pathname.includes("/admin") &&
    user.role !== "admin"
  ) {
    return <Navigate to="/user/dashboard" />;
  }
  if (
    isAuthenticated &&
    location.pathname.includes("/user") &&
    user.role !== "user"
  ) {
    return <Navigate to="/admin/dashboard" />;
  }
  return <>{children}</>;
};

export default CheckAuth;
