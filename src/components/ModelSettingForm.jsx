import axios from "axios";
import React, { useState, useEffect } from "react";
import { baseUrl } from "../utils/baseUrl";

const ModelSettingForm = ({ models, selectedModel, onClose }) => {
  const [relationshipType, setRelationshipType] = useState("one-to-many"); // Default to One-to-Many
  const [selectedModel1, setSelectedModel1] = useState("");
  const [selectedModelName, setSelectedModelName] = useState("");

  const url = window.location.href;
  const projectId = url.split("/").pop();


  useEffect(() => {
    setSelectedModelName(selectedModel.modelName);
  }, [selectedModel]);

  const handleRelationshipTypeChange = (event) => {
    setRelationshipType(event.target.value);
  };

  const handleModel1Change = (event) => {
    setSelectedModel1(event.target.value);
  };

  const handleSubmit =  async(event) => {
    event.preventDefault();
   

    const selectedModelObject = models.find(
      (model) => model.modelName === selectedModel1
    );

    try {
      const response = await axios.post(`${baseUrl}/model/relationship/create`, {
        mainModelId: selectedModel._id,
        relatedModelId: selectedModelObject._id,
        relationshipType: relationshipType,
      });

    console.log(response.data.message)
    localStorage.removeItem(`cachedModels_${projectId}`);
  
    
    } catch (error) {
      console.error('An error occurred:', error);
    }
  
  };

  const filteredModels = models.filter(
    (model) => model.modelName !== selectedModel.modelName
  );

  // Define arrow representation based on relationship type
  const arrowRepresentation =
    relationshipType === "many-to-many" ? (
      <div className="flex flex-col items-center">
        <span>↔</span>
        <span>↔</span>
      </div>
    ) : (
      "→"
    );

  return (
    <div className="absolute top-0 left-0 w-screen h-screen my-auto flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl border border-gray-300 p-5"
      >
        <h2 className="text-xl font-semibold mb-4">Model Settings</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Relationship to:</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={selectedModel1}
            onChange={handleModel1Change}
          >
            <option value="">Select a Model</option>
            {filteredModels.map((model) => (
              <option key={model._id} value={model.modelName}>
                {model.modelName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">
            Relationship Type:
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="one-to-many"
              checked={relationshipType === "one-to-many"}
              onChange={handleRelationshipTypeChange}
              aria-label="One-to-Many Relationship"
            />
            <span className="ml-2">One-to-Many</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="many-to-one"
              checked={relationshipType === "many-to-one"}
              onChange={handleRelationshipTypeChange}
              aria-label="Many-to-One Relationship"
            />
            <span className="ml-2">Many-to-One</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="many-to-many"
              checked={relationshipType === "many-to-many"}
              onChange={handleRelationshipTypeChange}
              aria-label="Many-to-Many Relationship"
            />
            <span className="ml-2">Many-to-Many</span>
          </label>
        </div>
        <div className="ml-1 text-gray-500 w-full">
          {relationshipType === "one-to-many"
            ? "Allow only one model to be referenced."
            : relationshipType === "many-to-one"
            ? "Allow multiple models to reference one model."
            : "Allow multiple models to be referenced by each other."}
        </div>
        <div className="flex justify-center">
          {selectedModelName} {arrowRepresentation} {selectedModel1}
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
            type="submit"
          >
            Save
          </button>
          <button
            className="bg-gray-300 text-white rounded px-4 py-2 hover:bg-gray-400"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModelSettingForm;
