"use client";
import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import { useAppSelector } from "@/app/redux/store";
import { RecentFiles, FileData } from "@/app/types/types";
import { PiFileJs } from "react-icons/pi";
import { FaGoogleDrive, FaFile, FaFolder, FaRegImage } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import Loader from "@/app/components/Loader";

const Page = () => {
  const user = useAppSelector((state) => state.user);
  const [recentFiles, setRecentFiles] = useState<RecentFiles | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_CLOUD_SERVER_URL}/file/recent`, {
        params: {
          userId: user._id,
        },
      })
      .then((res) => {
        console.log(res.data);
        setRecentFiles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  }, [user._id]);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="w-full">
      <h1 className=" mx-2 mt-5 mb-2 text-gray-700 text-2xl font-md">Recent</h1>

      <table className="min-w-full border-collapse border-gray-800 ">
        <thead>
          <tr className="border-b border-gray-400">
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
        <tbody className="w-full mb-[200px]">
          <tr>
            <td
              colSpan={3}
              className={`w-full   ${recentFiles?.today?.length ? "" : "border-b  border-gray-400"}`}
            >
              <h2 className="text-lg text-gray-700  font-semibold m-3">
                Today
              </h2>
            </td>
          </tr>
          {recentFiles?.today?.length ? (
            recentFiles.today.map((file: any) => {
              return (
                <tr key={file._id} className="border-b bg-gray-50 ">
                  <td
                    // onClick={(e) =>
                    //   openFile(e, child._id, child.childrenType,child.s3Url)
                    // }
                    className="flex text-md font-md cursor-pointer text-gray-800 border-gray-800 px-4 items-center gap-2 py-2"
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
                    {file?.name?.length > 50
                      ? file.name.slice(0, 45) + "..."
                      : file.name}
                  </td>
                  <td>
                    <div className="flex gap-2 items-center">
                      <span className="w-[25px] h-[25px] rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {file?.userDetails?.username
                          ? file.userDetails.username.slice(0, 1).toUpperCase()
                          : "?"}
                      </span>
                      <span className="text-md font-md ">
                        {file?.userDetails?.username || "Unknown User"}
                      </span>
                    </div>
                  </td>
                  <td className="font-semibold">
                    {file.size ? (file.size / 1024).toFixed(2) + "Kb" : "-"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="w-full text-center ">
                <p className="text-gray-500 text-xl mt-10 flex justify-center items-center gap-2">
                  <FaGoogleDrive /> No Records
                </p>
              </td>
            </tr>
          )}

          <tr className="mt-10">
            <td
              colSpan={3}
              className={`w-full   ${recentFiles?.lastWeek?.length ? "" : "border-b  border-gray-400"}`}
            >
              <h2 className="text-md text-gray-700 font-semibold mt-10 m-3">
                Last Week
              </h2>
            </td>
          </tr>
          {recentFiles?.lastWeek?.length ? (
            recentFiles?.lastWeek?.map((file: any) => {
              return (
                <tr key={file._id} className="border-b bg-gray-50">
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
                    {file?.name?.length > 50
                      ? file.name.slice(0, 45) + "..."
                      : file.name}
                  </td>
                  <td>
                    <div className="flex gap-2 items-center">
                      <span className="w-[25px] h-[25px] rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {file?.userDetails?.username
                          ? file.userDetails.username.slice(0, 1).toUpperCase()
                          : "?"}
                      </span>
                      <span className="text-md font-md ">
                        {file?.userDetails?.username || "Unknown User"}
                      </span>
                    </div>
                  </td>
                  <td>
                    {file?.size ? (file.size / 1024).toFixed(2) + "Kb" : "-"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="w-full text-center py-4">
                <p className="text-gray-500 mt-10 text-xl flex justify-center items-center gap-2">
                  <FaGoogleDrive /> No Records
                </p>
              </td>
            </tr>
          )}
          <tr>
            <td
              colSpan={3}
              className={`w-full   ${recentFiles?.lastMonth?.length ? "" : "border-b  border-gray-400"}`}
            >
              <h2 className="text-md text-gray-700  font-semibold mt-10 m-3">
                Last Month
              </h2>
            </td>
          </tr>
          <hr className="w-full" />
          {recentFiles?.lastMonth?.length ? (
            recentFiles.lastMonth.map((file: any) => {
              return (
                <tr key={file._id} className="border-b bg-gray-50">
                  <td
                    // onClick={(e) =>
                    //   openFile(e, child._id, child.childrenType,child.s3Url)
                    // }
                    className="flex font-medium cursor-pointer text-gray-800 border-gray-300 px-4 items-center gap-2 py-2"
                    role="button"
                    aria-label={`Open ${file?.name}`}
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
                  <td>
                    <div className="flex gap-2 items-center">
                      <span className="w-[25px] h-[25px] rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {file?.userDetails?.username
                          ? file.userDetails.username.slice(0, 1).toUpperCase()
                          : "?"}
                      </span>
                      <span className="text-md font-md ">
                        {file?.userDetails?.username || "Unknown User"}
                      </span>
                    </div>
                  </td>
                  <td>
                    {file.size ? (file.size / 1024).toFixed(2) + "Kb" : "-"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="w-full text-center py-4">
                <p className="text-gray-500 mt-10 text-xl flex justify-center items-center gap-2">
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
