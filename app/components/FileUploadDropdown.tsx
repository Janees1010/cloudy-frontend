import React, { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { addChildren } from "../redux/slices/folderSclice";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { FaRegFolder } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import { sign } from "crypto";


interface Props {
  dropdown: boolean;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FileWithUrl extends File {
  uploadedUrl?: string;  // Add uploadedUrl as an optional property
}

interface presignedUrl {
  url:string
}

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
  }
}

const FileUploadModal = ({ dropdown, setIsOpenModal, setDropdown }: Props) => {
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLUListElement>(null);
  const user = useAppSelector((state) => state.user);
  const {parentId = null} = useAppSelector((state) => state.parentFolder)

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
      size:file.size
    }));
  
    try {
      const response = await axios.post("http://localhost:4000/file/getPresignedUrl", {
        files: filteredArray,
      });
      return response.data; // Ensures the resolved data is returned
    } catch (err) {
      console.log( (err as Error).message);
      throw err; // Re-throws the error to allow calling code to handle it
    }
  };
  
  const handleUploadFolder = async(e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (files) {
        // const uploadToastId = toast.loading("Uploading folder...");
        let filesArray = Array.from(files);
        const filteredFiles:FileWithUrl[] = filterFiles(filesArray)
        if(filteredFiles.length){
           let signedUrls = await getPreSignedUrl(filteredFiles)
            await Promise.allSettled(
              signedUrls.map((obj: presignedUrl, index: number) => {
              return  axios({
                method:"PUT",
                url:obj.url,
                headers:{ 'Content-Type' :filteredFiles[index].type},
                data:filteredFiles[index],
                withCredentials:false
              }).then((res) => {
                  let imageLocation  = obj.url.split("?")[0]
                  const url = imageLocation.split("/uploads")[1]
                  signedUrls[index].url = `/uploads${url}`
                  filteredFiles[index].uploadedUrl = `/uploads${url}`
                })
                .catch((error) => {
                  console.error("Error uploading file:", error.response?.data || error.message);
                });
            })
          );
           console.log(filteredFiles);
           console.log(signedUrls,"signed");
           
           axios.post("http://localhost:4000/folder/upload",{filteredFiles})
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

  const handleUploadFile = (e:React.ChangeEvent<HTMLInputElement>)=>{
     try {
         let file = e.target.files
         if(file){
           const uploadToastId = toast.loading("Uploading file...");
           let formdata = new FormData();
           formdata.append("file",file[0]);
           axios
             .post("http://localhost:4000/file/upload", formdata, {
               headers: { "Content-Type": "multipart/form-data" },
               params: { userId: user._id, parentId },
               onUploadProgress: (data)=>{
                   console.log(data.loaded, data.total);
               },
             })
             .then((res) => {
               const payload = res.data.response;
               console.log(payload);
               dispatch(addChildren(payload));
               toast.success("Upload successful!", { id: uploadToastId });
             })
             .catch((err) => {
               toast.error("Upload failed!", { id: uploadToastId });
             })
             .finally(() => setDropdown(false));
         }
     } catch (error) {
      console.error("Error uploading folder:", (error as Error).message);
     }
  }
  
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
