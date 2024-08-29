import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaTimes, FaTrashAlt, FaSpinner, FaCog } from "react-icons/fa";
import ModelEditForm from "./ModelEditForm";
import ModelDeleteForm from "./ModelDeleteFrom";
import { toast } from "react-toastify";
import { baseUrl } from "../utils/baseUrl";

import { fieldTypeOptions } from "./FieldTypes";
import ModelAddForm from "./ModelAddForm";
import ModelSettingForm from "./ModelSettingForm";

const Schema = ({ showAddForm }) => {
  const [models, setModels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModelEditForm, setShowModelEditForm] = useState(false);
  const [showModelDeleteForm, setShowModelDeleteForm] = useState(false);
  const [showModelSettingsForm, setShowModelSettingsForm] = useState(false)
  const [selectedModelIndex, setSelectedModelIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    if (showAddForm) {
      setShowForm(showAddForm)
      
    }
 
  }, [showAddForm])
  
  

  const projectId = window.location.href.split("/").pop();

  const fetchModels = useCallback(async () => {
    setIsLoading(true); // Start loading

    // Try to get models from cache
    const cachedModels =
      JSON.parse(localStorage.getItem(`cachedModels_${projectId}`)) || [];

    if (cachedModels.length > 0) {
      setModels(cachedModels);
      setIsLoading(false); // Stop loading
    } else {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseUrl}/model/${projectId}`);
        setIsLoading(false);
        setModels(response.data);
        localStorage.setItem(
          `cachedModels_${projectId}`,
          JSON.stringify(response.data)
        );
      } catch (error) {
        console.error("Error retrieving models:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  }, [projectId]);

  useEffect(() => {
    fetchModels();
  }, [showForm, showModelDeleteForm, fetchModels]);

  const handleAddModel = () => {
    setShowForm(true);
    setSelectedModel(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowModelEditForm(false);
    setShowModelDeleteForm(false);
    setSelectedModel(null);
    setShowModelSettingsForm(false)
  };

  const handleModelClick = (model, index) => {
    setSelectedModel(model);
    setSelectedModelIndex(index);
  };

  const handleEditModel = () => {
    setShowModelEditForm(true);
  };

  const handleSettingClick = () => {
    setShowModelSettingsForm(true);
  };

  

  const handleEdit = () => {
    localStorage.removeItem(`cachedModels_${projectId}`);
    setSelectedModel(null);
    fetchModels();
  };

  const handleModelAdded = () => {
    localStorage.removeItem(`cachedModels_${projectId}`);
    fetchModels();
    setShowForm(false);
  };

  const handleDeleteClick = () => {
    setShowModelDeleteForm(true);
  };

  const handleDeleteModel = () => {
    setIsLoading(true);

    const deleteModel = async () => {
      try {
        await axios.delete(`${baseUrl}/model/${projectId}`, {
          data: {
            selectedModel,
          },
        });

        const updatedModels = models.filter((model) => model !== selectedModel);
        setModels(updatedModels);
        setSelectedModel(null);
        setShowModelDeleteForm(false);
        setIsLoading(false);
        toast.success("Model deleted");
        localStorage.removeItem(`cachedModels_${projectId}`); // Clear the cache
      } catch (error) {
        console.error(error);
        toast.error(error, {
          icon: <FaTimes className="text-red-500" />,
        });
      }
    };

    deleteModel();
  };

  return (
    <div className="max-w-lg mx-auto md:p-4">
      <div className="h-5 flex items-center">
        <h1 className="text-sm font-bold">MODELS</h1>
        <div className="ml-5 w-16">
          {selectedModel && (
            <div className="flex">
              <span className="flex justify-center ml-2">
                <FaEdit
                  className="cursor-pointer hover:text-green-500"
                  onClick={handleEditModel}
                />
              </span>
              {showModelEditForm && (
                //  <div className="absolute z-50">
                <ModelEditForm
                  index={selectedModelIndex}
                  onClose={handleCancel}
                  onEdit={handleEdit}
                />
                //  </div>
              )}
              {showModelDeleteForm && (
                // <div className="absolute left-0 top-0 h-full  right-0 z-50">
                <ModelDeleteForm
                  index={selectedModelIndex}
                  onClose={handleCancel}
                  onDelete={handleDeleteModel}
                  isLoading={isLoading}
                />
                // </div>
              )}

             {showModelSettingsForm && (
                // <div className="absolute left-0 top-0 h-full  right-0 z-50">
                <ModelSettingForm
                  // index={selectedModelIndex}
                  onClose={handleCancel}
                  // onDelete={handleDeleteModel}
                  // isLoading={isLoading}
                  models = {models}
                  selectedModel ={selectedModel}
                />
                // </div>
              )}


              <span className="flex justify-center ml-2">
                <FaTrashAlt
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeleteClick}
                />
              </span>
              <span className="flex justify-center ml-2">
                <FaCog
                  className="cursor-pointer hover:text-green-500"
                  onClick={handleSettingClick}
                />
              </span>
            </div>
          )}
        </div>
      </div>


      <div>
        <ul className="flex md:flex-col flex-row md:mt-2 ">
          {models.map((model, index) => (
            <li
              key={index}
              className={`border p-1 m-1 mb-1 mr-2 cursor-pointer md:border-none md:p-1  md:m-0 hover:bg-blue-50  ${
                selectedModel === model ? "text-blue-400 bg-blue-100" : ""
              }`}
              onClick={() => handleModelClick(model, index)}
            >
              {model.modelName}
            </li>
          ))}
        </ul>

        <div className="flex items-center mt-4 ">
          {!showForm && (
            <button
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-1 rounded-sm focus:outline-none focus:shadow-outline"
              onClick={handleAddModel}
            >
              Add Model
            </button>
          )}
          {showForm && (
            // <CreateModel onCancel={handleCancel} onSubmit={handleCancel}  />
            <ModelAddForm onCancel={handleCancel} onSubmit={handleModelAdded} />
          )}
        </div>
        {selectedModel && (
          <div className="mt-4">
            <h2 className="text-sm font-bold">Fields</h2>
            <ul>
              {selectedModel.fields.map((field, index) => {
                const fieldType = fieldTypeOptions[field.type];
                const FieldIcon = fieldType.icon;
                const FieldColor = fieldType.color;
                return (
                  <li key={index} className=" text-sm bg-white shadow-lg border border-gray-200 px-1 my-2">
                   <span className="flex items-center">
                   <FieldIcon className={`mr-2 text-${FieldColor}-500 `} />
                   <span >{field.name}</span>
                    </span> 

                    <span className="text-blue-300 text-xs flex w-fit justify-center items-center">
                    <p className="bg-gray-100 px-2 w-fit rounded-sm mr-1 my-1">{field.type}</p>
                    {field.required && <p className="bg-gray-100 px-2 w-fit rounded-sm mr-1">required</p>} 

                    </span>

                 
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schema;
