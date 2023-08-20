import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MediaPreview } from "./MediaPreview";
import { modules, formats } from "../utils/editorConfig";
import { FaSpinner } from "react-icons/fa";

const ContentForm = ({
  dynamicFields,
  formData,
  handleFieldChange,
  cancelForm,
  mediaPreview,
  setStartDate,
  startDate,
  handleButtonClick,
  modelName,
  error,
  IsAddingContentDraft,
  IsAddingContentPublish,
}) => (
  <form className="mt-4">
    <div className="text-red-500">{error && error}</div>
    {dynamicFields.map((field, index) => (
      <div key={index} className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={field.name}
        >
          {field.name}
        </label>
        {field.type === "DateTime" && (
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="block w-full p-2 border border-gray-300 rounded"
          />
        )}
        {field.type === "SingleLineText" && (
          <input
            type="text"
            id={field.name}
            className="block w-full p-2 border border-gray-300 rounded"
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`${
              modelName.charAt(0).toUpperCase() + modelName.slice(1)
            } ${field.name}...`}
          />
        )}

        {field.type === "Number" && (
          <input
            type="number"
            id={field.name}
            className="block w-full p-2 border border-gray-300 rounded"
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`${
              modelName.charAt(0).toUpperCase() + modelName.slice(1)
            } ${field.name}...`}
          />
        )}

        {field.type === "Password" && (
          <input
            type="password"
            id={field.name}
            className="block w-full p-2 border border-gray-300 rounded"
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`${
              modelName.charAt(0).toUpperCase() + modelName.slice(1)
            } ${field.name}...`}
          />
        )}

        {field.type === "Url" && (
          <input
            type="url"
            id={field.name}
            className="block w-full p-2 border border-gray-300 rounded"
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`${
              modelName.charAt(0).toUpperCase() + modelName.slice(1)
            } ${field.name}...`}
          />
        )}

        {field.type === "Email" && (
          <input
            type="email"
            id={field.name}
            className="block w-full p-2 border border-gray-300 rounded"
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`${
              modelName.charAt(0).toUpperCase() + modelName.slice(1)
            } ${field.name}...`}
          />
        )}

        {field.type === "rr" && (
          <input
            type="text"
            id={field.name}
            className="block w-full p-2 border border-gray-300 rounded"
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`${
              modelName.charAt(0).toUpperCase() + modelName.slice(1)
            } ${field.name}...`}
          />
        )}

        {field.type === "Date" && (
          <input
            type="date"
            id={field.name}
            className="block w-full p-2 border border-gray-300 rounded"
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`${
              modelName.charAt(0).toUpperCase() + modelName.slice(1)
            } ${field.name}...`}
          />
        )}

        {field.type === "RichText" && (
          <ReactQuill
            className="w-full border-gray-300 border-2 rounded-lg bg-white"
            modules={modules}
            formats={formats}
            value={formData[field.name] || ""}
            onChange={(value) => handleFieldChange(field.name, value)}
            placeholder={`${
              modelName.charAt(0).toUpperCase() + modelName.slice(1)
            } ${field.name}...`}
          />
        )}
        {field.type === "MultiLineText" && (
          <textarea
            id={field.name}
            className="block w-full p-2 border border-gray-300 rounded"
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`${
              modelName.charAt(0).toUpperCase() + modelName.slice(1)
            } ${field.name}...`}
          />
        )}

        {field.type === "Checkbox" && (
          <input
            type="checkbox"
            id={field.name}
            className="mr-2 leading-tight"
            checked={formData[field.name] || false}
            onChange={(e) => handleFieldChange(field.name, e.target.checked)}
          />
        )}

        {field.type === "Select" && field.options && (
          <select
            id={field.name}
            className="block w-full p-2 border border-gray-300 rounded"
            value={formData[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          >
            <option value="">Select an option</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {field.type === "Media" && (
          <div>
            <input
              type="file"
              id={field.name}
              className="mt-2"
              accept="image/*"
              onChange={(e) => handleFieldChange(field.name, e)}
            />
            <MediaPreview mediaPreview={mediaPreview} />
          </div>
        )}
      </div>
    ))}
    <div className="flex justify-between">
      <div className="flex items-center">

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={IsAddingContentDraft}
          onClick={() => handleButtonClick("Draft")}
        >
          {IsAddingContentDraft ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            "Save"
          )}
        </button>
  
        <button
          className=" p-2 ml-2 bg-green-500 text-white  hover:bg-green-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={IsAddingContentPublish}
          onClick={() => handleButtonClick("Published")}
        >
          {IsAddingContentPublish ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin" />
              <span>Publishing...</span>
            </div>
          ) : (
            "Publish"
          )}
        </button>
        <button
          type="button"
          className="p-2 ml-2 bg-purple-500 text-white font-bold rounded hover:bg-purple-600"
          onClick={() => handleButtonClick("Scheduled")}
        >
          Schedule
        </button>
      </div>
      <button
        type="button"
        className="px-4 py-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-600"
        onClick={cancelForm}
      >
        Cancel
      </button>
    </div>
  </form>
);

export default ContentForm;
