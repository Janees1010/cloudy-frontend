"use client";

import React, { useEffect, useState } from "react";
import UserDropdown from "./UserDropdown";
import useLoadUserData from "@/hooks/useFetchUserData";
import { useAppSelector } from "../redux/store";
// import { useAppSelector } from "../redux/store";

const Navbar = () => {
  const user = useAppSelector((state) => state.user);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  // const {loadUserData} = useLoadUserData()
  // useEffect(() => {
  //    loadUserData();  // Fetch the user data once here
  // }, [loadUserData]);
  return (
    <div className="flex justify-between items-center px-4 py-2 relative bg-gray-50">
      <div className="flex-grow flex justify-center">
        <input
          className="bg-gray-200 text-gray-800 px-[20px] py-4 rounded-full w-[50%]"
          type="text"
          placeholder="Search here"
        />
      </div>
      <div>
        <div
          onClick={() => setShowDropdown((prev) => !prev)}
          className="rounded-3xl flex font-semibold text-white justify-center items-center cursor-pointer bg-red-400 w-10 h-10"
        >
          {/* Red div content */}
          <p className="text-xl">{user.username.slice(0, 1).toUpperCase()}</p>
        </div>
        {showDropdown ? <UserDropdown /> : ""}
      </div>
    </div>
  );
};

export default Navbar;
