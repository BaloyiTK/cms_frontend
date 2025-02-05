import React, { useState, useEffect } from "react";
import axios from "axios";
import { modules, formats } from "../utils/editorConfig";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes } from "react-icons/fa";
import { baseUrl } from "../utils/baseUrl";

const ContentEditForm = ({
  dynamicFields,
  handleFieldChange,
  modelName,
  selectedRecord,
  onCloseForm,
}) => {
  const [inputValues, setInputValues] = useState({});
  const [content, setContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStage, setCurrentStage] = useState(null);
  const [scheduledDateTime, setScheduledDateTime] = useState({});
  const url = window.location.href;
  const projectId = url.split("/").pop();

  // New state to store preview image URLs for each media field
  const [previewImageUrls, setPreviewImageUrls] = useState({});

  const fetchContent = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/content/${modelName}/${projectId}`,
        {
          params: {
            recordId: selectedRecord[0]._id,
          },
        }
      );
      setContent(response.data);
      setCurrentStage(response.data[0].stage);
      setScheduledDateTime(response.data[0].publishDateTime);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    if (!content || !dynamicFields) {
      return;
    }

    setInputValues((prevInputValues) => {
      return dynamicFields.reduce(
        (updatedInputValues, field) => {
          if (content[0].hasOwnProperty(field.name)) {
            const fieldName = field.name;
            const fieldValue = content[0][fieldName];
            updatedInputValues[fieldName] = fieldValue;
          }
          return updatedInputValues;
        },
        { ...prevInputValues }
      );
    });
  }, [content, dynamicFields]);

  const handleMediaChange = (fieldName, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImageUrls((prevUrls) => ({
        ...prevUrls,
        [fieldName]: reader.result, // Set the preview URL for the specific media field
      }));
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [fieldName]: reader.result, // Set the input value for the specific media field
      }));
    };

    if (file) {
      if (file.type.startsWith("image/")) {
        // If it's an image file, read it as a data URL
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        // If it's a video file, you can handle it differently, such as uploading it to the server.
        // For now, let's set it as a URL
        const videoUrl = URL.createObjectURL(file);
        setPreviewImageUrls((prevUrls) => ({
          ...prevUrls,
          [fieldName]: videoUrl,
        }));
        setInputValues((prevInputValues) => ({
          ...prevInputValues,
          [fieldName]: videoUrl,
        }));
      }
    } else {
      // If no file selected, reset the preview URL and input value for the specific media field
      setPreviewImageUrls((prevUrls) => ({
        ...prevUrls,
        [fieldName]: null,
      }));
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [fieldName]: null,
      }));
    }
  };

  const handleSubmit = async (e, stage) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await axios.patch(
        `${baseUrl}/content/${modelName}/${selectedRecord[0]._id}/update`,
        {
          stage,
          inputValues,
          dynamicFields,
        }
      );
      setIsSubmitting(false);
      handleCancel();
      onCloseForm();

      toast.success("Success");
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
      toast.error("error editing", {
        icon: <FaTimes className="text-red-500" />,
      });
    }
  };

  const handleCancel = () => {
    onCloseForm();
    setScheduledDateTime();
  };

  const handleInputChange = (fieldName) => (value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [fieldName]: value,
    }));
  };

  const publishSchedule = moment(scheduledDateTime).format("YYYY-MM-DDTHH:MM");

  return (
    //<div className="absolute top-[15%] bg-white p-5 w-[400px] rounded-lg shadow-lg">
    <div className="absolute top-[26%] md:top[25%] left-0 w-screen h-screen overflow-y:scroll  my-auto flex items-center justify-center z-50">
      <div className="bg-white p-3 shadow-2xl border border-gray-300 mx-3 md:w-1/2 md">
        <h3 className="text-center text-lg font-bold mb-4">Edit Content</h3>
        {currentStage && (
          <div className="mb-4 w-full flex justify-end p-1 bg-blue-50 rounded-md">
            {scheduledDateTime && (
              <input
                type="datetime-local"
                value={publishSchedule}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                className="text-md font-semibold bg-white border border-gray-300 rounded-md p-1 mr-1"
              />
            )}
            <select
              value={currentStage}
              onChange={(e) => setCurrentStage(e.target.value)}
              className={`text-md font-semibold ${
                currentStage === "Published"
                  ? "text-green-500"
                  : currentStage === "Scheduled"
                  ? "text-yellow-500"
                  : "text-red-500"
              } bg-white border border-gray-300 rounded-md p-1 mr-2`}
            >
              <option className="text-red-500" value="Draft">
                Draft
              </option>
              <option className="text-green-500" value="Published">
                Published
              </option>
              <option className="text-yellow-500" value="Scheduled">
                Scheduled
              </option>
            </select>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, currentStage)}>
          {dynamicFields &&
            dynamicFields.map((field) => (
              <div key={field.name} className="mb-4">
                <label
                  htmlFor={field.name}
                  className="block mb-2 text-sm font-medium"
                >
                  {field.name}
                </label>

                {field.type === "RichText" && (
                  <ReactQuill
                    className="w-full border border-gray-300 rounded-lg bg-white"
                    modules={modules}
                    formats={formats}
                    value={inputValues[field.name] || ""}
                    onChange={handleInputChange(field.name)}
                  />
                )}

                {(field.type === "SingleLineText" ||
                  field.type === "Number" ||
                  field.type === "Password" ||
                  field.type === "Url" ||
                  field.type === "Email" ||
                  field.type === "rr") && (
                  <input
                    type={field.type === "Email" ? "email" : "text"}
                    id={field.name}
                    className="block w-full p-2 border border-gray-300 rounded"
                    name={field.name}
                    value={inputValues[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name)(e.target.value)
                    }
                  />
                )}

                {field.type === "MultiLineText" && (
                  <textarea
                    id={field.name}
                    className="block w-full p-2 border border-gray-300 rounded"
                    name={field.name}
                    value={inputValues[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name)(e.target.value)
                    }
                  />
                )}

                {field.type === "Media" && (
                  <div>
                    <label htmlFor={field.name} className="block font-medium">
                      {field.label}
                    </label>
                    <input
                      type="file"
                      id={field.name}
                      className="block mt-2"
                      name={field.name}
                      accept="image/*, video/*" // Add accept attribute to allow image and video files
                      onChange={(e) =>
                        handleMediaChange(field.name, e.target.files[0])
                      }
                    />
                    {/* Show the preview image or video if available */}
                    {previewImageUrls[field.name] ? (
                      previewImageUrls[field.name].startsWith("data:image/") ? (
                        <img
                          src={previewImageUrls[field.name]}
                          alt="Selected media"
                          className="block mt-2 w-32 h-auto"
                        />
                      ) : previewImageUrls[field.name].startsWith("blob:") ? (
                        <video
                          src={previewImageUrls[field.name]}
                          controls
                          className="block mt-2 w-32 h-auto"
                        />
                      ) : (
                        <p>Unsupported media type</p>
                      )
                    ) : (
                      <img
                        src={inputValues[field.name]}
                        alt="Selected media"
                        className="block mt-2 w-32 h-auto"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}

          <div className="flex justify-between">
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2 hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
            <button
              type="button"
              className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentEditForm;
