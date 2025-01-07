"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/store";
import { FaFolder, FaRegImage } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiFileJs } from "react-icons/pi";
import { FaGoogleDrive } from "react-icons/fa";
import { addChildren, updatParentId } from "@/app/redux/slices/folderSclice";
import Loader from "@/app/components/Loader";
import { GrLinkPrevious } from "react-icons/gr";
import ActionDropdown from "@/app/components/ActionDropdown";

export type ChildrenType = {
  _id: number;
  name: string;
  type?: string;
  size?: number;
  childrenType: string;
  parentId: number;
  userId: number;
  owner:string ;
  s3Url: string;
};

const Page = () => {

  const user = useAppSelector((state) => state.user);


  const dispatch = useAppDispatch();
  const { childrens, parentId = null } = useAppSelector(
    (state) => state.parentFolder
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalDocumentCount, setTotalDocumentCount] = useState<number>(0);

  const searchParams = useSearchParams();
  const parentIdParam = searchParams.get('id'); // Get the parentId query param
  console.log(parentIdParam,"param");
  

   
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const fetchChildrens = useCallback(
    (parentId: number | string | null) => {
      console.log(parentId);
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/folder/childrens`, {
          params: {
            parentId,
            userId: user._id,
            type: "drive",
            page: currentPage,
          },
        })
        .then((res) => {
          setTotalDocumentCount(res.data.totalDocumentCount);
          const payload = {
            parentId,
            childrens: res.data.childrens,
          };
          dispatch(addChildren(payload));
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    },
    [user._id, currentPage]
  );

  const openFile = (
    e: React.MouseEvent,
    id: number,
    type: string,
    url?: string
  ) => {
    e.preventDefault();
    if (type !== "folder" && url) {
      axios
        .get("http://localhost:4000/file/update-LastAcceseed", {
          params: { userId: user._id, fileId: id },
        })
        .then((res) => {
          window.open(process.env.NEXT_PUBLIC_S3_LOCATION + url, "_blank");
        })
        .catch((err) => console.log(err.message));
      return;
    }

    fetchChildrens(id);
  };

  const handlePreviousPage = () => {
    axios
      .get("http://localhost:4000/file/getParentId", {
        params: {
          parentId: parentId,
          userId: user._id,
        },
      })
      .then((res) => {
        if (res.data) {
          fetchChildrens(res.data.parentId);
        }
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    if (parentId) {
         fetchChildrens(parentId); // Fetch root folder contents
    } else {
         fetchChildrens(null);
    }
    return () => {
      dispatch( updatParentId({parentId:null})); // Reset parentId on component unmount
    };
  }, [fetchChildrens, currentPage , parentIdParam]);
 
  if (loading) {
    return <Loader size={50} color="#4A90E2" />;
  }

  return (
    <div className="p-4">
      <h1 className="mx-2 mt-3 mb-7 text-gray-700 text-2xl font-md">
        My Drive
      </h1>

      {parentId != null ? (
        <button
          className="py-[2px] mx-3 px-3 border border-1 border-gray-300 rounded-md"
          onClick={handlePreviousPage}
        >
          <GrLinkPrevious className="text-xl text-blue-500" />
        </button>
      ) : (
        ""
      )}

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
          <tbody className="relative">
            {childrens && childrens.length > 0 ? (
              childrens.map((child) => (
                <tr
                  key={child._id}
                  className={`relative border-b ${
                    child._id % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td
                    onClick={(e) =>
                      openFile(e, child._id, child.childrenType, child.s3Url)
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
                  <td className=" cursor-pointer border-gray-300 px-4 py-2">
                    <ActionDropdown
                      setTotalDocumentCount = {setTotalDocumentCount}
                      s3Url={child.s3Url}
                      id={child._id}
                      type={child.type}
                      name={child.name}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="justify-center h-[65vh] items-center text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FaGoogleDrive className="w-[100px] h-[450px] text-blue-500" />
                    {/* <span className="text-gray-700 text-xl font-md">Drive is Empty</span> */}
                    {/* <RiDeleteBin2Line className="w-[100px] h-[450px] text-red-500" />  */}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {childrens.length && totalDocumentCount ? (
          totalDocumentCount > childrens.length ? (
            <p onClick={() => setCurrentPage((prev) => prev + 1)}>Show more</p>
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Page;
