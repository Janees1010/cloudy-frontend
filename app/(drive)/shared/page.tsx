"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from 'next/navigation';
import axios from "axios";
import { useAppSelector } from "@/app/redux/store";
import { SharedFiles } from "@/app/types/types";
import { FaFolder, FaRegImage } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiFileJs } from "react-icons/pi";
import { GrLinkPrevious } from "react-icons/gr";
import Loader from "@/app/components/Loader";
import ActionDropdown from "@/app/components/ActionDropdown";

const page = () => {
  
  const user = useAppSelector((state) => state.user);
  const searchParams = useSearchParams();
  const parentIdParam = searchParams.get('parentIdParam'); // Get the parentId query param
  const [sharedFiles, setSharedFiles] = useState<SharedFiles[]>([]);
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
 
 

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
          fetchData(res.data.parentId);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const fetchData = useCallback(
    (parentId: string | null ) => {
      setLoading(true);
      axios
        .get("http://localhost:4000/folder/childrens", {
          params: {
            parentId,
            userId: user._id,
            type: "shared",
          },
        })
        .then((res) => {
          setSharedFiles(res.data.childrens);
          setParentId(parentId);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [user._id]
  );

  const openFile = (
    e: React.MouseEvent,
    id: string,
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
          console.log(res.data);
          window.open(process.env.NEXT_PUBLIC_S3_LOCATION+url, "_blank");
        })
        .catch((err) => console.log(err.message));
      return;
    }
    console.log(parentId,"parent");  
    fetchData(id);
  };

  useEffect(() => {
    if(parentIdParam){
       setParentId(parentIdParam)
    }
    fetchData(parentId);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
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
      <table className="min-w-full my-10">
        <thead>
          <tr className="border-b  border-gray-500  text-gray-700">
            <th className="px-4 py-2 text-left font-medium">Name</th>
            <th className="px-4 py-2 text-left font-medium">Shared By</th>
            <th className="px-4 py-2 text-left font-medium">Shared Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sharedFiles.length
            ? sharedFiles.map((file) => {
                return (
                  <tr className="border-b border-gray-500" key={file._id}>
                    <td
                      onClick={(e) =>
                        openFile(e, file._id, file.type, file.s3Url)
                      }
                      className="flex font-medium cursor-pointer text-gray-800 border-gray-300 px-4 items-center gap-2 py-2"
                      role="button"
                      // aria-label={`Open ${child.name}`}
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
                    <td>{file?.userDetails?.username}</td>
                    <td>{file.createdAt}</td>
                    <td><ActionDropdown shared={true} id={file._id} name={file.name} type={file.type} s3Url={file.s3Url} setFiles={setSharedFiles} /></td>
                  </tr>
                );
              })
            : (
              <tr>
                <td colSpan={3} className="text-center pt-[200px] text-gray-600 ">
                     No shared files or folders found !
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  );
};

export default page;
