import React, { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { addChildren } from "../redux/slices/folderSclice";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { FaRegFolder } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import { usePathname } from 'next/navigation';

interface Props {
  dropdown: boolean;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FileWithUrl extends File {
  url?: string; // Add uploadedUrl as an optional property
}

interface presignedUrl {
  url: string;
}

// interface  =

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
  }
}

const FileUploadModal = ({ dropdown, setIsOpenModal, setDropdown }: Props) => {
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLUListElement>(null);
  const user = useAppSelector((state) => state.user)
  const path = usePathname()
  const { parentId = null,childrens } = useAppSelector((state) => state.parentFolder);

  const isOwner = ()=>{
    console.log(path,"path");
    const value =   path.includes("/shared") ? true : false
    console.log(value);
    return value
    
 }


  const handleCreateFolder = () => {
    try {
      setIsOpenModal(true);
      setDropdown(false);
    } catch (error) {
      console.error("Error opening modal:", (error as Error).message);
    }
  };

  const getPreSignedUrl = async (fileArray: File[]) => {
    const filteredArray = fileArray.map((file) => ({
      name: file.name,
      webkitRelativePath: file.webkitRelativePath,
      type: file.type,
      size: file.size,
    }));
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_CLOUD_SERVER_URL}/file/getPresignedUrl`,
        {
          files: filteredArray,
        }
      );
      return response.data; // Ensures the resolved data is returned
    } catch (err) {
      console.log((err as Error).message);
      throw err; // Re-throws the error to allow calling code to handle it
    }
  };

  const uploadFileToS3 = async (
    signedUrls: FileWithUrl[],
    filteredFiles: File[]
  ) => {
    try {
      if (!filteredFiles.length || !signedUrls.length)
        throw new Error("signedUrl or files not sended");
      await Promise.allSettled(
        signedUrls.map((obj: FileWithUrl, index: number) => {
          return axios({
            method: "PUT",
            url: obj.url,
            headers: { "Content-Type": filteredFiles[index].type },
            data: filteredFiles[index],
            withCredentials: false,
          })
            .then((res) => {
              let imageLocation = obj.url?.split("?")[0];
              const url = imageLocation?.split("/uploads")[1];
              signedUrls[index].url = `/uploads${url}`;
            })
            .catch((error) => {
              console.error(
                "Error uploading file:",
                error.response?.data || error.message
              );
            });
        })
      );
      return signedUrls;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const handleUploadFolder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const isShared:boolean  = isOwner()
      if(isShared) return toast.error("cant upload inside a shared folder")
       let uploadToastId = toast.loading("Uploading folder...");
      const files = e.target.files;
      setDropdown(false);
      if (files) {

        let filesArray = Array.from(files);
        const filteredFiles = filterFiles(filesArray);

        if (filteredFiles.length) {
          let signedUrls = await getPreSignedUrl(filteredFiles);
          let files = await uploadFileToS3(signedUrls, filteredFiles);
          axios
            .post(
              `${process.env.NEXT_PUBLIC_CLOUD_SERVER_URL}/folder/upload`,
              {
                files,
              },
              { params: { userId: user._id, parentId } }
            )
            .then((res) => {
              console.log(res.data)
              const payload = {
                parentId: res.data.parentId,  
                childrens: res.data.childrens.childrens,
              };
              dispatch(addChildren(payload));
              toast.success("Upload successful!", { id: uploadToastId });
            })
            .catch((err) => {
              console.log(err.message);
              toast.error("Something went Wrong!", { id: uploadToastId });
            });
        }
      }
    } catch (error) {
      console.error("Error uploading folder:", (error as Error).message);
    }
  };

  const filterFiles = (files: File[]): File[] =>
    files.filter(
      (file) =>
        !file.webkitRelativePath.includes(".git") &&
        !file.webkitRelativePath.includes("node_modules")
    );

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const isShared:boolean  = isOwner()
      if(isShared) return toast.error("cant upload inside a shared folder")
      let file = e.target.files;
      if (file) {
        const uploadToastId = toast.loading("Uploading file...");
        const fileArr = Array.from(file);
        const presignedUrl = await getPreSignedUrl(fileArr);
        const uploadedFiles = await uploadFileToS3(presignedUrl, fileArr);

        if (uploadedFiles.length) {
          axios
            .post(
              `${process.env.NEXT_PUBLIC_CLOUD_SERVER_URL}/file/upload`,
              { file: uploadedFiles },
              {
                params: {
                  userId: user._id,
                  parentId,
                },
              }
            )
            .then((res) => {
              setDropdown(false);
      
              const payload = {
                parentId: res.data.parentId,
                childrens: res.data.childrens.childrens,
              };
              console.log(payload)
              dispatch(addChildren(payload));
              toast.success("Upload successful!", { id: uploadToastId });
            })
            .catch((err) => {
              setDropdown(false);
              toast.success("Error uploading", { id: uploadToastId });
              throw new Error(err);
            });
        }
      }
    } catch (error) {
      console.error("Error uploading folder:", (error as Error).message);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (!dropdownRef.current?.contains(e.target as Node)) {
      setDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ul
      ref={dropdownRef}
      className="menu bg-white mt-1 rounded-box z-[1] w-52 p-2 shadow absolute transition-all duration-300 ease-in-out transform"
      style={{
        opacity: dropdown ? 1 : 0,
        transform: dropdown ? "translateY(0)" : "translateY(-10px)",
      }}
    >
      <li>
        <button
          onClick={handleCreateFolder}
          className="flex items-center gap-3 text-md"
        >
          <FaRegFolder /> New Folder
        </button>
      </li>
      <hr />
      <li>
        <label
          htmlFor="upload-folder"
          className="flex items-center gap-3 text-md font-md"
        >
          <FaRegFolder /> Folder upload
        </label>
        <input
          type="file"
          id="upload-folder"
          webkitdirectory="true"
          className="hidden"
          onChange={handleUploadFolder}
        />
      </li>
      <li>
        <label
          htmlFor="upload-file"
          className="flex items-center gap-3 text-md font-md"
        >
          <CiFileOn className="text-[17px]" /> File upload
        </label>
        <input
          type="file"
          id="upload-file"
          className="hidden"
          onChange={handleUploadFile}
        />
      </li>
    </ul>
  );
};

export default FileUploadModal;
