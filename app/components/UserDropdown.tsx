"use client"

import {useEffect,useRef} from 'react'
import Link from 'next/link'
import { useAppSelector } from '../redux/store'
import { CiUser } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import axios from 'axios';
import { useRouter } from 'next/navigation';

type props  = {     
  dropdownButtonRef: React.RefObject<HTMLDivElement>;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDropdown = ({setShowDropdown,dropdownButtonRef}:props) => {
   const user = useAppSelector((state)=>state.user)
   const router = useRouter()
   const dropdownRef = useRef<HTMLDivElement>(null)
   const handleLogout = ()=>{
      axios.get(`${process.env.NEXT_PUBLIC_USER_SERVER_URL}/logout`).then((res)=>{
        if(res.data){
            router.push("/login")
        }
      }).catch((err)=>console.log(err.message))
   }

    const handleClickOutside = (e: MouseEvent) => {
       if (!dropdownRef.current?.contains(e.target as Node) && !dropdownButtonRef.current?.contains(e.target as Node)  ) {
            setShowDropdown((pre)=> !pre);
       }
     };
   
     useEffect(() => {
       document.addEventListener("mousedown", handleClickOutside);
       return () => {
         document.removeEventListener("mousedown", handleClickOutside);
       };
     }, []);
   
  return (
   
    <div ref={dropdownRef}  className=" flex justify-center flex-col gap-3 bg-white mt-1 rounded-box z-[1] w-[200px] h-[110px] p-2 shadow absolute right-[20px]  transition-all duration-300 ease-in-out transform">
         <p className='flex items-center gap-2 font-md text-lg text-gray-700' ><CiUser />{user.username}</p>
         <hr />
         <button className='flex items-center gap-2 font-md text-lg text-gray-700' onClick={handleLogout}><IoIosLogOut />Logout</button>
    </div>
  )
}

export default UserDropdown
