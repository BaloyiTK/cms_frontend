import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { toast } from "react-toastify";

const AddMemberForm = ({ onAddMember, onCancel }) => {
  const [newMember, setNewMember] = useState({ role: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = window.location.href;
  const projectId = url.split("/").pop();

  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
  
      const response = await axios.post(
        `${baseUrl}/addmember/${projectId}`,
        newMember
      );

      toast.success("Member added successfully!")

      // Check the response status code to ensure the request was successful
      if (response.status === 200) {
        // Assuming the API returns the newly created member data, you can update your state
        onAddMember(response);

        // Clear the form inputs
        setNewMember({ role: "", email: "" });

        // Reset the submitting state
        setIsSubmitting(false);
      } else {
        // Handle the case where the API request failed
        console.error("API request failed");
        setIsSubmitting(false);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      setIsSubmitting(false);
      console.error("Error:", error);
      toast.error(error.response.data.error)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded w-full bg-white shadow-lg z-50">
      <h3 className="text-lg font-semibold mb-2">Add Member</h3>
      <div className="flex flex-col space-y-2">
        <select
          value={newMember.role}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
          className="rounded border px-3 py-2"
          required
        >
          <option value="">Select Role</option>
          <option value="admin">admin</option>
          <option value="editor">editor</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={newMember.email}
          required
          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
          className="rounded border px-3 py-2"
        />

        <button
          type="submit"
          className={`bg-blue-500 text-white px-3 py-2 rounded ${
            isSubmitting ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Member"}
        </button>

        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddMemberForm;
