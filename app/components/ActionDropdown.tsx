import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoShareOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDots, BsDownload } from "react-icons/bs";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { removeChildren } from "../redux/slices/folderSclice";
import axios from "axios";
import { toast } from "react-hot-toast";
import ShareModal from "./ShareModal";
import { FileData, Folder, SharedFiles } from "../types/types";

interface Props {
  id: string | number;
  type: string | undefined;
  name: string;
  s3Url?: string;
  shared? :boolean;
  setTotalDocumentCount?: React.Dispatch<React.SetStateAction<number>>;
  setFolders?: React.Dispatch<React.SetStateAction<Folder[]>> | null;
  setFiles?:
    | React.Dispatch<React.SetStateAction<FileData[]>>
    | null
    | React.Dispatch<React.SetStateAction<SharedFiles[]>>;
}

const ActionDropdown = ({
  id,
  type,
  name,
  s3Url,
  shared = false,
  setFiles = null,
  setFolders = null,
  setTotalDocumentCount,
}: Props) => {

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropDown, setDropDown] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
   

  const handleMoveToBin = () => {
    const toastId = toast.loading("moving To Bin ...");
    axios
      .post(`${process.env.NEXT_PUBLIC_CLOUD_SERVER_URL}/file/moveToBin`, {
        id,
        type,
        name,
        userId: user._id,
      })
      .then(() => {
        setTotalDocumentCount ? setTotalDocumentCount((pre) => pre - 1) : "";
        if (type === "folder" && setFolders) {
          setFolders((prev) => prev.filter((folder) => folder._id != id));
        } else if (type != "folder" && setFiles || shared && setFiles) {  
          setFiles((prev: any) => prev.filter((file: any) => file._id != id));
        } else {
          dispatch(removeChildren({ id }));
        }
        toast.success("moved successfully", { id: toastId });
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const handleDownload = async () => {
    const downloadUrl = `${process.env.NEXT_PUBLIC_S3_LOCATION}${s3Url}`;
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error during download:", (error as Error).message);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      !dropdownRef.current?.contains(e.target as Node) &&
      !buttonRef.current?.contains(e.target as Node)
    ) {
      setDropDown(false);
    }
  };

  const handleButtonClick = () => {
    if (!dropDown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      setPosition({
        top: rect.top + scrollY - 5, // Dropdown appears above the button
        left: rect.left + rect.width / 2 + scrollX - 10, // Dropdown aligns slightly to the right
      });
    }
    setDropDown((prev) => !prev);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="flex items-center bg-gray-50 rounded-md hover:bg-gray-100 p-2"
      >
        <BsThreeDots className="text-gray-600 text-lg" />
      </button>

      {dropDown &&
        createPortal(
          <ul
            ref={dropdownRef}
            className="absolute z-50 bg-white shadow-lg rounded-lg w-48 p-2"
            style={{
              top: position.top,
              left: position.left,
              transform: "translate(-50%, -100%)", // Adjust to ensure dropdown is centered and above
            }}
          >
            <li className="hover:bg-gray-100 p-2">
              <button
                onClick={() => setShareModal(true)}
                className="flex items-center gap-2"
              >
                <IoShareOutline className="text-gray-600" /> Share
              </button>
            </li>
            {type !== "folder" && (
              <li className="hover:bg-gray-100 p-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <BsDownload className="text-gray-600" /> Download
                </button>
              </li>
            )}
            <hr />
            <li className="hover:bg-gray-100 p-2">
              <button
                onClick={handleMoveToBin}
                className="flex items-center gap-2"
              >
                <RiDeleteBin6Line className="text-red-400" /> Move to Bin
              </button>
            </li>
          </ul>,
          document.body // Renders dropdown outside the parent DOM hierarchy
        )}

      {shareModal && (
        <ShareModal
          name={name}
          type={type}
          id={id}
          isOpen={shareModal}
          onClose={() => setShareModal(false)}
        />
      )}
    </>
  );
};

export default ActionDropdown;
