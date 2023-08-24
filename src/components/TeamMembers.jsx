import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making API requests
import AddMemberForm from "./AddMemberForm";
import { baseUrl } from "../utils/baseUrl";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  console.log(teamMembers);

  const url = window.location.href;
  const projectId = url.split("/").pop();

  const [editingIndex, setEditingIndex] = useState(null); // Add a new state to track the editing index
  const [editedRole, setEditedRole] = useState(""); // State to track the edited role

  const handleEdit = (index) => {
    setEditingIndex(index); // Set the editing index
    setEditedRole(teamMembers[index].role); // Set the edited role
  };

  const handleSave = (index) => {
    // Implement the logic to save the edited role
    // Update the teamMembers array with the edited role
    const updatedMembers = [...teamMembers];
    updatedMembers[index].role = editedRole;
    setTeamMembers(updatedMembers);

    // Clear the editing state
    setEditingIndex(null);
  };

  const fetchProject = async () => {
    axios
      .get(`${baseUrl}/project/${projectId}`)
      .then((response) => {
        // Assuming the API returns an array of members
        const members = response.data[0].users;
        // Fetch name and email for each member using the user property
        // getmember/:userId
        const memberPromises = members.map((member) => {
          return axios
            .get(`${baseUrl}/getmember/${member.user}`)
            .then((userResponse) => {
              // Add the name and email to the member object
              console.log(userResponse.data.user);
              member.name = userResponse.data.user.username;
              member.email = userResponse.data.user.email;
              return member;
            })
            .catch((error) => {
              console.error("Error fetching user details:", error);
              return member; // Return the original member object on error
            });
        });

        // Wait for all memberPromises to resolve
        Promise.all(memberPromises)
          .then((membersWithDetails) => {
            setTeamMembers(membersWithDetails);
          })
          .catch((error) => {
            console.error(
              "Error fetching user details for all members:",
              error
            );
          });
      })
      .catch((error) => {
        console.error("Error fetching project members:", error);
      });
  };

  useEffect(() => {
    // Fetch project member data from the API endpoint
    fetchProject();

  }, []);

  const addMember = (newMemberData) => {
    newMemberData.id = teamMembers.length + 1;
    setTeamMembers([...teamMembers, newMemberData]);
    setShowAddForm(false);
    fetchProject()
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleDelete = (index) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1); // Remove the member at the specified index
    setTeamMembers(updatedMembers); // Update the state to reflect the deleted member
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
      <div className="relative">
        <div className="flex justify-end">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add Member
          </button>
        </div>

        {showAddForm && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <AddMemberForm onAddMember={addMember} onCancel={handleCancel} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-collapse border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-200">User</th>
                <th className="px-4 py-2 bg-gray-200">Email</th>
                <th className="px-4 py-2 bg-gray-200">Role</th>
                <th className="px-4 py-2 bg-gray-200">Edit</th>
                <th className="px-4 py-2 bg-gray-200">Delete</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{member.name}</td>
                  <td className="px-4 py-2 border">{member.email}</td>
                  <td className="px-4 py-2 border">
                    {editingIndex === index ? ( // Render a dropdown when editing
                      <select
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                      </select>
                    ) : (
                      member.role // Display the role text when not editing
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {editingIndex === index ? ( // Render the "Save" button when editing
                      <button
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleSave(index)}
                      >
                        <FaSave />
                      </button>
                    ) : (
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(index)}
                      >
                        <FaEdit />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
