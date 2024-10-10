import api from "@/axios/axios";
import { setUser } from "@/store/authSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const userLogin = async (payload) => {
    try {
      setLoading(true);
      const response = await api.post(
        "http://localhost:5000/api/v1/auth/login", 
        payload,
        {
          withCredentials: true, 
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assuming your backend response includes the user data
      dispatch(setUser(response.data));
    } catch (error) {
      console.error("Login failed: ", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, userLogin };
};

export default useLogin;
