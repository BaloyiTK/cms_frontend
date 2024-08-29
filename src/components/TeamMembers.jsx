import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making API requests
import AddMemberForm from "./AddMemberForm";
import { baseUrl } from "../utils/baseUrl";
import { FaEdit, FaSave, FaTrash, FaUserPlus } from "react-icons/fa";
import { getUser } from "../utils/api";
import { useSelector } from "react-redux";

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [user, setUser] = useState(() => {
    // Try to load user data from cache
    const cachedUser = localStorage.getItem("cachedUser");
    return cachedUser ? JSON.parse(cachedUser) : null;
  });

  const isAdmin = useSelector((state) => state.admin.isAdmin);

  const url = window.location.href;
  const projectId = url.split("/").pop();
  let userId = user._id;

  useEffect(() => {
    if (!user) {
      // If user data is not in cache, fetch it
      getUser()
        .then((response) => {
          setUser(response);
          // Cache the fetched user data
          localStorage.setItem("cachedUser", JSON.stringify(response));
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setUser(user);
    }
  }, [user]);

  const [editingIndex, setEditingIndex] = useState(null); // Add a new state to track the editing index
  const [editedRole, setEditedRole] = useState(""); // State to track the edited role

  const handleEdit = async (index) => {
    setEditingIndex(index); // Set the editing index
    setEditedRole(teamMembers[index].role); // Set the edited role
  };

  const handleSave = async (index) => {
    // Implement the logic to save the edited role
    // Update the teamMembers array with the edited role

    const memberIdToUpdate = teamMembers[index]._id;

    const res = await axios.patch(
      `${baseUrl}/updatemember/${projectId}/${memberIdToUpdate}`,
      {
        role: editedRole, // The new role you want to set
      }
    );

    const updatedMembers = [...teamMembers];
    updatedMembers[index].role = editedRole;
    setTeamMembers(updatedMembers);
    localStorage.removeItem(`cachedProject_${projectId}`); // Clear the cache

    // Clear the editing state
    setEditingIndex(null);
  };

  const fetchProject = async () => {
    await axios
      .get(`${baseUrl}/project/${projectId}`)
      .then((response) => {
        // Assuming the API returns an array of members
        const members = response.data[0].users;

        // Fetch name and email for each member using the user property
        // getmember/:userId
        const memberPromises = members.map(async (member) => {
          try {
            const userResponse = await axios.get(
              `${baseUrl}/getmember/${member.user}`
            );
            // Add the name and email to the member object

            member.name = userResponse.data.user.username;
            member.email = userResponse.data.user.email;
            return member;
          } catch (error) {
            console.error("Error fetching user details:", error);
            return member;
          }
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
    fetchProject();
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleDelete = async (index) => {
    try {
      const memberIdToDelete = teamMembers[index]._id;

      // Make an API request to delete the member
      const res = await axios.delete(
        `${baseUrl}/deletemember/${projectId}/${memberIdToDelete}`
      );

      const updatedMembers = [...teamMembers];
      updatedMembers.splice(index, 1);
      setTeamMembers(updatedMembers);
      localStorage.removeItem(`cachedProject_${projectId}`); // Clear the cache
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
      <div className="relative">
        {isAdmin ? (
          <div className="flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform "
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <span className="flex items-center">
                <FaUserPlus className="mr-2 text-lg" />
                Add Member
              </span>
            </button>
          </div>
        ) : null}

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
                {isAdmin ? (
                  <>
                    <th className="px-4 py-2 bg-gray-200">Edit</th>
                    <th className="px-4 py-2 bg-gray-200">Delete</th>
                  </>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{member.name}</td>
                  <td className="px-4 py-2 border">{member.email}</td>
                  <td className="px-4 py-2 border">
                    <div className="w-24 md:w-20">
                      {" "}
                      {editingIndex === index ? ( // Render a dropdown when editing
                        <select
                          value={editedRole}
                          onChange={(e) => setEditedRole(e.target.value)}
                        >
                          <option value="admin">admin</option>
                          <option value="editor">editor</option>
                        </select>
                      ) : (
                        member.role // Display the role text when not editing
                      )}
                    </div>
                  </td>
                  {isAdmin ? ( // Conditionally render the entire row for admin
                    <>
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
                    </>
                  ) : null}
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
