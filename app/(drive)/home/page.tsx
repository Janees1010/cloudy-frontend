"use client"; // Make sure the component is client-side

import { useRouter } from "next/navigation";
import React, { useEffect,useCallback, useState } from "react";
import { useAppSelector } from "@/app/redux/store";
import { FaFolder } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios"

const HomePage = () => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const [latestData,setLatestData] = useState([])

  const fetchData = useCallback(async()=>{
      try {
        const data  = await  axios.get("http://localhost:4000/folder/latest")
      } catch (error) {
        
      }
  },[])
  useEffect(()=>{
      fetchData()
  },[fetchData])
  return (
    <div className="px-4">
      {/* header */}
      <div className="">
        <h1 className="text-2xl font-md py-2 ">Welcome to Cloudy</h1>
        <h5 className="text-lg px-4  font-md py-2">Suggested Folders </h5>
      </div>
       {/* folders */}
      <div className="grid grid-cols-12 p-4">
        <div className="bg-gray-100 col-span-4 place-items-center  p-2 rounded-md min-h-[60px]">
          <div className="flex justify-between  items-center px-3 ">
            <div className="flex items-center gap-5">
              <FaFolder className="text-2xl" />
              <div>
                <h6 className="text-md font-semibold">myFolder</h6>
                <p className="text-sm">in my drive</p>
              </div>
            </div>
            <div>
              <BsThreeDots />
            </div>
          </div>
        </div>
      </div>
       {/* files */}
      <div className="px-4">
              <h5 className="text-lg  font-md py-5">Suggested Files</h5>
              <table className="min-w-full">
                 <thead className="">
                  <tr className="border-b border-gray-500">

                   <th className="px-4 py-2 text-gray-600 text-left  font-medium">Name</th>
                   <th className="px-4 py-2 text-gray-600   font-medium">Reason Suggested</th>
                   <th className="px-4 py-2 text-gray-600   font-medium">Location</th>
                  </tr>
                 </thead>
              </table>
      </div>
    </div>
  );
};

export default HomePage;
