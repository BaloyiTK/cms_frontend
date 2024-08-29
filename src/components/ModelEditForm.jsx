import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../utils/baseUrl";
import { fieldTypeOptions } from "./FieldTypes";
import { PulseLoader } from 'react-spinners';


const ModelEditForm = ({ index, onClose, onEdit }) => {
  const [modelName, setModelName] = useState("");
  const [updatedModelName, setUpdatedModelName] = useState("");
  const [fields, setFields] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [IsFetchingModelData, setIsFetchingModelData] = useState(false)

  const projectId = window.location.href.split("/").pop();

  const [cachedModelData, setCachedModelData] = useState(null);

  useEffect(() => {
    if (cachedModelData) {
      const modelData = cachedModelData;
      setModelName(modelData.modelName);
      setUpdatedModelName(modelData.modelName);
      setFields(modelData.fields);
      setFieldTypes(modelData.fields.map((field) => field.type));
    } else {
      fetchModel();
    }
  }, [cachedModelData]);

  const fetchModel = async () => {
    try {
      setIsFetchingModelData(true)
      const response = await axios.get(`${baseUrl}/model/${projectId}`);
      const modelData = response.data[index];
      setCachedModelData(modelData);
      setModelName(modelData.modelName);
      setUpdatedModelName(modelData.modelName);
      setFields(modelData.fields);
      setFieldTypes(modelData.fields.map((field) => field.type));
      setIsFetchingModelData(false)
    } catch (error) {
      console.error("Error retrieving models:", error);
    }
  };

  const handleFieldTypeChange = (index, event) => {
    const updatedFields = [...fields];
    const updatedField = { ...updatedFields[index], type: event.target.value };
    updatedFields[index] = updatedField;

    setFields(updatedFields);
    setFieldTypes((prevFieldTypes) => {
      const newFieldTypes = [...prevFieldTypes];
      newFieldTypes[index] = event.target.value;
      return newFieldTypes;
    });
  };

  const handleFieldChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    const updatedFields = [...fields];
    const updatedField = { ...updatedFields[index] };

    if (type === "checkbox") {
      updatedField[name] = checked;
    } else {
      updatedField[name] = value;
    }

    updatedFields[index] = updatedField;
    setFields(updatedFields);
  };

  const handleModelNameChange = (event) => {
    setUpdatedModelName(event.target.value);
  };

  const handleAddField = () => {
    const defaultFieldType = Object.keys(fieldTypeOptions)[0];
    const newField = { name: "", type: defaultFieldType, required: false };
    setFieldTypes([...fieldTypes, defaultFieldType]);
    setFields([...fields, newField]);
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);

    const updatedFieldTypes = [...fieldTypes];
    updatedFieldTypes.splice(index, 1);

    setFields(updatedFields);
    setFieldTypes(updatedFieldTypes);
  };

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    try {
      const response = await axios.patch(
        `${baseUrl}/model/${projectId}/${modelName}`,
        {
          modelName,
          updatedModelName,
          fields,
        }
      );

      toast.success("Changes saved!");
      setIsLoading(false);
      onClose();
      onEdit();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error(error.message, {
        icon: <FaTimes className="text-red-500" />,
      });
    }
    setFields([]);
    setFieldTypes([]);
  };

  const handleCancel = () => {
    setFields([]);
    setFieldTypes([]);
    onClose();
  };

  return (
    <div className="absolute top-0 left-0 w-screen h-screen  my-auto flex items-center justify-center z-50 ">
      <div className=" bg-white shadow-2xl border border-gray-300 p-5 max-h-[70%] w-full md:w-2/3  mx-4 md:mx-[15%] overflow-y-scroll scrollbar-hide">
        <div className="text-xl font-semibold mb-4">Edit Model</div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="modelName"
          >
            Model Name:
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={updatedModelName}
            onChange={handleModelNameChange}
            name="modelName"
          />
        </div>
        {IsFetchingModelData ? <div className="flex justify-center h-40"><PulseLoader color="#36d7b7" /></div> :<div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fields"
          >
            Fields:
          </label>
          {fields.map(({ name, required }, index) => {
            const fieldType = fieldTypes[index];
            const FieldTypeIcon = fieldTypeOptions[fieldType].icon;

            return (
              <div
                className="flex flex-col sm:flex-row justify-center items-center relative mb-4 border p-6 md:p-2 rounded-lg shadow-md"
                key={index}
              >
                <select
                  className="mb-2 mt-3 md:mb-0 md:mt-0 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={fieldTypes[index]}
                  onChange={(event) => handleFieldTypeChange(index, event)}
                >
                  {Object.entries(fieldTypeOptions).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.id}
                    </option>
                  ))}
                </select>
                <input
                  className="mb-2 md:mb-0 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-2"
                  type="text"
                  value={name}
                  onChange={(event) => handleFieldChange(index, event)}
                  name="name"
                  placeholder="Field name"
                />
                <label className="md:ml-2 md:flex md:items-center  mb-2 md:mb-0 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <span className="mr-1">Required</span>
                  <input
                    type="checkbox"
                    name="required"
                    checked={required}
                    onChange={(event) => handleFieldChange(index, event)}
                  />
                </label>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-sm md:m-4 flex items-center justify-center p-1 rounded-full focus:outline-none absolute top-2 right-2 md:top-0 md:right-0 md:relative"
                  onClick={() => handleRemoveField(index)}
                >
                  <FaTimes />
                </button>
              </div>
            );
          })}
          <button
            className="p-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded focus:outline-none focus:shadow-outline w-full"
            onClick={handleAddField}
          >
            Add Field
          </button>
        </div>}

        
        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin" />
                <>Saving...</>
              </div>
            ) : (
              "Save"
            )}
          </button>
          <button
            className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded focus:outline-none focus:shadow-outline"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelEditForm;
