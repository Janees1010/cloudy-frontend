"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAppSelector } from "@/app/redux/store";
import { SharedFiles } from "@/app/types/types";
import { FaFolder, FaRegImage } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiFileJs } from "react-icons/pi";
import { FaGoogleDrive } from "react-icons/fa";
import { GrLinkPrevious } from "react-icons/gr";
import Loader from "@/app/components/Loader";
import { log } from "node:console";

const page = () => {
  const user = useAppSelector((state) => state.user);
  const [sharedFiles, setSharedFiles] = useState<SharedFiles[]>([]);
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // const fetchSharedFiles = async () => {
  //   try {
  //     const { data } = await axios.get("http://localhost:4000/file/shared", {
  //       params: {
  //         userId: user._id,
  //       },
  //     });
  //     console.log(data, "data");
  //     setSharedFiles(data);
  //   } catch (error) {
  //     console.log((error as Error).message);
  //   }
  // };

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
    (parentId: string | null) => {
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
      <table className="min-w-full">
        <thead>
          <tr className="border-b  border-gray-500  text-gray-700">
            <th className="px-4 py-2 text-left font-medium">Name</th>
            <th className="px-4 py-2 text-left font-medium">Shared By</th>
            <th className="px-4 py-2 text-left font-medium">Shared Date</th>
          </tr>
        </thead>
        <tbody>
          {sharedFiles
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
                    <td>{file.owner}</td>
                    <td>{file.createdAt}</td>
                  </tr>
                );
              })
            : ""}
        </tbody>
      </table>
    </div>
  );
};

export default page;
