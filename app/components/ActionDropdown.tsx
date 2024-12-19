import { useEffect, useRef, useState } from "react";
import { IoShareOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDots,BsDownload } from "react-icons/bs";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { removeChildren } from "../redux/slices/folderSclice";
import axios from "axios";
import ShareModal from "./ShareModal";

interface Props {
  id: number;
  type: string | undefined;
  name: string;
  s3Url: string;
}

const ActionDropdown = ({ id, type, name, s3Url }: Props) => {
  const { childrens } = useAppSelector((state) => state.parentFolder);
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [shareModal, setShareModal] = useState<boolean>(false);

  const handleMoveToBin = () => {
    console.log("moving to bin ...");
    axios
      .post("http://localhost:4000/file/moveToBin", { id, type, name })
      .then((res) => {
        const payload = { id };
        dispatch(removeChildren(payload));
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // Handle click outside to close the dropdown
  const handleClickOutside = (e: MouseEvent) => {
    if (
      !dropdownRef.current?.contains(e.target as Node) &&
      !buttonRef.current?.contains(e.target as Node)
    ) {
      setDropDown(false); // Close dropdown if clicked outside
    }
  };

  // Handle file download
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
  
    const downloadUrl = `${process.env.NEXT_PUBLIC_S3_LOCATION}${s3Url}`;
  
    try {
      // Fetch the file as a Blob
      const response = await fetch(downloadUrl);
      
      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
  
      // Convert the response to a Blob
      const blob = await response.blob();
     
      // Create a Blob URL from the Blob
      const blobUrl = URL.createObjectURL(blob);
  
      // Create a hidden anchor element to trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.setAttribute("download", name);
      downloadLink.download = name; // Optional: Set file name if not provided
      downloadLink.style.display = "none"; // Make sure it's hidden from the UI
  
      // Append the anchor to the body
      document.body.appendChild(downloadLink);
  
      // Trigger the download
      downloadLink.click();
  
      // Clean up the Blob URL after the download
      URL.revokeObjectURL(blobUrl);
  
      // Remove the anchor from the DOM
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error during download:", (error as Error).message);
    }
  };
  
  // Add event listener for clicks outside the dropdown and button
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Button to toggle dropdown */}
      <button
        ref={buttonRef} // Reference for the button
        onClick={() => setDropDown((prev) => !prev)} // Toggle dropdown visibility
        className="flex bg-white items-center gap-2 hover:bg-gray-100 text-md font-sm text-gray-700 rounded-md"
      >
        <BsThreeDots className="text-xl text-gray-600" />
      </button>

      {/* Dropdown menu */}
      {dropDown && (
        <ul
          ref={dropdownRef}
          className="menu flex flex-col gap-1 bg-white right-[70px] mt-1 rounded-box z-[1] w-48 px-2 shadow-lg absolute transition-all duration-300 ease-in-out transform"
        >
          <li className="hover:bg-gray-100">
            <button
              onClick={() => setShareModal(true)}
              className="flex items-center gap-2 hover:bg-gray-100 bg-white active:!bg-white focus:outline-none text-md font-sm text-gray-700 rounded-md"
            >
              <IoShareOutline className="text-[17px]" /> Share
            </button>
          </li>

          <li>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 hover:bg-gray-100 bg-white active:!bg-white focus:outline-none text-md font-sm text-gray-700 rounded-md"
            > <BsDownload className="text-[17px]" />
              Download
            </button>
          </li>
          <hr />
          <li>
            <button
              onClick={handleMoveToBin}
              className="flex items-center gap-2 text-md hover:bg-gray-100 font-sm text-gray-700"
            >
              <RiDeleteBin6Line className="text-[17px] text-red-400" /> Move to
              bin
            </button>
          </li>
        </ul>
      )}

      {/* Share Modal */}
      {shareModal && (
        <ShareModal
          name={name}
          type={type}
          id={id}
          isOpen={shareModal}
          onClose={() => setShareModal(false)} // Close modal
        />
      )}
    </>
  );
};

export default ActionDropdown;
