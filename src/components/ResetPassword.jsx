import React, { useState } from "react";
import { baseUrl } from "../utils/baseUrl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaLock, FaTimes, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import Icon from "../images/Icon.png";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const myKeyValues = window.location.search;
    const urlParams = new URLSearchParams(myKeyValues);
    const token = urlParams.get("token");

    if (!token) {
      // Handle the case where token is missing
      return;
    }

    if (newPassword !== confirmPassword) {
      // Handle password mismatch
      return;
    }

    const inputData = {
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };

    try {
      const response = await axios.post(
        `${baseUrl}/reset-password?token=${token}`,
        inputData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Success! password updated.");
        navigate("/login");
      } else {
        // Handle other response statuses or errors
      }
    } catch (error) {
      // Handle error

      toast.error(error, {
        icon: <FaTimes className="text-red-500" />,
      });
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 ">
      <div className="bg-white p-8 rounded w-full sm:w-96 mx-3 shadow-lg border border-gray-300">
        <div className="text-center mb-5">
          <img src={Icon} alt="" className="mx-auto" />
          <h1 className="font-bold text-2xl mt-1">Reset Password</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              New Password:
            </label>
            <div className="relative flex items-center">
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 pl-8"
                type={showNewPassword ? "text" : "password"}
                name="password"
                id="new-password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
                placeholder="new password"
              />
              <FaLock className="text-gray-500 absolute left-2 " />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {/* Confirm New Password */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm New Password:
            </label>
            <div className="relative flex items-center">
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 pl-8"
                type={showConfirmPassword ? "text" : "password"}
                name="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                placeholder="confirm password"
              />
              <FaLock className="text-gray-500 absolute left-2 " />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="flex justify-center">
         
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
