import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdWarning } from "react-icons/md";

const ModelDeleteForm = ({ onClose, onDelete, isLoading }) => {

  //const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="absolute top-0 left-0 w-screen h-screen  my-auto flex items-center justify-center z-50 ">
    
      <div className="p-4 bg-white mx-2 shadow-2xl border border-gray-300">
      <h2 className="text-xl font-semibold mb-4">Delete Model</h2>
        <div className="flex items-center mb-2">
          <MdWarning className="text-red-500 text-lg mr-2" />
          <p>Deleting this model will result in permanent data loss.</p>
        </div>
        <p className="mb-4">Are you sure you want to proceed?</p>
        <div className="flex justify-between">
         

          <button
              className="bg-red-500 hover:bg-red-60 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isLoading}
              onClick={onDelete}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelDeleteForm;
