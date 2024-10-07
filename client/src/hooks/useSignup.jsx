import axios from "axios";
import  { useState } from "react";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const userSignUp = async (payload) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/v1/auth/signup", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return {userSignUp, loading, data};
};

export default useSignup;
