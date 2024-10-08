import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashbboard from "./pages/admin/AdminDashbboard";
import UserLayout from "./components/user/UserLayout";
import UserDashboard from "./pages/user/UserDashboard";
import CheckAuth from "./common/CheckAuth";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "./store/authSlice";
import useGetProfile from "./hooks/useGetProfile";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { userProfile, loading } = useGetProfile();

  useEffect(() => {
    userProfile();
  }, [userProfile]);

  if (loading) return <div>loading...</div>;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashbboard />} />
        </Route>
        <Route
          path="/user"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <UserLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
