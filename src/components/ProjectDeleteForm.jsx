import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const ProjectDeleteForm = ({ project, onClose, onDelete, isDeleting }) => {
  const [confirmation, setConfirmation] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false); // New state variable for confirmation check
  const [isLoading, setIsLoading] = useState(false);


  const handleConfirmationChange = (e) => {
    setConfirmation(e.target.value);
    setIsConfirmed(e.target.value.toLowerCase() === project.name.toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClose();
    onDelete();
  };

  const handleCancel = () => {
    onClose(); // Indicate canceled deletion
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6 transform transition-all duration-300 ease-in-out mx-2">
        <h3 className="text-2xl font-bold mb-4">Delete Project</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <p className="text-red-600  mb-2">
              WARNING: This action is permanent. Type the project{" "}
              <span className="font-bold">{project && project.name}</span> to
              confirm deletion:
            </p>
            <input
              type="text"
              value={confirmation}
              onChange={handleConfirmationChange}
              placeholder="project name"
              className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:border-red-500"
              required
            />
          </div>
          <div className="flex justify-between">
            <div>
              <button
                type="submit"
                disabled={!isConfirmed}
                className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg focus:outline-none ${
                  !isConfirmed ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin" />
                  <span>Deleting...</span> 
                 
                </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectDeleteForm;
