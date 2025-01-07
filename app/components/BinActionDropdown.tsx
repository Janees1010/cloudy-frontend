import {  useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { TbRestore } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import ShareModal from "./ShareModal";
import { binType } from "../types/types";
import{toast} from "react-hot-toast"
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface Props {
  id: number;
  type: string | undefined;
  setBinFiles: React.Dispatch<React.SetStateAction<binType[]>>;
  name: string;
  setTotalDocumentCount: React.Dispatch<React.SetStateAction<number>>
}

const BinActionDropdown = ({ id, type, setBinFiles, name,setTotalDocumentCount }: Props) => {
  const user = useAppSelector((state) => state.user);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [shareModal, setShareModal] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  // Handle click outside to close the dropdown
  const handleClickOutside = (e: MouseEvent) => {
    if (
      !dropdownRef.current?.contains(e.target as Node) &&
      !buttonRef.current?.contains(e.target as Node)
    ) {
      setDropDown(false); // Close dropdown if clicked outside
    }
  };

  const handleRestore = async () => {
    try {
      const toastId = toast.loading("restoring ...")
      const { data } = await axios.get("http://localhost:4000/file/restore", {
        params: { userId: user._id, type, id, name },
      });
      if (data) {
        setTotalDocumentCount((pre)=> pre - 1)
        setBinFiles((prev) => prev.filter((file) => file._id != id));
        toast.success("sucessfully restored",{id:toastId})
      }
      setDropDown(false);
    } catch (error) {
      setDropDown(false);
      console.log((error as Error).message);
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
          className="menu flex flex-col gap-1 bg-white right-[70px] mt-1 rounded-box z-[1] w-[200px] px-2 shadow-lg absolute transition-all duration-300 ease-in-out transform"
        >
          <li className="hover:bg-gray-100">
            <button
              onClick={handleRestore}
              className="flex items-center gap-2 hover:bg-gray-100 bg-white active:!bg-white focus:outline-none text-md font-sm text-gray-700 rounded-md"
            >
              <TbRestore className="text-[17px]" /> Restore
            </button>
          </li>
          <hr />
          <li>
            <button
              onClick={() => setOpenModal(!openModal)}
              className="flex items-center !bg-white hover:bg-gray-100 active:bg-gray-200 focus:outline-none gap-2 text-md font-sm text-gray-700"
            >
              <MdDeleteOutline className="text-[17px]" /> Delete Permennatly
            </button>
          </li>
        </ul>
      )}

      {/* Share Modal */}
      {shareModal && (
        <ShareModal
          name={name}
          id={id}
          type={type}
          isOpen={shareModal}
          onClose={() => setShareModal(false)} // Close modal
        />
      )}
      {openModal ? (
        <DeleteConfirmationModal
          setTotalDocumentCount={setTotalDocumentCount}
          setBinFiles = {setBinFiles}
          id={id}
          type={type}
          userId={user._id}
          close={() => setOpenModal(false)}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default BinActionDropdown;
