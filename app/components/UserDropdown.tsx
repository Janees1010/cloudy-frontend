"use client"

import React from 'react'
import Link from 'next/link'
import { useAppSelector } from '../redux/store'
import { CiUser } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";

const UserDropdown = () => {
  const user = useAppSelector((state)=>state.user)

  return (
   
    <div  className=" flex justify-center flex-col gap-3 bg-white mt-1 rounded-box z-[1] w-[140px] h-[130px] p-2 shadow absolute right-[20px]  transition-all duration-300 ease-in-out transform">
         <Link className='flex items-center gap-2 font-md text-lg text-gray-700' href=""><CiUser />{user.username}</Link>
         <hr />
         <Link className='flex items-center gap-2 font-md text-lg text-gray-700' href=""><IoIosLogOut />Logout</Link>
    </div>
  )
}

export default UserDropdown
