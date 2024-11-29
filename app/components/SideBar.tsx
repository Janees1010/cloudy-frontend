"use client";

import React, { useRef, useState,useEffect} from "react";
import { GoPlus } from "react-icons/go";
import { MdOutlineHome, MdFolderShared } from "react-icons/md";
import { FiClock } from "react-icons/fi";
import { RiDeleteBin6Line, RiDriveLine } from "react-icons/ri";
import { TiCloudStorage } from "react-icons/ti";
import { useAppDispatch, useAppSelector } from "../redux/store";
import Link from "next/link";
import FileUploadModal from "./FileUploadDropdown";
import NewFolderModal from "./NewFolderModal";
import useLoadUserData from "@/hooks/FetchUserData";
import { useRouter } from "next/navigation";


const SideBar: React.FC = () => {
  const {loadUserData} = useLoadUserData()
  // const user = useAppSelector((state)=>state.user)
  const router = useRouter()
  const FetchUserData = async()=>{
    const user  =  await loadUserData();
    if(!user.username){
       router.push("/login")
    }
    console.log(user,"cdh");
    
  }
  useEffect(() => {
     FetchUserData()
 }, [loadUserData]);

  const dispatch = useAppDispatch()
  const percentageUsed: number = 30;
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    

  return (
    <div className="w-full pt-3 px-7 h-screen bg-gray-50">
      {/* Logo and Title */}
      <div className="flex gap-4 items-center">
        <img src="/Logo.jpg" width="35px" alt="Cloudy Logo" />
        <h2 className="text-2xl text-gray-700 font-semibold">Cloudy</h2>
      </div>

      <div className="mt-6">
      {/* The button to toggle the dropdown */}
      <div
        tabIndex={0}
        onClick={() => setDropdown((prev) => !prev)}
        className="px-5 cursor-pointer inline-flex text-[16px] py-3 font-[500] rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.25)] bg-white hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] hover:bg-gray-100  gap-2 items-center text-black"
      >
        <GoPlus className="text-3xl" /> New
      </div>

      {/* Dropdown content with a custom transition */}
      {dropdown && (
          <FileUploadModal dropdown={dropdown} setDropdown={setDropdown}  setIsOpenModal={setIsOpenModal} />
      )}
     </div>  

      {/* Dashboard Links */}
      <div className="mt-4 flex flex-col gap-3">
        <Link
          href="/home"
          className="flex items-center gap-3 text-md p-2 rounded-lg text-gray-700 hover:text-blue-500 hover:bg-gray-100 active:text-white active:bg-blue-500"
        >
          <MdOutlineHome className="text-xl" /> Home
        </Link>
        <Link
          href="/drive"
          className="flex items-center gap-3 text-md p-2 rounded-lg text-gray-700 hover:text-blue-500 hover:bg-gray-100 active:text-white active:bg-blue-500"
        >
          <RiDriveLine className="text-xl" /> My Drive
        </Link>
      </div>
      <hr className="mt-3" />

      <div className="mt-4 flex flex-col gap-3">
        <Link
          href="/shared"
          className="flex items-center gap-3 text-md p-2 rounded-lg text-gray-700 hover:text-blue-500 hover:bg-gray-100 active:text-white active:bg-blue-500"
        >
          <MdFolderShared className="text-xl" /> Shared with me
        </Link>
        <Link
          href="/recent"
          className="flex items-center gap-3 text-md p-2 rounded-lg text-gray-700 hover:text-blue-500 hover:bg-gray-100 active:text-white active:bg-blue-500"
        >
          <FiClock className="text-xl" /> Recent
        </Link>
      </div>
      <hr className="mt-3" />

      <div className="mt-4 flex flex-col gap-3">
        <Link
          href="/bin"
          className="flex items-center gap-3 text-md p-2 rounded-lg text-gray-700 hover:text-blue-500 hover:bg-gray-100 active:text-white active:bg-blue-500"
        >
          <RiDeleteBin6Line className="text-xl" /> Bin
        </Link>
        <Link
          href="/storage"
          className="flex items-center gap-3 text-md p-2 rounded-lg text-gray-700 hover:text-blue-500 hover:bg-gray-100  active:text-white active:bg-blue-500"
        >
          <TiCloudStorage className="text-xl" /> Storage
        </Link>
      </div>

      {/* Storage Bar and Indication */}
      <div className="mt-5">
        <div className="w-full flex flex-col gap-4 bg-gray-200 h-2 rounded-lg relative">
          <div
            className="bg-blue-500 h-full rounded-lg transition-all duration-500 ease-in-out"
            style={{ width: `${percentageUsed}%` }}
          ></div>
        </div>
        <p className="text-center text-sm font-md py-1 text-gray-600">
          {percentageUsed.toFixed()}% of 12 GB used
        </p>
        <div className="flex justify-center">
          <button className="border rounded-2xl my-1 text-md border-gray-500 py-2 px-8 font-semibold text-blue-600">
            Get more storage
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpenModal && (
         <NewFolderModal setIsOpenModal={setIsOpenModal} />
      )}
    </div>
  );
};

export default SideBar;
