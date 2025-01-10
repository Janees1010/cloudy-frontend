
import React from 'react'
import ReactDOM from "react-dom"; // Import ReactDOM to create the portal
import axios from "axios"
import { binType } from '../types/types';
import {toast} from "react-hot-toast"

type props = {
  id:number,
  type:string  | undefined,
  userId:string,
  setBinFiles:React.Dispatch<React.SetStateAction<binType[]>>;
  setTotalDocumentCount:React.Dispatch<React.SetStateAction<number>>;
  close:()=> void
}

const DeleteConfirmationModal = ({close,userId,type,id,setBinFiles,setTotalDocumentCount}:props) => {
     const handleDelete = ()=>{
      const toastId = toast.loading("deleting...")
         axios.get(`${process.env.NEXT_PUBLIC_CLOUD_SERVER_URL}/file/delete`,{params:{
            userId,
            id,
            type
         }}).then((res)=>{
          
           setTotalDocumentCount((pre)=> pre - 1)
           setBinFiles((prev) => prev.filter((file) => file._id != id));
           close()
           toast.success("deleted successfully",{id:toastId})
         }).catch((err)=>{
             console.log(err.message)  
         })
     }
     return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white  rounded-lg w-[450px] p-6">
            <h2 className="text-lg font-semibold mb-4">Delete Permanently ?</h2>
            <p className='pb-5 pt-2 text-md font-md text-gray-700'>Are You sure You Want to Permanently Delete This ?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={close}
                className="px-4 py-2 hover:bg-gray-100 text-blue-500 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`bg-red-500 text-white hover:bg-red-400  px-4 py-2 rounded-lg`}
                // disabled={!folderName}
              >
                Delete Permenantly
              </button>
            </div>
          </div>
        </div>,
        document.body // This ensures the modal is rendered outside of the main app
      )
}

export default DeleteConfirmationModal
