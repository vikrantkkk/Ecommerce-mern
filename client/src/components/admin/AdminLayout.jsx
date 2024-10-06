import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <div className="w-1/5 border-r min-h-screen shadow-md">sidebar</div>
      <div className="flex flex-col flex-1">
        <div className="h-20 shadow-md">header</div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
