import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTimes,
  FaSpinner,
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
} from "react-icons/fa";
import Icon from "../images/Icon.png";

const Register = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await registerUser(userData);
      setUserData({
        username: "",
        email: "",
        password: "",
      });

      toast.success("User registration successfully ");
      navigate("/login");
    } catch (error) {
      toast.error(error, {
        icon: <FaTimes className="text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 ">
      <div className="bg-white p-8 rounded shadow-lg w-full sm:w-96 mx-3 border border-gray-300">
        <div className="flex justify-center items-center">
          <div className="text-center mb-5">
            <img src={Icon} alt="" className="mx-auto" />
            <h1 className="font-bold text-2xl mt-1">Register</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="username"
            >
              Username:
            </label>
            <div className="relative flex items-center">
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 pl-8"
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                value={userData.username}
                onChange={handleChange}
                required
                placeholder="username"
              />
              <FaUser className="text-gray-500 absolute left-2 " />
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Email:
            </label>
            <div className="relative flex items-center">
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 pl-8"
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                value={userData.email}
                onChange={handleChange}
                required
                placeholder="email"
              />
              <FaEnvelope className="text-gray-500 absolute left-2 " />
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Password:
            </label>
            <div className="relative flex items-center">
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 pl-8"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="password"
                value={userData.password}
                onChange={handleChange}
                required
                placeholder="password"
              />
              <FaLock className="text-gray-500 absolute left-2 " />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin" />
                  <span className="ml-2">Registering...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {" "}
                  {/* Parent container */}
                  <span className="flex items-center">
                    <FaUserPlus className="mr-2 align-middle" />
                    <span>Register</span>
                  </span>
                </div>
              )}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <span>Already have an account?</span>
          <Link
            to="/login"
            className="text-blue-500 hover:underline ml-1  font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
