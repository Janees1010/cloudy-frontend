"use client"; // Make sure the component is client-side

import { useRouter } from "next/navigation";
import React, { useEffect, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/store";
import { FaFolder } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Folder } from "@/app/types/types";
import { FileData } from "@/app/types/types";
import axios from "axios";
import FileIcons from "@/app/components/FileIcons";
import { FaGoogleDrive } from "react-icons/fa";
import { MdFolderShared } from "react-icons/md";
import { updatParentId } from "@/app/redux/slices/folderSclice";
import Loader from "@/app/components/Loader";
import ActionDropdown from "@/app/components/ActionDropdown";

const HomePage = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [suggestedFolders, setSuggestedFolders] = useState<Folder[]>([]);
  const [suggestedFiles, setSuggestedFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_CLOUD_SERVER_URL}/folder/latest`, {
        params: {
          userId: user._id,
        },
      });
      setSuggestedFolders(data[0]);
      setSuggestedFiles(data[1]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log((error as Error).message);
    }
  }, [user._id]);

  const handleFolderClick = (id: string, owner: String) => {
    if (user._id === owner) {
      const payload = { parentId: id };
      dispatch(updatParentId(payload));
      router.push("/drive");
    } else {
      router.push(`/shared?parentIdParam=${id}`);
      console.log("shared");
    }
  };

  const openFile = (
    e: React.MouseEvent,
    id: string,
    type: string,
    url?: string
  ) => {
    e.preventDefault();
    if (url) {
      axios
        .get(`${process.env.NEXT_PUBLIC_CLOUD_SERVER_URL}/file/update-LastAcceseed`, {
          params: { userId: user._id, fileId: id },
        })
        .then((res) => {
          window.open(process.env.NEXT_PUBLIC_S3_LOCATION + url, "_blank");
        })
        .catch((err) => console.log(err.message));
      return;
    }
  };


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-4">
      {/* header */}
      <div className="">
        <h1 className="text-2xl font-md py-2 ">Welcome to Cloudy</h1>
        <h5 className="text-lg px-4 text-gray-800  font-md py-2">
          Suggested Folders{" "}
        </h5>
      </div>
      {/* folders */}
      <div className="grid  gap-4 grid-cols-12 p-4">
        {suggestedFolders.length ? (
          suggestedFolders.map((folder) => {
            return (
              <div
                key={folder._id}
                className="bg-gray-50 relative col-span-4  p-2 rounded-xl min-h-[60px]"
              >
                <div className="flex justify-between  items-center px-3 ">
                  <div
                    onClick={() => handleFolderClick(folder._id, folder.owner)}
                    className="flex items-center gap-5"
                  >
                    <div>
                      <FaFolder className="text-2xl" />
                    </div>
                    <div>
                      <h6 className="text-md font-semibold">{folder.name}</h6>
                      <p className="text-sm">
                        {folder.owner === user._id ? "in My drive" : "Shared"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <ActionDropdown
                      setFiles={setSuggestedFiles}
                      setFolders={setSuggestedFolders}
                      name={folder.name}
                      id={folder._id}
                      type={folder.type}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          
          <p className="col-span-12 text-center pt-[50px] text-gray-600 ">
            No folders found. Upload folders or create to see them here!
          </p>
        
        )}
      </div>
      {/* files */}
      <div className="px-4">
        <h5 className="text-lg text-gray-800  font-md py-5">Suggested Files</h5>
        <table className="min-w-full">
          <thead className="">
            <tr className="border-b text-left border-gray-500">
              <th className="px-4 py-2 text-gray-600   font-medium">Name</th>
              <th className="px-4 py-2 text-gray-600   font-medium">
                Reason Suggested
              </th>
              <th className="px-4 py-2 text-gray-600 text-left   font-medium">
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {suggestedFiles.length ? (
              suggestedFiles.map((file) => {
                return (
                  <tr key={file._id} className="cursor-pointer" onClick={(e)=>{openFile(e,file._id,file.type,file.s3Url)}}>
                    <FileIcons name={file.name} type={file.type} />
                    <td className="font-medium text-md text-gray-700">Last Accessed At {new Date(file.lastAccessed).toDateString()}</td>
                    <td className="">
                      {file.owner === user._id ? (
                        <span className="flex items-center gap-2">
                          <FaGoogleDrive /> Drive
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <MdFolderShared /> Shared
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
              <td colSpan={3} className="text-center pt-[100px] text-gray-600 ">
                No files found. Upload files to see them here!
              </td>
            </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;
