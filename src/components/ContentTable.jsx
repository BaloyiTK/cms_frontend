// ContentTable.js
import React from "react";
import moment from "moment";
import { FaEdit, FaTrashAlt, FaFileAlt } from "react-icons/fa";

const ContentTable = ({
  content,
  predefinedFields,
  fields,
  selectedRecord,
  isSelected,
  handleItemClick,
  toggleRecordSelection,
  handleEditClick,
  handleDeleteClick,
  handlePublishedUnpublishClick,
  handleBulkPublishUnpublishClick,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        {/* Table header */}
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
        {/* Table body */}
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
                      field.name === "stage" && item[field.name] === "Published"
                        ? "text-green-500 font-semibold"
                        : ""
                    } ${
                      field.name === "stage" && item[field.name] === "Scheduled"
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
  );
};

export default ContentTable;
