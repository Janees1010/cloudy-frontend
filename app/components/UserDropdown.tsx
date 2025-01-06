"use client"

import React from 'react'
import Link from 'next/link'
import { useAppSelector } from '../redux/store'
import { CiUser } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const UserDropdown = () => {
   const user = useAppSelector((state)=>state.user)
   const router = useRouter()
   const handleLogout = ()=>{
      axios.get("http://localhost:3500/logout").then((res)=>{
        if(res.data){
            router.push("/login")
        }
      }).catch((err)=>console.log(err.message))
   }
  return (
   
    <div  className=" flex justify-center flex-col gap-3 bg-white mt-1 rounded-box z-[1] w-[200px] h-[110px] p-2 shadow absolute right-[20px]  transition-all duration-300 ease-in-out transform">
         <p className='flex items-center gap-2 font-md text-lg text-gray-700' ><CiUser />{user.username}</p>
         <hr />
         <button className='flex items-center gap-2 font-md text-lg text-gray-700' onClick={handleLogout}><IoIosLogOut />Logout</button>
    </div>
  )
}

export default UserDropdown
