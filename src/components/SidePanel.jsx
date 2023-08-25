import React, { useState, useEffect } from "react";
import {
  FaDatabase,
  FaFileAlt,
  FaCog,
  FaEnvelope,
  FaSpinner,
  FaBook,
} from "react-icons/fa";
import { AiOutlineProject } from "react-icons/ai";
import { useNavigate } from "react-router";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { useSelector, useDispatch } from "react-redux";
import { adminActions } from "../store";
import { getUser } from "../utils/api";

const SidePanel = ({ selectedItem, onItemClicked }) => {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = window.location.href;
  const projectId = url.split("/").pop();
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.admin.isAdmin);
  const [user, setUser] = useState(() => {
    // Try to load user data from cache
    const cachedUser = localStorage.getItem("cachedUser");
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [userRole, setUserRole] = useState("");

  const [members, setMembers] = useState("");
  let desiredMember;

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

  useEffect(() => {
    if (userRole === "admin") {
      dispatch(adminActions.setAdminStatus(true));
    } else {
      dispatch(adminActions.setAdminStatus(false));
    }
  }, [userRole]);

  useEffect(() => {
    const cachedProject = localStorage.getItem(`cachedProject_${projectId}`);

    if (cachedProject) {
      setProject(JSON.parse(cachedProject));
      setLoading(false);

      setUserRole(JSON.parse(cachedProject)[0].users);

      const members = JSON.parse(cachedProject)[0].users;
      desiredMember = members.find((member) => member.user === userId);

      if (desiredMember) {
        setUserRole(desiredMember.role);
      }
    } else {
      fetchProject();

      dispatch(adminActions.setAdminStatus(false));
    }
  }, []);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${baseUrl}/project/${projectId}`);
      setProject(response.data);

      const members = response.data[0].users;
      desiredMember = members.find((member) => member.user === userId);
      if (desiredMember) {
        setUserRole(desiredMember.role);
      }

      setLoading(false);
      localStorage.setItem(
        `cachedProject_${projectId}`,
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const tabItems = [
    {
      id: "Schema",
      label: "Model",
      icon: <FaDatabase className="text-xl" />,
      color: "#FF5733", // Customize the icon color for Schema
    },
    {
      id: "Content",
      label: "Content",
      icon: <FaFileAlt className="text-xl" />,
      color: "#42A5F5", // Customize the icon color for Content
    },
    {
      id: "Settings",
      label: "Settings",
      icon: <FaCog className="text-xl" />,
      color: "#66BB6A", // Customize the icon color for Settings
    },
    {
      id: "Documentation",
      label: "Docs",
      icon: <FaBook className="text-xl" />,
      color: "#9C27B0", // Customize the icon color for Docs
    },
    {
      id: "Support",
      label: "Support",
      icon: <FaEnvelope className="text-xl" />,
      color: "#FF9800", // Customize the icon color for Support
    },
  ];

  return (
    <div className="max-h-screen">
      <h3 className="md:p-2 flex items-center font-bold text-xl mb-1 md:mb-0">
        {loading ? (
          <FaSpinner className="animate-spin mr-2 text-xl bg-blue-500 rounded-sm" />
        ) : (
          project && (
            <AiOutlineProject className="mr-2 text-xl bg-blue-500 rounded-sm" />
          )
        )}
        {loading ? "Loading..." : project && project[0].name}
      </h3>
      <ul className="hidden text-base md:block md:p-4">
        {isAdmin && (
          <li
            className={`flex items-center cursor-pointer p-1 mb-1 hover:bg-blue-50  ${
              selectedItem === "Schema" ? "bg-blue-100 text-blue-400" : ""
            }`}
            onClick={() => onItemClicked("Schema")}
          >
            <span className="block text-yellow-500">
              <FaDatabase className="mr-2" />
            </span>
            Model
          </li>
        )}

        <li
          className={`flex items-center cursor-pointer p-1 mb-1 hover:bg-blue-50   ${
            selectedItem === "Content" ? "bg-blue-100  text-blue-400" : ""
          }`}
          onClick={() => onItemClicked("Content")}
        >
          <span className="text-green-500">
            <FaFileAlt className="mr-2" />
          </span>
          Content
        </li>
        <li
          className={`flex items-center cursor-pointer p-1 mb-1  hover:bg-blue-50  ${
            selectedItem === "Settings" ? "bg-blue-100 text-blue-400" : ""
          }`}
          onClick={() => onItemClicked("Settings")}
        >
          <span className="text-indigo-500">
            <FaCog className="mr-2" />
          </span>
          Settings
        </li>
        <li
          className={`flex items-center cursor-pointer p-1 mb-1 hover:bg-blue-50   ${
            selectedItem === "Support" ? "bg-blue-100 text-blue-400" : ""
          }`}
          onClick={() => onItemClicked("Support")}
        >
          <span className="text-orange-500">
            <FaEnvelope className="mr-2" />
          </span>
          Support
        </li>
      </ul>

      <ul className="flex md:hidden p-0 bg-gray-100 border-t border-gray-300">
  {tabItems
    .filter((item) => {
      // Exclude the "Model" tab if the user is not an admin
      return item.id !== "Schema" || isAdmin;
    })
    .map((item) => (
      <li
        key={item.id}
        className={`flex-1 text-center cursor-pointer py-1 font-semibold ${
          selectedItem === item.id
            ? "bg-blue-400 text-white"
            : "text-gray-600"
        }`}
        onClick={() => onItemClicked(item.id)}
      >
        <div className="flex flex-col items-center">
          {React.cloneElement(item.icon, {
            className: "text-xl",
            style: {
              color: selectedItem === item.id ? "#ffffff" : item.color,
            },
          })}
          <span className="text-xs mt-1">{item.label}</span>
        </div>
      </li>
    ))}
</ul>

    </div>
  );
};

export default SidePanel;
