import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";

const AddMemberForm = ({ onAddMember, onCancel }) => {
  const [newMember, setNewMember] = useState({ role: "", email: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = window.location.href;
  const projectId = url.split("/").pop();

  const validateForm = () => {
    const errors = {};

    if (!newMember.role) {
      errors.role = "Role is required";
    }

    if (!newMember.email) {
      errors.email = "Email is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleAddMember = async () => {
    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Send a POST request to your API
        console.log(newMember);
        const response = await axios.post(
          `${baseUrl}/addmember/${projectId}`,
          newMember
        );
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
      }
    }
  };

  return (
    <div className="mt-4 p-4 border rounded bg-white shadow-lg z-50">
      <h3 className="text-lg font-semibold mb-2">Add Member</h3>
      <div className="flex flex-col space-y-2">
        <span className="text-red-500">{formErrors.name}</span>

        <select
          value={newMember.role}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
          className="rounded border px-3 py-2"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
        <span className="text-red-500">{formErrors.role}</span>

        <input
          type="email"
          placeholder="email"
          value={newMember.email}
          onChange={(e) =>
            setNewMember({ ...newMember, email: e.target.value })
          }
          className="rounded border px-3 py-2"
        />
        <span className="text-red-500">{formErrors.email}</span>

        <button
          className={`bg-blue-500 text-white px-3 py-2 rounded ${
            isSubmitting ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={handleAddMember}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Inviting..." : "Invite Member"}
        </button>

        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddMemberForm;
