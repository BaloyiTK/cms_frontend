import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSpinner } from "react-icons/fa";

const ScheduleForm = ({ onClose, onPublish, IsAddingContentSchedule }) => {
  const [publishDateTime, setPublishDateTime] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform any necessary actions with the selected publishDateTime

    onPublish(publishDateTime);
    onClose();
  };

  const handleCancel = () => {
    onClose(); // Call the onClose function passed as a prop to close the form
  };

  const handleDateTimeChange = (date) => {
    setPublishDateTime(date);
    // onPublish(publishDateTime);
  };

  return (
    <div className="max-w-sm mx-auto absolute top-[25%] right-[20%] bg-white rounded-md shadow-lg p-5">
      <h2 className="text-2xl font-bold mb-4">Schedule Content Publishing</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date and Time:
          </label>
          <DatePicker
            selected={publishDateTime}
            onChange={handleDateTimeChange} // Call handleDateTimeChange on date selection change
            showTimeSelect
            dateFormat="Pp"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-between">
        
          
          <button
              className=" bg-green-500 text-white  hover:bg-green-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={IsAddingContentSchedule}
             // onClick={() => handleButtonClick("Published")}
            >
              {IsAddingContentSchedule ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin" />
                  <span>Schedule</span>
                </div>
              ) : (
                "Schedule"
              )}
            </button> 
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
