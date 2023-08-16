import React, { useState } from "react";
import { baseUrl } from "../utils/baseUrl";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("reset ");

    const myKeyValues = window.location.search;
    const urlParams = new URLSearchParams(myKeyValues);
    const token = urlParams.get("token");

    console.log(token);

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
      console.log(error);
      toast.error(error, {
        icon: <FaTimes className="text-red-500" />,
      });
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white p-8 rounded w-full sm:w-96 mx-3 shadow-2xl border border-gray-300">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              New Password:
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
          </div>
          {/* Confirm New Password */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm New Password:
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
