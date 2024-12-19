import { useEffect, useCallback } from "react";
import axios from "axios";
import { useAppDispatch } from "@/app/redux/store";
import { addUser } from "@/app/redux/slices/userSlices";

axios.defaults.withCredentials = true; // Ensure cookies are sent
axios.defaults.baseURL = "http://localhost:3500"; // Backend URL

const useLoadUserData = () => {
  const dispatch = useAppDispatch();

  const loadUserData = useCallback(async (): Promise<any> => {
    try {
      const res = await axios.get("/refreshtoken"); // Simplified with baseURL
      dispatch(addUser(res.data));
      return res.data;
    } catch (err: any) {
      console.error("Error fetching user data:", err.response?.data || err.message);
      return null;
    }
  }, [dispatch]);      

  return { loadUserData };
};
   
export default useLoadUserData;
