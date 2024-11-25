// components/NewFolderModal.tsx
import React, { useState } from "react";
import ReactDOM from "react-dom"; // Import ReactDOM to create the portal

type Props = {
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewFolderModal = ({ setIsOpenModal }: Props) => {
  const [folderName, setFolderName] = useState<string>("");

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setFolderName("");
  };

  const handleFolderSubmit = () => {
    console.log("Folder created:", folderName);
    setIsOpenModal(false);
    setFolderName("");
  };

  // Create the modal using React Portal
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">Create New Folder</h2>
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="w-full bg-white p-2 border rounded-lg mb-4"
          placeholder="Enter folder name"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 hover:bg-gray-100 text-blue-500 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleFolderSubmit}
            className={`${
              folderName ? "text-blue-500 hover:bg-gray-100" : "text-gray-200"
            } px-4 py-2 rounded-lg`}
            disabled={!folderName}
          >
            Create
          </button>
        </div>
      </div>
    </div>,
    document.body // This ensures the modal is rendered outside of the main app
  );
};

export default NewFolderModal;