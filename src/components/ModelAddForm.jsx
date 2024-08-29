import React, { useState, useCallback } from "react";
import axios from "axios";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { baseUrl } from "../utils/baseUrl";
import { fieldTypeOptions } from "./FieldTypes";
import { addModel } from "../utils/api";

const ModelAddForm = ({ onCancel, onSubmit }) => {
  const [schema, setSchema] = useState([]);
  const [modelName, setModelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [closedFields, setClosedFields] = useState([]);

  const url = window.location.href;
  const projectId = url.split("/").pop();

  const handleFieldChange = useCallback((index, updatedField) => {
    const updatedSchema = [...schema];
    updatedSchema[index] = updatedField;
    setSchema(updatedSchema);
  }, [schema]);

  const handleCloseField = useCallback((index) => {
    const updatedClosedFields = closedFields.filter(
      (closedIndex) => closedIndex !== index
    );
    setClosedFields(updatedClosedFields);

    const updatedSchema = schema.filter((_, i) => i !== index);
    setSchema(
      updatedSchema.map((field, i) => ({
        ...field,
        index: i,
      }))
    );
  }, [closedFields, schema]);

  const fieldOptions = Object.entries(fieldTypeOptions).map(
    ([type, { icon: Icon, color, description }]) => (
      <option key={type} value={type}>
        {Icon && <Icon className="inline-block mr-2" style={{ color }} />}
        {type}
      </option>
    )
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addModel(projectId, schema, modelName);
      onSubmit();
      toast.success("Model added successfully!");
    
    } catch (error) {
      
      setError(error);
      toast.error(error, {
        icon: <FaTimes className="text-red-500" />,
      });
    }
    setLoading(false);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleAddField = () => {
    setClosedFields([]);
    setSchema([...schema, {}]);
  };

  return (
    <div className="absolute top-0 left-0 w-screen h-screen  my-auto flex items-center justify-center z-50  ">
     {/* //bg-black bg-opacity-50 */}

      <form onSubmit={handleSubmit} className="mt-[40%] mx-2 w-full max-h-screen md:mt-[15%] rounded overflow-y-scroll max-w-md md:mx-auto bg-white p-5 shadow-2xl border border-gray-300">
      <h2 className="text-2xl font-bold mb-4">Add Model</h2>
        <div className="mb-4">
          <label htmlFor="modelName" className="block font-medium mb-2">
            Model Name:
          </label>
          <input
            id="modelName"
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value.toLowerCase())}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <h4 className="text-lg mb-2">Fields:</h4>
        {schema.map(
          (field, index) =>
            !closedFields.includes(index) && (
              <Field
                key={index}
                index={index}
                field={field}
                handleFieldChange={handleFieldChange}
                handleCloseField={handleCloseField}
                fieldOptions={fieldOptions}
              />
            )
        )}
        <button
          type="button"
          onClick={handleAddField}
          className="bg-green-500 text-white w-full px-4 py-2 rounded-md mb-4 hover:bg-green-800"
        >
          Add Field
        </button>
        <br />
        <div className="flex justify-between">
        
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin" />
                <span>+Adding...</span>
              </div>
            ) : (
              "+Add"
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = React.memo(
  ({ index, field, handleFieldChange, handleCloseField, fieldOptions }) => (
    <div key={index} className="mb-4 relative pt-5">
      <label htmlFor={`fieldName${index}`} className="block font-medium mb-2">
        Field Name:
      </label>
      <input
  id={`fieldName${index}`}
  type="text"
  name="name"
  value={field.name || ""}
  onChange={(e) =>
    handleFieldChange(index, {
      ...field,
      name: e.target.value.toLowerCase(), // Convert input value to lowercase
    })
  }
  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
  required
/>

      <br />
      <label htmlFor={`fieldType${index}`} className="block font-medium mb-2">
        Field Type:
      </label>
      <select
        id={`fieldType${index}`}
        name="type"
        value={field.type || ""}
        onChange={(e) =>
          handleFieldChange(index, {
            ...field,
            type: e.target.value,
          })
        }
        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
        required
      >
        <option value="">Select Field Type</option>
        {fieldOptions}
      </select>
      {field.type && (
        <p className="text-sm text-gray-500 mt-1">
          {fieldTypeOptions[field.type].description}
        </p>
      )}
      <label></label>
      <br />
      <label htmlFor={`required${index}`} className="block font-medium mb-2">
        Required:
      </label>
      <input
        id={`required${index}`}
        type="checkbox"
        name="required"
        checked={field.required || false}
        onChange={(e) =>
          handleFieldChange(index, {
            ...field,
            required: e.target.checked,
          })
        }
        className="mr-2"
      />
      <br />
      <hr className="my-4" />
      <button
        type="button"
        onClick={() => handleCloseField(index)}
        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-900"
      >
        <FaTimes />
      </button>
    </div>
  )
);

export default ModelAddForm;
