import React, { useState, useEffect } from "react";
import { getUser, updateUser } from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner, FaTimes, FaUser, FaEnvelope, FaLock, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";

const Account = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    profilePicture: null,
    profilePicturePreview: null,
  });
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const profilePictureKey = useSelector((state) => state.profilePicture.key);

  useEffect(() => {
    getUser()
      .then((response) => {
        setUserData({
          name: response.username,
          email: response.email,
        });
        setUserDataLoaded(true);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const { profilePicture } = userData;
    if (profilePicture) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({
          ...prevData,
          profilePicturePreview: reader.result,
        }));
      };
      reader.readAsDataURL(profilePicture);
    } else {
      setUserData((prevData) => ({
        ...prevData,
        profilePicturePreview: null,
      }));
    }
  }, [userData.profilePicture]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    setUserData((prevData) => ({
      ...prevData,
      profilePicture: file,
    }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await updateUser(userData);
      toast.success("Changes saved!");
      localStorage.removeItem("cachedUser");
    } catch (error) {
      toast.error(error.message, {
        icon: <FaTimes className="text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userDataLoaded) {
    return <Loader />;
  }

  return (
    <div className="max-w-lg mx-auto p-8 mt-2 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">User Details</h2>
      <form className="space-y-6">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaUser className="text-gray-400 ml-3" />
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="w-full py-2 px-4 text-gray-700 bg-white rounded-lg border-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          />
        </div>
        <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
          <FaEnvelope className="text-gray-400 ml-3" />
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            readOnly
            disabled
            className="w-full py-2 px-4 text-gray-400 bg-gray-50  rounded-lg cursor-not-allowed"
          />
        </div>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaLock className="text-gray-400 ml-3" />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="New password"
            value={userData.password}
            onChange={handleInputChange}
            className="w-full py-2 px-4 text-gray-700 bg-white rounded-lg border-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          />
        </div>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaLock className="text-gray-400 ml-3" />
          <input
            type="password"
            id="passwordConfirmation"
            name="passwordConfirmation"
            placeholder="Confirm password"
            value={userData.passwordConfirmation}
            onChange={handleInputChange}
            className="w-full py-2 px-4 text-gray-700 bg-white rounded-lg border-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          />
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="profilePicture" className="block text-sm font-semibold text-gray-700 mb-1">
            Profile Picture
          </label>
          <div className="relative w-32 h-32 border-2 border-gray-300 border-dashed rounded-full cursor-pointer overflow-hidden flex items-center justify-center bg-gray-100">
            {userData.profilePicturePreview ? (
              <img
                src={userData.profilePicturePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaCamera className="text-gray-400 w-16 h-16" />
            )}
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleSaveChanges}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" />
              <span>Saving...</span>
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};

export default Account;
