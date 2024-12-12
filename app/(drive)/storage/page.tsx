"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useAppSelector } from "@/app/redux/store";
import { FileData } from "@/app/types/types";
import { FaGoogleDrive , FaFile, FaFolder, FaRegImage } from "react-icons/fa";
import { PiFileJs } from "react-icons/pi";
import axios from "axios";

const page = () => {
  const user = useAppSelector((state) => state.user);
  const [files, setFiles] = useState<any>();
  const [totalStorage,setTotalStorage] = useState<number>(0)
  const fetchFilesAndStorage = useCallback(() => {
    axios
      .get("http://localhost:4000/file/storage", {
        params: { userId: user._id },
      })
      .then((res) => {
        setFiles(res.data[0].files);
        console.log(res.data[0]);
        
        setTotalStorage(res.data[0].totalStorage / 1024 )
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  useEffect(() => {
    fetchFilesAndStorage();
  }, [fetchFilesAndStorage]);
  console.log(totalStorage/1024);
  
  return (
    <div>
         
        {
          files ? 
          <div>
              <h6 className="text-gray-500 mx-4 my-2  font-md space-x-0"><span className="text-4xl mx-1 text-gray-900 font-md">{(totalStorage / 1024).toFixed(2)}MB</span> of 10 GB used</h6>
              <div className="h-2 my-4 mx-5 bg-gray-200 w-full rounded">
               <div
                 className="h-full bg-blue-500 rounded"
                 style={{
                   width: `${totalStorage? ( totalStorage / 1024 / 1024 ) : 0 * 100}%`,
                 }}
               ></div>

          </div>
          </div> : ""
        }
      

      <table className="min-w-full mx-5 border-collapse border-gray-500">
        <thead>
          <tr className="border-b">
            <th className="font-medium text-left py-2  text-gray-800">
              Files using Drive storage{" "}
            </th>
            <th className="font-medium text-left py-2 text-gray-800">Storage used</th>
          </tr>
        </thead>
        <tbody>
            {
                 files ? files.length && files.map((file:any)=>{
                    return(
                        <tr className="border-b">
                          <td
                    // onClick={(e) => 
                    //   openFile(e, child._id, child.childrenType,child.s3Url)
                    // }
                    className="flex font-medium cursor-pointer text-gray-800 border-gray-300 px-4 items-center gap-2 py-2"
                    role="button"
                    aria-label={`Open ${file.name}`}
                  >
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
                          <td>{(file.size / 1024).toFixed(2)}</td>
                        </tr>
                    )
                })  : <tr>
                        <td>not fount</td>
                      </tr>
            }
        </tbody>
      </table>
    </div>
  );
};

export default page;
