import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex flex-col">
      <div className="h-20 w-full shadow-md">header</div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
