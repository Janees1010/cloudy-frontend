"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/app/redux/store";
import { FaFolder, FaRegImage } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { addChildren } from "@/app/redux/slices/folderSclice";
import { PiFileJs } from "react-icons/pi";
import { FaGoogleDrive } from "react-icons/fa";
import Loader from "@/app/components/Loader";

export type ChildrenType = {
  _id: number;
  name: string;
  type?: string;
  size?: number;
  childrenType: string;
  parentId: number;
  userId: number;
  s3Url?: string;
};

const Page = () => {
  const user = useAppSelector((state) => state.user);
  const { childrens, parentId } = useAppSelector((state) => state.parentFolder);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  // const [previousParentId, setPreviousParentId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

    const fetchChildrens = useCallback((parentId: number | null) => {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/folder/childrens/${parentId}/${user._id}`)
        .then((res) => {
          const payload = {
            parentId,
            childrens: res.data.childrens,
          };
          dispatch(addChildren(payload));
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, [user._id]); 

  const openFile = (
    e: React.MouseEvent,
    id: number,
    type: string,
    url?: string,
  ) => {  
    e.preventDefault();
    if (type !== "folder" && url) {
      axios.get("http://localhost:4000/file/update-LastAcceseed",{params:{userId:user._id,fileId:id}}).then((res)=>{
        window.open(url, "_blank");
      }).catch(err=>console.log(err.message))
      return;
    }
    console.log(parentId,"parent");
    
    fetchChildrens(id);
  };

  const handleActions = (id: number) => {
    console.log("Actions for:", id);
  };

  const handlePreviousPage = () => {
    axios.get("http://localhost:4000/file/getParentId",{
      params:{
        parentId:parentId,
        userId:user._id
      }}).then((res)=>{
        if(res.data){
           fetchChildrens(res.data.parentId)
        }
    }).catch((err)=>console.log(err.message))    
   
  };

  useEffect(() => {
      fetchChildrens(null); // Fetch root folder contents   
  }, [fetchChildrens]);
  
  if (loading) {
    return <Loader size={50} color="#4A90E2" />;
  }

  return (
    <div className="p-4">
      <button onClick={handlePreviousPage}>Back</button>
      <h1 className="text-xl font-semibold mb-4">My Drive</h1>
      {childrens && childrens.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border-gray-300">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-medium">Name</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Size (KB)</th>
                <th className="px-4 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {childrens.map((child) => (
                <tr
                  key={child._id}
                  className={`border-b ${
                    child._id % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td
                    onClick={(e) =>
                      openFile(e, child._id, child.childrenType,child.s3Url)
                    }
                    className="flex font-medium cursor-pointer text-gray-800 border-gray-300 px-4 items-center gap-2 py-2"
                    role="button"
                    aria-label={`Open ${child.name}`}
                  >
                    {child.type === "folder" ? (
                      <FaFolder className="text-gray-600" />
                    ) : child.type?.startsWith("image/") ? (
                      <FaRegImage className="text-red-500" />
                    ) : child.type?.startsWith("text/") ? (
                      <IoDocumentTextOutline className="text-blue-600" />
                    ) : child.type === "application/x-javascript" ? (
                      <PiFileJs className="text-yellow-500" />
                    ) : (
                      <IoDocumentTextOutline className="text-blue-600" />
                    )}
                    {child.name.length > 50
                      ? child.name.slice(0, 45) + "..."
                      : child.name}
                  </td>
                  <td className="border-gray-300 px-4 py-2">
                    {child.type || "-"}
                  </td>
                  <td className="border-gray-300 px-4 py-2">
                    {child.size ? (child.size / 1024).toFixed(2) : "-"}
                  </td>
                  <td
                    className="cursor-pointer border-gray-300 px-4 py-2"
                    onClick={() => handleActions(child._id)}
                  >
                    <BsThreeDots />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center h-[50vh] items-center">
          <p className="text-gray-500 text-xl flex items-center gap-2">
            {" "}
            <FaGoogleDrive /> No items found
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
