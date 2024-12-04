"use client"
import React,{useEffect,useCallback, useState} from 'react'
 import axios from "axios"
 import { useAppSelector } from '@/app/redux/store'
 
 const Page = () => {
    const user  = useAppSelector((state)=> state.user)
    const [recentFiles,setRecentFiles] = useState()
    useEffect(()=>{
      axios.get("http://localhost:4000/file/recent",{
        params:{
            userId:user._id
        }}).then((res)=>{
         console.log(res.data);
         setRecentFiles(res.data)
      }).catch((err)=>console.log(err.message)
      )
    },[])
   return (
     <div>
        <h1>Recent</h1>
     </div>
   )
 }
 
 export default Page
 