import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="w-1/2 bg-black">
        <div className="space-y-6 text-center text-primary-foreground">
          <h1 className="text-4xl font-extralight tracking-tight">
            welcome to Ecommerce application
          </h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
