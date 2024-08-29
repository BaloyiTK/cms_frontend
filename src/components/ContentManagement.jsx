import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import moment from "moment";
import {
  FaCheck,
  FaEdit,
  FaSpinner,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import ContentForm from "./ContentForm";
import ScheduleForm from "./ScheduleForm";
import ContentEditForm from "./ContentEditForm";
import { FaDatabase, FaFileAlt, FaCog, FaEnvelope } from "react-icons/fa";
import { predefinedFields } from "./PredefinedFields";
import { baseUrl } from "../utils/baseUrl";

const ContentManagement = ({ selectedModel }) => {
  const [fields, setFields] = useState([]);
  const [modelName, setModelName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [mediaPreview, setMediaPreview] = useState(null);
  const [content, setContent] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState([]);
  const [error, setError] = useState();
  const [showEditForm, setShowEditForm] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [IsAddingContentDraft, setIsAddingContentDraft] = useState(false);
  const [IsAddingContentPublish, setIsAddingContentPublish] = useState(false);
  const [IsAddingContentSchedule, setIsAddingContentSchedule] = useState(false);
  const [IsPublishing, setIsPublishing] = useState(false);
  const [IsUnPublishing, setIsUnPublishing] = useState(false);
  const [IsDeleting, setIsDeleting] = useState(false);

  const url = window.location.href;
  const projectId = url.split("/").pop();

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedRecord([]);
    fetchContent();
  };

  const fetchContent = async () => {
   // setIsFetchingContent(true);
    try {
      const response = await axios.get(
        `${baseUrl}/content/${modelName}/${projectId}`
      );
      setContent(response.data);
     // setIsFetchingContent(false);

      // Cache the content in local storage
      localStorage.setItem(
        `cachedContent_${modelName}_${projectId}`,
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
 
      fetchContent();

  }, [modelName]);


  useEffect(() => {
    if (selectedModel) {
      setFields(selectedModel.fields);
      setModelName(selectedModel.modelName);
    }
  }, [selectedModel]);

  const dynamicFields = fields;

  const addEntry = () => {
    setShowForm(true);
    setSelectedItem("");
  };

  useEffect(() => {
    setDropdown(false);
  }, [selectedRecord]);

  const handleFieldChange = (fieldName, value) => {
    const field = dynamicFields.find((field) => field.name === fieldName);

    if (field && field.type === "Media") {
      const file = value.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);

      new Promise((resolve) => {
        reader.onloadend = resolve;
      }).then(() => {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: reader.result,
        }));
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: value,
      }));
    }
  };


  const cancelForm = () => {
    setShowForm(false);
    setFormData({});
    setMediaPreview(null);
    setError("");
  };

  const handleButtonClick = async (stage) => {
    if (stage === "Published") {
      setIsAddingContentPublish(true);

   
    }
    if (stage === "Draft") {
      setIsAddingContentDraft(true);
      setIsPublishing(true);
    }

    try {
      if (stage === "Scheduled") {
        setShowScheduleForm(true);
      } else {
        await axios.post(`${baseUrl}/content/${modelName}/${projectId}`, {
          formData,
          fields,
          modelName,
          stage: stage,
        });

        setIsAddingContentPublish(false);
        setIsAddingContentDraft(false);
        setIsPublishing(false);
        setIsUnPublishing(false);

        // Reset formData only if the stage is not equal to "Scheduled"
      }

      // Fetch content, clear error, and handle success
      fetchContent();
      setError("");
      setShowForm(false);
      setMediaPreview(null);

      if (stage !== "Scheduled") {
        setFormData({});
      } else {
        setIsAddingContentSchedule(false);
      }
    } catch (error) {
      setShowForm(true);

      setError(error.response.data.message);
    }
  };

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleClose = () => {
    setShowScheduleForm(false);
    setFormData({});
  };

  const handlePublishedUnpublishClick = async (stage, contentId) => {
    if (stage === "Published") {
      setIsUnPublishing(true);
      try {
        await axios.patch(`${baseUrl}/content/${modelName}/${contentId}`, {
          stage: "Draft",
        });

        fetchContent();
        setSelectedRecord([]);
        setIsUnPublishing(false);
      } catch (error) {
        console.error(error);
      }
    }

    if (stage === "Draft") {
      setIsPublishing(true);
      try {
        await axios.patch(`${baseUrl}/content/${modelName}/${contentId}`, {
          stage: "Published",
        });

        fetchContent();
        setSelectedRecord([]);
        setDropdown(false);
        setIsPublishing(false);
      } catch (error) {
        console.error(error);
      }
    }

    if (stage === "Scheduled") {
      try {
        await axios.patch(`${baseUrl}/content/${modelName}/${contentId}`, {
          stage: "Published",
        });

        fetchContent();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAutoPublish = async (publishDateTime) => {
    await axios.post(`${baseUrl}/content/${modelName}/${projectId}`, {
      formData,
      publishDateTime,
      fields,
      modelName,
      stage: "Scheduled",
    });

    fetchContent();
  };

  const handleThreeDotsClick = () => {
    setDropdown(!dropdown);
  };

  const handleBulkPublishUnpublishClick = async (stage) => {
    if (stage == "Published") {
      setIsPublishing(true);
    } else {
      setIsUnPublishing(true);
    }
    try {
      const res = await axios.patch(`${baseUrl}/content/${modelName}`, {
        stage: stage,
        selectedRecords: selectedRecord,
      });
      fetchContent();
      if (!IsUnPublishing && !IsPublishing) {
        setDropdown(false);
      }

      setIsUnPublishing(false);
      setIsPublishing(false);
      setSelectedRecord([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedRecord || selectedRecord.length === 0) {
      return;
    }
    setIsDeleting(true);

    var selectedRecordIds = [];

    if (selectedRecord && selectedRecord.length >= 1) {
      // Assuming `selectedRecord` is an array of objects with an `id` property
      for (var i = 0; i < selectedRecord.length; i++) {
        selectedRecordIds.push(selectedRecord[i]._id);
      }
    }

    try {
      await axios.delete(`${baseUrl}/content/${modelName}`, {
        data: { ids: selectedRecordIds }, // Include the array of IDs in the request body
      });
      localStorage.removeItem(`cachedContent_${modelName}_${projectId}`);

      setContent((prevContent) =>
        prevContent.filter(
          (content) => !selectedRecordIds.includes(content._id)
        )
      );
      setIsDeleting(false);

      setSelectedRecord([]);
      setSelectedItem(null);
      setDropdown(false);
    } catch (error) {
      console.error(error);
    }
  };

  const showEditDeleteIcons =
    selectedItem && content.some((item) => item === selectedItem);

  const toggleRecordSelection = (item) => {
    if (selectedRecord.includes(item)) {
      setSelectedRecord(selectedRecord.filter((record) => record !== item));
    } else {
      setSelectedRecord([...selectedRecord, item]);
    }
  };

  const isSelected = (item) => {
    return selectedRecord.includes(item);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
        <h2 className="mb-3 sm:mb-0">{modelName}</h2>

        <div className="h-5">
          {!showForm && (
            <div className="flex items-center">
              {selectedRecord && selectedRecord.length === 1 && (
                <div className="flex mr-2">
                  <FaEdit
                    className="ml-2 cursor-pointer text-gray-400 hover:text-gray-500"
                    onClick={handleEditClick}
                  />
                  {IsDeleting ? (
                    <FaSpinner className="animate-spin ml-2" />
                  ) : (
                    <FaTrashAlt
                      className="ml-2 cursor-pointer text-gray-400 hover:text-gray-500"
                      onClick={handleDeleteClick}
                    />
                  )}
                </div>
              )}

              {selectedRecord && selectedRecord.length === 1 && (
                <button
                  className={`p-1 mr-2 text-sm ${
                    selectedRecord[0].stage === "Published"
                      ? "bg-red-500"
                      : "bg-green-500"
                  } text-white rounded hover:bg-blue-600`}
                  onClick={() =>
                    handlePublishedUnpublishClick(
                      selectedRecord[0].stage,
                      selectedRecord[0]._id
                    )
                  }
                  disabled={IsPublishing || IsUnPublishing}
                >
                  {selectedRecord[0].stage === "Published" ? (
                    IsUnPublishing ? (
                      <span className="flex items-center">
                        <FaSpinner className="animate-spin mr-1" /> Unpublishing
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FaTimes className="mr-1" /> Unpublish
                      </span>
                    )
                  ) : IsPublishing ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin mr-1" /> Publishing
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaCheck className="mr-1" /> Publish
                    </span>
                  )}
                </button>
              )}

              {selectedRecord && selectedRecord.length > 1 ? (
                <div className="p-1 flex mr-2 justify-center items-center">
                  {IsDeleting ? (
                    <FaSpinner className="animate-spin mr-1" />
                  ) : (
                    <FaTrashAlt
                      className="ml-2 cursor-pointer text-gray-400 hover:text-gray-500"
                      onClick={handleDeleteClick}
                    />
                  )}
                  <div className="flex mr-2"></div>

                  <div className="flex relative text-left">
                    <button
                      type="button"
                      className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                      id="options-menu"
                      aria-haspopup="true"
                      aria-expanded="true"
                      onClick={handleThreeDotsClick}
                    >
                      <svg
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.5 11C3.32843 11 4 10.3284 4 9.5C4 8.67157 3.32843 8 2.5 8C1.67157 8 1 8.67157 1 9.5C1 10.3284 1.67157 11 2.5 11ZM9.5 11C10.3284 11 11 10.3284 11 9.5C11 8.67157 10.3284 8 9.5 8C8.67157 8 8 8.67157 8 9.5C8 10.3284 8.67157 11 9.5 11ZM17 9.5C17 10.3284 16.3284 11 15.5 11C14.6716 11 14 10.3284 14 9.5C14 8.67157 14.6716 8 15.5 8C16.3284 8 17 8.67157 17 9.5Z"
                        />
                      </svg>
                    </button>
                    {dropdown && (
                      <div className="absolute right-0 top-5 mt-2 w-48 bg-white  shadow-2xl border">
                        {IsPublishing ? (
                          <span className="flex items-center">
                            <FaSpinner className="animate-spin ml-1" />
                            <button className="flex font-semibold border-b px-4 py-2 text-sm text-green-500 hover:bg-gray-100">
                              Publishing
                            </button>
                          </span>
                        ) : (
                          <button
                            className="flex w-full font-semibold border-b px-4 py-2 text-sm text-green-500 hover:bg-gray-100"
                            onClick={() =>
                              handleBulkPublishUnpublishClick("Published", null)
                            }
                          >
                            Publish Selected
                          </button>
                        )}

                        {IsUnPublishing ? (
                          <span className="flex items-center">
                            <FaSpinner className="animate-spin ml-1" />
                            <button className="flex font-semibold border-b px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
                              Unpublishing
                            </button>
                          </span>
                        ) : (
                          <button
                            className="flex w-full font-semibold border-b px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                            onClick={() =>
                              handleBulkPublishUnpublishClick("Draft", null)
                            }
                          >
                            Unpublish Selelected
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  className="p-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={addEntry}
                >
                  Add Entry
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {showForm ? (
        <ContentForm
          dynamicFields={dynamicFields}
          formData={formData}
          handleFieldChange={handleFieldChange}
          cancelForm={cancelForm}
          mediaPreview={mediaPreview}
          setStartDate={setStartDate}
          startDate={startDate}
          handleButtonClick={handleButtonClick}
          modelName={modelName}
          error={error}
          IsAddingContentDraft={IsAddingContentDraft}
          IsAddingContentPublish={IsAddingContentPublish}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-xs text-gray-800">
                  <input
                    type="checkbox"
                    checked={selectedRecord.length === content.length}
                    onChange={() =>
                      setSelectedRecord(
                        selectedRecord.length === content.length
                          ? []
                          : [...content]
                      )
                    }
                  />
                </th>
                {predefinedFields.map((field, index) => (
                  <th key={index} className="px-4 py-2 text-xs text-gray-800">
                    <span></span> {field.heading}
                  </th>
                ))}
                {fields.map((field, index) => (
                  <th key={index} className="px-4 py-2 text-xs text-gray-800">
                    {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.length === 0 ? (
                <tr>
                  <td
                    colSpan={predefinedFields.length + fields.length + 1}
                    className="px-4 py-2 text-xs text-gray-800 text-center"
                  >
                    No data
                  </td>
                </tr>
              ) : (
                content.map((item, index) => (
                  <tr
                    key={index}
                    className={isSelected(item) ? "bg-blue-50" : ""}
                    onClick={() => handleItemClick(item)}
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={isSelected(item)}
                        onChange={() => toggleRecordSelection(item)}
                      />
                    </td>
                    {predefinedFields.map((field, index) => (
                      <td
                        key={index}
                        style={{ maxWidth: "150px" }}
                        className={`px-4 py-2 text-xs text-gray-800 border-b border-gray-300 truncate ${
                          field.name === "stage" && item[field.name] === "Draft"
                            ? "text-red-500 font-semibold"
                            : ""
                        } ${
                          field.name === "stage" &&
                          item[field.name] === "Published"
                            ? "text-green-500 font-semibold"
                            : ""
                        } ${
                          field.name === "stage" &&
                          item[field.name] === "Scheduled"
                            ? "text-yellow-500 font-semibold"
                            : ""
                        }`}
                      >
                        {field.name === "createdAt" ||
                        field.name === "updatedAt" ? (
                          <span className="">
                            {moment(item[field.name]).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </span>
                        ) : (
                          <span className="flex">{item[field.name]}</span>
                        )}
                      </td>
                    ))}

                    {fields.map((field, index) => (
                      <td
                        key={index}
                        className="px-4 py-2 text-xs text-gray-800 border-b border-gray-300 truncate"
                        style={{ maxWidth: "50px" }}
                      >
                        {field.type === "Media" ? (
                          <img
                            src={item[field.name]}
                            alt={field.name}
                            className="w-10 h-10"
                          />
                        ) : (
                          <span className="flex overflow-hidden">
                            {field.type === "RichText" ? (
                              <div>
                                <FaFileAlt className="text-gray-400" />{" "}
                                {/* Replace "content-icon" with the appropriate class for the content icon */}
                              </div>
                            ) : (
                              item[field.name]
                            )}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showScheduleForm && (
        <ScheduleForm
          onClose={handleClose}
          onPublish={handleAutoPublish}
          IsAddingContentSchedule={IsAddingContentSchedule}
        />
      )}
      {showEditForm && (
        <ContentEditForm
          selectedRecord={selectedRecord}
          dynamicFields={dynamicFields}
          modelName={modelName}
          onCloseForm={handleCloseEditForm}
        />
      )}
    </div>
  );
};

export default ContentManagement;
