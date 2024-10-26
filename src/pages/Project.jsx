import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEllipsisH,
  FaTrashAlt,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProjectEditForm from "../components/ProjectEditForm";
import ProjectAddForm from "../components/ProjectAddForm";
import ProjectDeleteForm from "../components/ProjectDeleteForm";
import { baseUrl } from "../utils/baseUrl";
import { toast } from "react-toastify";
import { getUser } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { adminActions } from "../store";
import { AiOutlineWarning } from "react-icons/ai";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userId, setUserId] = useState(null);
  const isAdmin = useSelector((state) => state.admin.isAdmin);
  const [userRole, setUserRole] = useState("");
  const dispatch = useDispatch();
  const [memberId, setMemberId] = useState({});
  // const [projects, setProjects] = useState([]);
  // const [cachedProjects, setCachedProjects] = useState([]);
  const navigate = useNavigate();

  let desiredMember;

  useEffect(() => {
    if (selectedProject) {
      const members = selectedProject.users;

      desiredMember = members.find((member) => member.user === userId);
      setUserRole(desiredMember.role);
      setMemberId(desiredMember._id);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (userRole === "admin") {
      dispatch(adminActions.setAdminStatus(true));
    } else {
      dispatch(adminActions.setAdminStatus(false));
    }
  }, [userRole]);

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    let cachedProjects = [];
    try {
      if (userId) {
        cachedProjects =
          JSON.parse(localStorage.getItem(`cachedProjects_${userId}`)) || [];
      }

      if (cachedProjects.length > 0) {
        setProjects(cachedProjects);
        setProjectsLoading(false);
      } else {
        const response = await axios.get(`${baseUrl}/project`);
        setProjectsLoading(false);

        if (response.data.projects.length > 0) {
          setProjects(response.data.projects);

          // Update cached projects with the correct userId

          localStorage.setItem(
            `cachedProjects_${userId}`,
            JSON.stringify(response.data)
          );
        }
      }
    } catch (error) {
      console.error(error);
      setProjectsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const cachedUser = localStorage.getItem("cachedUser");
    try {
      const parsedUser = JSON.parse(cachedUser);
      if (parsedUser) {
        setUserId(parsedUser._id);
      }
    } catch (error) {
      console.error("Error parsing cachedUser:", error);
    }
  }, []);

  useEffect(() => {
    setProjectsLoading(true);

    // Get the user and set the userId
    getUser()
      .then((response) => {
        setUserId(response._id);

        // Fetch projects using the correct userId
        fetchProjects();
      })
      .catch((error) => {
        console.error(error);
      });
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    //   setProjectsLoadingState(projectsLoading);
  }, [projectsLoading]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleButtonClick = useCallback(() => {
    setShowEditForm(false);
    setShowAddForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowEditForm(false);
    setShowAddForm(false);
    setShowDeleteForm(false);
    setSelectedProject(null);
  }, []);

  const handleDeleteProject = useCallback(async () => {
    setIsDeleting(true);
    try {
      setShowDeleteForm(true);

      await axios.delete(`${baseUrl}/project/${selectedProject._id}`);

      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== selectedProject._id)
      );

      setIsDeleting(false);
      setShowDeleteForm(false);
      setSelectedProject(null);
      toast.success("Project deleted!");

      localStorage.removeItem(`cachedProjects_${userId}`); // Clear the cache
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
      toast.error(error, {
        icon: <FaTimes className="text-red-500" />,
      });
    }
  }, [selectedProject, userId]);

  const handleOptionsClick = useCallback((event, project) => {
    event.stopPropagation();
    setSelectedProject(project);
  }, []);

  const handleEditClick = useCallback(() => {
    setShowEditForm(true);
    setShowAddForm(false);
  }, []);

  const handleProjectAdded = useCallback(() => {
    setShowAddForm(false); // Close the add form
    localStorage.removeItem(`cachedProjects_${userId}`); // Clear the cache
    fetchProjects(); // Fetch the updated list of projects
  }, [fetchProjects, userId]);

  const handleProjectEdited = useCallback(() => {
    setShowEditForm(false); // Close the edit form
    localStorage.removeItem(`cachedProjects_${userId}`); // Clear the cache
    fetchProjects(); // Fetch the updated list of projects
  }, [fetchProjects, userId]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteForm(true);
  }, []);

  const handleCancelClick = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handleProjectClick = useCallback(
    (project) => {
      if (!selectedProject) {
        const projectId = project._id;
        navigate(`/project/${projectId}`);
      }
    },
    [selectedProject, navigate]
  );

  const handleLeaveProjectClick = async () => {
    try {
      // Make an API request to delete the member
      await axios.delete(
        `${baseUrl}/deletemember/${selectedProject._id}/${memberId}`
      );

      // Remove the member from the teamMembers stat
      fetchProjects();
      setSelectedProject(null);
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Projects ({projects.length})</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => handleProjectClick(project)}
            className="bg-white rounded shadow p-4 relative cursor-pointer hover:bg-gray-100"
          >
            <div className="absolute top-0 right-0 m-2">
              <div className="relative inline-block text-left">
                <div>
                  <button
                    onClick={(e) => handleOptionsClick(e, project)}
                    type="button"
                    className="flex items-center justify-center text-blue-400 hover:text-gray-600 focus:outline-none"
                  >
                    <FaEllipsisH />
                  </button>
                </div>
                {selectedProject === project && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    {isAdmin ? (
                      // If the user is an admin, render Edit and Delete buttons
                      <>
                        <div
                          className="pt-14"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <button
                            onClick={handleEditClick}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-500"
                            role="menuitem"
                          >
                            <span className="flex items-baseline py-2">
                              <FaEdit className="mr-1" />
                              Edit
                            </span>
                          </button>
                          <button
                            onClick={handleDeleteClick}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500"
                            role="menuitem"
                          >
                            <span className="flex items-baseline py-2">
                              {" "}
                              <FaTrashAlt className="mr-1" />
                              Delete
                            </span>
                          </button>
                        </div>
                        <div className="absolute top-0 right-0 p-3 ">
                          <button
                            onClick={handleCancelClick}
                            className="text-gray-400 hover:text-red-600 focus:outline-none hover:bg-gray-100"
                          >
                            <FaTimes className="text-lg" />
                          </button>
                        </div>
                      </>
                    ) : (
                      // If the user is not an admin, render the Leave Project button
                      <>
                        <div className="bg-white shadow-lg rounded-lg pt-14 space-y-2">
                          <button
                            onClick={handleLeaveProjectClick} // You should define this handler function
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500 transition duration-300 ease-in-out"
                            role="menuitem"
                          >
                            <span className="flex items-center">
                              Leave Project{" "}
                            </span>
                          </button>
                          <span className="flex items-baseline p-1">
                            {" "}
                            <AiOutlineWarning className="text-red-500" />
                            <p className="text-sm text-gray-600 px-4 py-2">
                              This is a permanent action
                            </p>
                          </span>

                          <div className="absolute top-2 right-3">
                            <button
                              onClick={handleCancelClick}
                              className="text-gray-400 hover:text-red-600 focus:outline-none hover:bg-gray-100"
                            >
                              <FaTimes className="text-lg" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-gray-500 mt-2">{project.description}</p>
          </div>
        ))}
        <div className="bg-white rounded shadow p-4 flex flex-col items-center justify-center">
          <button
            onClick={handleButtonClick}
            className="flex justify-center items-center text-blue-400 bg-gray-300 hover:bg-gray-400 hover:text-white font-bold py-2 px-4 rounded"
          >
            <span></span>
            <FaPlus className="mr-1" /> <span>Add Project</span>
          </button>

          {showEditForm && (
            <div className="absolute bg-blue-100 top-0 bottom-0 right-[25%] z-50 w-1/2 h-fit">
              <ProjectEditForm
                project={selectedProject}
                onClose={handleCloseForm}
                onProjectEdited={handleProjectEdited}
              />
            </div>
          )}
          {showAddForm && (
            <div className="absolute bg-blue-100 top-0 bottom-0 right-[25%] z-50 w-1/2 h-fit">
              <ProjectAddForm
                onClose={handleCloseForm}
                onProjectAdded={handleProjectAdded}
              />
            </div>
          )}

          {showDeleteForm && (
            <div className="absolute bg-blue-100 top-0 bottom-0 right-[25%] z-50 w-1/2 h-fit">
              {(selectedProject || isDeleting) && (
                <ProjectDeleteForm
                  project={selectedProject}
                  onClose={handleCloseForm}
                  onDelete={handleDeleteProject}
                  isDeleting={isDeleting}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Project;
