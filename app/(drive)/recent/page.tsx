"use client";
import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import { useAppSelector } from "@/app/redux/store";
import { RecentFiles, FileData } from "@/app/types/types";
import { PiFileJs } from "react-icons/pi";
import { FaGoogleDrive , FaFile, FaFolder, FaRegImage } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

const Page = () => {
  const user = useAppSelector((state) => state.user);
  const [recentFiles, setRecentFiles] = useState<RecentFiles | null>(null);
  useEffect(() => {
    axios
      .get("http://localhost:4000/file/recent", {
        params: {
          userId: user._id,
        },
      })
      .then((res) => {
        console.log(res.data);
        setRecentFiles(res.data);
      })
      .catch((err) => console.log(err.message));
  }, []);
  console.log(recentFiles);

  return (
    <div className="w-full">
      <h1 className=" mx-2 mt-5 mb-2 text-gray-700 text-2xl font-md">Recent</h1>

      <table className="min-w-full border-collapse border-gray-300">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-gray-600  text-left font-medium">
              Name
            </th>
            <th className="px-4 py-2  text-gray-600  text-left font-medium">
              Owner
            </th>
            <th className="px-4 py-2  text-gray-600  text-left font-medium">
              Size
            </th>
          </tr>
        </thead>
        <tbody>
          <h2 className="text-md text-gray-700 font-lg m-3">Today</h2>
          {recentFiles?.today?.length ? (
            recentFiles.today.map((file: any) => {
              return (
                <tr className="border-b bg-gray-50">
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
                  <td>{user.email}</td>
                  <td>
                    {file.size ? (file.size / 1024).toFixed(2) + "Kb" : "-"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="w-full text-center py-4">
                <p className="text-gray-500 text-xl flex justify-center items-center gap-2">
                  <FaGoogleDrive /> No Records
                </p>
              </td>
            </tr>
          )
        }

          <h2 className="text-md text-gray-700 font-lg m-3">Last Week</h2>
          {recentFiles?.lastWeek?.length
            ? recentFiles.lastWeek.map((file: any) => {
                return (
                  <tr className="border-b bg-gray-50">
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
                        <IoDocumentTextOutline className="text-blue-600" />
                      ) : file.type === "application/x-javascript" ? (
                        <PiFileJs className="text-yellow-500" />
                      ) : (
                        <IoDocumentTextOutline className="text-blue-600" />
                      )}
                      {file.name.length > 50
                        ? file.name.slice(0, 45) + "..."
                        : file.name}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      {file.size ? (file.size / 1024).toFixed(2) + "Kb" : "-"}
                    </td>
                  </tr>
                );
              })
            : (
              <tr>
                <td colSpan={3} className="w-full text-center py-4">
                  <p className="text-gray-500 text-xl flex justify-center items-center gap-2">
                    <FaGoogleDrive /> No Records
                  </p>
                </td>
              </tr>
            )}
          <h2 className="text-md text-gray-700 font-lg m-3">Last Month</h2>
          {recentFiles?.lastMonth?.length ? (
            recentFiles.lastMonth.map((file: any) => {
              return (
                <tr className="border-b bg-gray-50">
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
                      <IoDocumentTextOutline className="text-blue-600" />
                    ) : file.type === "application/x-javascript" ? (
                      <PiFileJs className="text-yellow-500" />
                    ) : (
                      <IoDocumentTextOutline className="text-blue-600" />
                    )}
                    {file.name.length > 50
                      ? file.name.slice(0, 45) + "..."
                      : file.name}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {file.size ? (file.size / 1024).toFixed(2) + "Kb" : "-"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="w-full text-center py-4">
                <p className="text-gray-500 text-xl flex justify-center items-center gap-2">
                  <FaGoogleDrive /> No Records
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
