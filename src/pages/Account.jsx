import React, { useState, useEffect } from "react";
import { getUser, updateUser } from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner, FaTimes } from "react-icons/fa";
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
  const [userDataLoaded, setUserDataLoaded] = useState(false); // Track whether user data is loaded
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // useSelector to get the profilePictureKey from the Redux store
  const profilePictureKey = useSelector((state) => state.profilePicture.key);

  
  useEffect(() => {
    getUser()
      .then((response) => {
        setUserData((prevData) => ({
          ...prevData,
          name: response.username,
          email: response.email,
        }));
        setUserDataLoaded(true); // User data is loaded
      })
      .catch((error) => {
        console.error(error);
      });
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
    await updateUser(userData)
      .then((response) => {
         // Clear the cache 
        toast.success("Changes saved!");
        localStorage.removeItem(`cachedUser`);
        //
        setIsLoading(false)
       
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error, {
          icon: <FaTimes className="text-red-500" />,
        });
      });
  };

  // Render Loader if user data is not loaded yet
  if (!userDataLoaded) {
    return <Loader />;
  }

  // Render Account component if user data is loaded
  return (
    <div className="flex flex-col items-center mt-8 mb-8">
      <h2 className="text-2xl font-bold mb-4"> User Details</h2>
      <div className="flex flex-col mb-4 w-80">
        <label htmlFor="name" className="text-lg mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={userData.name}
          onChange={handleInputChange}
          className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col mb-4 w-80">
        <label htmlFor="email" className="text-lg mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col mb-4 w-80">
        <label htmlFor="password" className="text-lg mb-2">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="new password"
          value={userData.password}
          onChange={handleInputChange}
          className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col mb-4 w-80">
        <label htmlFor="passwordConfirmation" className="text-lg mb-2">
          Confirm Password:
        </label>
        <input
          type="password"
          id="passwordConfirmation"
          name="passwordConfirmation"
          placeholder="confirm password"
          value={userData.passwordConfirmation}
          onChange={handleInputChange}
          className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col mb-4 w-80">
        <label htmlFor="profilePicture" className="text-lg mb-2">
          Profile Picture:
        </label>
        <div className="flex items-center justify-center">
          <label
            htmlFor="profilePicture"
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-blue-500"
          >
            {userData.profilePicture ? (
              <img
                src={userData.profilePicturePreview}
                alt="Profile Picture Preview"
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-16 h-16 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            )}
          </label>
        </div>
        <input
          type="file"
          id="profilePicture"
          accept="image/*"
          onChange={handleProfilePictureChange}
          className="hidden"
        />
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={handleSaveChanges}
        disabled={isLoading}
      >
        {isLoading ? (
       <div className="flex items-center justify-center">
       <FaSpinner className="animate-spin" />
       <span>Saving...</span>   
     </div>
        ) : (
          "Save"
        )}
      </button>
    </div>
  );
};

export default Account;
