import  { useCallback, useState } from "react";
import { setUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const useGetProfile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState();
  const userProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/auth/get-profile",
        {
          withCredentials: true,
        }
      );
      if (response.status) {
        dispatch(setUser(response.data));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  },[dispatch])
  return { userProfile, loading };
};

export default useGetProfile;
