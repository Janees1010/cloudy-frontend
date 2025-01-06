"use client";

import React, { useState, useEffect } from "react";
import UserDropdown from "./UserDropdown";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useRouter, usePathname } from "next/navigation";
import { PiFileJs } from "react-icons/pi";
import { FaFile, FaFolder, FaRegImage } from "react-icons/fa";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import axios from "axios";
import { updatParentId } from "../redux/slices/folderSclice";

const Navbar = () => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const path = usePathname();
  const dispatch = useAppDispatch()
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Debounce timer reference
  let debounceTimer: NodeJS.Timeout;

  const handleSelect = (id:number,type:string,url:string)=>{
      console.log(type,id,url);
      if(type === "folder"){
              const payload = {parentId:id}
              dispatch(updatParentId(payload))
              router.push("/drive")
      } else{
         window.open(process.env.NEXT_PUBLIC_S3_LOCATION+url, "_blank");
      }
      setSearchQuery("")
      setSearchResults([])
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (value.trim()) {
        try {
          setLoading(true);
          const { data } = await axios.get("http://localhost:4000/folder/search", {
            params: { query: value, location: path }, // Send the current path
          });
          setSearchResults(data);
        } catch (err) {
          console.error("Error fetching search results:", err);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]); // Clear results if search is empty
      }
    }, 300); // Debounce delay
  };

  return (
    <div className="flex flex-col relative bg-gray-50">
      {/* Navbar Container */}
      <div className="flex justify-between items-center px-4 py-2">
        {/* Search Input */}
        <div className="flex-grow flex justify-center">
          <input
            value={searchQuery}
            onChange={handleSearch}
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-full w-[50%] outline-none"
            type="text"
            placeholder="Search here"
          />
        </div>

        {/* User Icon */}
        <div>
          <div
            onClick={() => setShowDropdown((prev) => !prev)}
            className="rounded-3xl flex font-semibold text-white justify-center items-center cursor-pointer bg-red-400 w-10 h-10"
          >
            <p className="text-xl">{user.username.slice(0, 1).toUpperCase()}</p>
          </div>
          {showDropdown ? <UserDropdown /> : ""}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {searchQuery.trim() && searchResults.length > 0 && (
        <div className="absolute top-[60px] left-[25%] w-[50%] max-h-[300px] overflow-y-auto bg-gray-50 shadow-lg rounded-lg z-50">
          {loading ? (
            <p className="px-4 py-2 text-gray-500 text-center">Loading...</p>
          ) : (
            <ul>
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  className="p-4 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {handleSelect(result._id,result.type,result.s3Url)}}
                >
                        {result.type === "folder" ? (
                          <FaFolder className="text-gray-600" />
                        ) : result.type?.startsWith("image/") ? (
                          <FaRegImage className="text-red-500" />
                        ) : result.type?.startsWith("text/") ? (
                          <FaFile className="text-blue-700" />
                        ) : result.type === "application/x-javascript" ? (
                          <PiFileJs className="text-yellow-500" />
                        ) : result.type === "application/pdf" ?   (
                              <MdOutlinePictureAsPdf className="text-red-600 " />
                        ) : <FaFile className="text-blue-700" /> }
                  {result.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
