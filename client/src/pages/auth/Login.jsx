import CommonForm from "../../common/CommonForm";
import { loginFormControls } from "../../config/index";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};
const Login = () => {
  const [formData, setFormData] = useState(initialState);

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <h1 className="text-3xl font-bold text-foreground tracking-tight">sign in to your account</h1>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <p>
        Don't have an account
        <Link to="/auth/signup" className="ml-2 font-medium text-primary hover:underline">Register</Link>
      </p>
    </div>
  );
};

export default Login;
