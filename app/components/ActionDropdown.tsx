import { useEffect, useRef, useState } from "react";
import { IoShareOutline, IoDownloadOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { removeChildren } from "../redux/slices/folderSclice";
import axios from "axios";
import ShareModal from "./ShareModal";

interface Props {
  id: number;
}

const ActionDropdown = ({ id }: Props) => {
  const { childrens } = useAppSelector((state) => state.parentFolder);
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [shareModal, setShareModal] = useState<boolean>(false);

  const handleMoveToBin = () => {
    console.log("moving to bin ...");
    axios
      .post("http://localhost:4000/file/moveToBin", { id })
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
  console.log(shareModal);

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
            <button className="flex items-center !bg-white hover:bg-gray-100 active:bg-gray-200 focus:outline-none gap-2 text-md font-sm text-gray-700">
              <IoDownloadOutline className="text-[17px]" /> Download
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
          isOpen={shareModal}
          onClose={() => setShareModal(false)} // Close modal
        />
      )}
    </>
  );
};

export default ActionDropdown;
