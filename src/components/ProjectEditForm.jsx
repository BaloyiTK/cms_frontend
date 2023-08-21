import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const ProjectEditForm = ({ project, onClose, onProjectEdited }) => {
  const { name: initialName, description: initialDescription } = project;
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.patch(`${baseUrl}/project/${project._id}`, {
        name,
        description,
      });
      onClose(response.data);
      setIsLoading(false);
      onProjectEdited()
      toast.success("Changes saved!");
      localStorage.removeItem(`cachedProject_${project._id}`); // Clear the cache
    } catch (error) {
      // Handle any errors
      console.error(error);

      toast.error(error, {
        icon: <FaTimes className="text-red-500" />,
      });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6 transform transition-all duration-300 ease-in-out mx-2">
        <h3 className="text-2xl font-bold mb-4">Edit Project</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-gray-700">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              className="border border-gray-300 px-4 py-2 rounded-md w-full h-36 resize-none focus:outline-none focus:ring-2 focus:border-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-between">
           

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save"
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEditForm;
