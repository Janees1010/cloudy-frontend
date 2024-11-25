"use client";

import React, { useEffect, useRef } from "react";
import { FaRegFolder } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";

interface Props {
  dropdown: boolean;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      webkitdirectory?: string;
  }
}

// const buidFileTreee = (files:File[])=>{
//   try {
//     const root:any = {}
//     files.forEach((file)=>{
//       let currentLevel = root
//       const parts = file.webkitRelativePath.split("/")
//       parts.forEach((part:string,index:number)=>{
//          if(!currentLevel[part]){
//             currentLevel[part] = index === parts.length-1 ? {file,type:"file"}  : {type:"folder",children:{}}
//          }
//          currentLevel = currentLevel[part].children || {}
//       })
//     })
//     console.log(JSON.stringify(root, null, 2)); 
//     console.log(root);  
    
//   } catch (error) {
//      console.log( (error as Error).message );
//   }
// }

const FileUploadModal = ({ dropdown, setIsOpenModal, setDropdown }: Props) => {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const handleCreateFolder = () => {
    try {
      setIsOpenModal(true);
      setDropdown(false)
    } catch (error) {
      console.error("Error opening modal:", (error as Error).message);
    }
  };
  const handleUploadFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (files) {
        let filesArray = Array.from(files);
        const filteredFiles = filesArray.filter(file => !file.webkitRelativePath.includes('.git'));
        const formData = new FormData()
        filteredFiles.forEach((file) => {
          // Append each file with its relative path (to preserve folder structure)
          formData.append("files[]", file, file.webkitRelativePath);
        });
        console.log(formData);
        // buidFileTreee(filteredFiles)
        setDropdown(false); // Assuming you want to close a dropdown after processing
      }
    } catch (error) {
      console.error("Error uploading folder:", (error as Error).message);
    }
  };
  const handleClickOutside = (e: MouseEvent) => {
    if (
      !dropdownRef.current?.contains(e.target as Node) 
    ) {
      setDropdown(false);
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup the event listener when the component is unmounted
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ul
      ref={dropdownRef}
      className="menu bg-white mt-1 rounded-box z-[1] w-52 p-2 shadow absolute transition-all duration-300 ease-in-out transform"
      style={{
        opacity: dropdown ? 1 : 0, // Fade in/out
        transform: dropdown ? "translateY(0)" : "translateY(-10px)", // Slide effect
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
          webkitdirectory = "true"
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
      </li>
    </ul>
  );
};

export default FileUploadModal;
