"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/app/redux/store";
import { binType } from "@/app/types/types";
import axios from "axios";
import BinActionDropdown from "@/app/components/BinActionDropdown";
import { PiFileJs } from "react-icons/pi";
import { FaGoogleDrive , FaFile, FaFolder, FaRegImage } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import Loader from "@/app/components/Loader";


const page = () => {
  const user = useAppSelector((state) => state.user);
  const [binFiles, setBinFiles] = useState<binType[]>([]);
  const [loading,setLoading] = useState<boolean>(true)

  const fetchBinFiles = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/file/binItems", {
        params: { userId: user._id },
      });
      if (data) {
        setLoading(false)
        setBinFiles(data);
      }
    } catch (error) {
      setLoading(false)
      console.log((error as Error).message);
    }
  }, [user._id]);

  useEffect(() => {
    fetchBinFiles();
  }, [fetchBinFiles]);
  console.log(binFiles);

  if(loading){
     return <Loader />
  }
  return (
    <div>
      <h1 className=" mx-8 mt-5 mb-2 text-gray-600 text-3xl f font-md">Bin</h1>
      <table className="min-w-full border-collapse mx-5 my-2 ">
        <thead>
          <tr className="border-b border-gray-500 mb-10 text-gray-700 text-md font-md">
            <th className="px-4 py-2 text-gray-600  text-left font-medium">Name</th>
            <th className="px-4 py-2 text-gray-600  text-left font-medium">Owner</th>
            <th className="px-4 py-2 text-gray-600  text-left font-medium">Size</th>
            <th className="px-4 py-2 text-gray-600  text-left font-medium">Action</th>

            {/* <td>Name</td> */}
          </tr>
        </thead>
        <tbody className="w-full">
          {binFiles?.length
            ? binFiles.map((file) => {
                return (
                  <tr className="border-b bg-gray-50  border-gray-500">
                    <td className="text-md font-md flex p-2 items-center gap-2">
                      {file.type === "folder" ? (
                        <FaFolder className="text-gray-600" />
                      ) : file.type?.startsWith("image/") ? (
                        <FaRegImage className="text-red-500" />
                      ) : file.type?.startsWith("text/") ? (
                        <FaFile className="text-blue-700" />
                      ) : file.type === "application/x-javascript" ? (
                        <PiFileJs className="text-yellow-500" />
                      ) : (
                        <FaFile className="text-blue-700" />
                      )}
                      {file.name.length > 50
                        ? file.name.slice(0, 45) + "..."
                        : file.name}
                    </td>
                    <td className="text-md font-md">mmm</td>
                    <td className="text-md font-md">
                      {file.type === "folder"
                        ? "-"
                        : (file.size / 1024).toFixed(2) + "Kb"}
                    </td>
                    <td className="text-md font-md">
                      <BinActionDropdown name={file.name} id={file._id} type={file.type} setBinFiles={setBinFiles}  />
                    </td>
                  </tr>
                );
              })
            : (
            <tr>
              <td colSpan={4} className="justify-center h-[75vh] items-center text-center">
                 <div className="flex flex-col items-center gap-2">
                   {/* <FaGoogleDrive className="text-xl" /> */}
                  {/* <span className="text-gray-700 text-xl font-md">Bin is Empty</span> */}
                  <RiDeleteBin2Line className="w-[100px] h-[450px] text-red-500" /> 
                </div>
              </td>
            </tr>
                  )}
        </tbody>
      </table>
    </div>
  );
};

export default page;
