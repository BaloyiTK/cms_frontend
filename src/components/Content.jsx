import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { fieldTypeOptions } from "./FieldTypes";
import { baseUrl } from "../utils/baseUrl";
import { FaSpinner } from "react-icons/fa";

const Content = ({ onSelectedModel }) => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedModelIndex, setSelectedModelIndex] = useState(null);

  const url = window.location.href;
  const projectId = url.split("/").pop();

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
        const response = await axios.get(`${baseUrl}/model/${projectId}`);
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
  }, [fetchModels]);

  const handleModelClick = (model, index) => {
    setSelectedModel(model);
    setSelectedModelIndex(index);
    onSelectedModel(model);
  };

  return (
    <div className="max-w-lg mx-auto md:p-4">
      <div className="h-5 flex items-center">
        <h1 className="text-sm font-bold">CONTENT</h1>
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

        {/* {selectedModel && (
          <div className="mt-4">
            <h2 className="text-sm font-bold">Fields</h2>
            <ul>
              {selectedModel.fields.map((field, index) => {
                const fieldType = fieldTypeOptions[field.type];
                const FieldIcon = fieldType.icon;

                return (
                  <li key={index}>
                    <span className="flex items-center">
                      <FieldIcon className="mr-2" />
                      <span className="">{field.name}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Content;
