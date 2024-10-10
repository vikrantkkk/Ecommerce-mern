import api from "@/axios/axios";
import { setUser } from "@/store/authSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const userSignUp = async (payload) => {
    try {
      setLoading(true);
      const response = await api.post(
        "http://localhost:5000/api/v1/auth/signup",
        payload,
        {
          withCredentials: true,
        }
      );
      dispatch(setUser(response.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return { loading, userSignUp };
};

export default useSignup;
