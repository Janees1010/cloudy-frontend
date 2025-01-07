import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { UserType } from "../types/types";
import { useAppSelector } from "../redux/store";
import {toast} from "react-hot-toast"

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  id:string | number;
  type:string | undefined,
  name:string
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose,id,type,name}) => {

  const user = useAppSelector((state)=>state.user)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]); // Holds the users matching the search query

  // Mock API call to simulate fetching users
  const fetchUsers = async (query: string) => {
    // Simulate an API call delay
    const {data}  =  await axios.get(`http://localhost:3500/user/search`,{params:{query,email:user.email}})
    console.log(data,"search");
    return data
  };
  const handleShare = async()=>{      
     try {
        const uploadToastId = toast.loading("sharing...");
        const receivers = selectedUsers.map((user)=>{
          return user._id 
        })
        console.log(receivers);
        console.log(name,"name");
        const {data} = await axios.post("http://localhost:4000/file/share",{userId:user._id,id,receivers,type,name})
        onClose()
        toast.success("successfully shared", { id: uploadToastId });
     } catch (error) {
        console.log((error as Error).message); 
     }
  }
  // Fetch users when searchQuery changes
  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery.trim()) {
        const users = await fetchUsers(searchQuery);
        setFilteredUsers(users);
      } else {
        setFilteredUsers([]);
      }
    };

    fetchData();
  }, [searchQuery]);

  const handleUserSelect = (user:UserType) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Share File</h2>
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
          >
            <IoMdClose />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Search Results */}
        {filteredUsers.length > 0 ? (
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
            {filteredUsers.map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-md"
                onClick={() => handleUserSelect(user)}
              >
                <span className="text-md text-gray-700">{user.username}</span>
                {selectedUsers.includes(user) && (
                  <span className="text-blue-500 text-xs font-semibold">
                    Selected
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <p className="text-sm text-gray-500 text-center">No users found.</p>
        ) : null}

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">
              Selected Users:
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user, index) => (
                <span
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-semibold"
                >
                  {user.username}
                  <button
                    className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                    onClick={() => handleUserSelect(user)}
                  >
                    <IoMdClose />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md py-2 px-4 mr-2 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 focus:outline-none"
            onClick={handleShare}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
