import React from "react";
import { PiFileJs } from "react-icons/pi";
import { FaFile, FaFolder, FaRegImage } from "react-icons/fa";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import axios from "axios"
import { useAppSelector } from "../redux/store";

type props = {
    name:string,
    type:string
}



const FileIcons = ({name,type}:props) => {
  const user = useAppSelector((state)=> state.user)
  const {parentId} = useAppSelector((state) => state.parentFolder)
  // const openFile = (
  //   e: React.MouseEvent,
  //   id: number,
  //   type: string,
  //   url?: string
  // ) => {
  //   e.preventDefault();
  //   if (type !== "folder" && url) {
  //     axios
  //       .get("http://localhost:4000/file/update-LastAcceseed", {
  //         params: { userId: user._id, fileId: id },
  //       })
  //       .then((res) => {
  //         console.log(process.env.NEXT_PUBLIC_S3_LOCATION,"location");
  //         window.open(process.env.NEXT_PUBLIC_S3_LOCATION+url, "_blank");
  //       })
  //       .catch((err) => console.log(err.message));
  //     return;
  //   }
  //   console.log(parentId, "parent");
  
  //   fetchChildrens(id);
  // };
   
  return (
    <td 
      // openFile(e, child._id, child.childrenType, child.s3Url)
      className="text-md font-md flex p-2 items-center gap-2">
      {type === "folder" ? (
        <FaFolder className="text-gray-600" />
      ) : type?.startsWith("image/") ? (
        <FaRegImage className="text-red-500" />
      ) : type?.startsWith("text/") ? (
        <FaFile className="text-blue-700" />
      ) : type === "application/x-javascript" ? (
        <PiFileJs className="text-yellow-500" />
      ) : type === "application/pdf" ?   (
            <MdOutlinePictureAsPdf className="text-red-600 " />
      ) : <FaFile className="text-blue-700" /> }
      {name.length > 50 ? name.slice(0, 45) + "..." : name}
    </td>
  );
};

export default FileIcons;
