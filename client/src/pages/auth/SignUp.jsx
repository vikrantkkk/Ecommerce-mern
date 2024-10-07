import useSignup from "@/hooks/useSignup";
import CommonForm from "../../common/CommonForm";
import { registerFormControls } from "../../config/index";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialState = {
  name: "",
  email: "",
  password: "",
};
const SignUp = () => {
  const [formData, setFormData] = useState(initialState);
  const {loading,userSignUp} = useSignup();


  const onSubmit = (e) => {
    e.preventDefault();
    userSignUp(formData)
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <h1 className="text-3xl font-bold text-foreground tracking-tight">
        sign in to your account
      </h1>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <p>
        Already have an account
        <Link
          to="/auth/login"
          className="ml-2 font-medium text-primary hover:underline"
        >
          Login
        </Link>
      </p>
        <div>{loading && <div>...loading</div>}</div>
    </div>
  );
};

export default SignUp;
