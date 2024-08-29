import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectAddForm = ({ onClose, onProjectAdded }) => {
  const [project, setProject] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const  res = await axios.post(`${baseUrl}/project`, project);
      console.log(res)
      handleCancel(); // Close the form after successful submission
      setIsLoading(false);
      onProjectAdded();
      toast.success("Project added successfully!");
    } catch (error) {
      setIsLoading(false)
      console.error(error);
      toast.error(error.response.data.message, {
        icon: <FaTimes className="text-red-500" />,
      });
    }
  };

  const handleCancel = () => {
    setProject({ name: "", description: "" });
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 ">
      <div className="bg-white w-96 rounded-lg p-6 transform transition-all duration-300 ease-in-out mx-3  shadow-2xl border border-gray-300">
        <h3 className="text-xl font-bold mb-4">New Project</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-gray-700">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={project.name}
              onChange={handleInputChange}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 text-gray-700">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleInputChange}
              className="border border-gray-300 px-4 py-2 rounded-lg w-full h-36 resize-none focus:outline-none focus:ring focus:border-blue-500"
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
                  <span>Adding...</span>
                </div>
              ) : (
                "Add"
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectAddForm;
