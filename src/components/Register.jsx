import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/api';
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaSpinner } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await registerUser(userData);
      setUserData({
        username: '',
        email: '',
        password: ''
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
      <div className="bg-white p-8 rounded shadow-lg w-full sm:w-96 mx-2 border border-gray-300 ">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username:
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              type="text"
              name="username"
              id='username'
              autoComplete="username"
              value={userData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email:
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              type="email"
              name="email"
              id='email'
              autoComplete="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password:
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              type="password"
              name="password"
              id='password'
              autoComplete="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isLoading} // Disable the button when loading
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin" />
                <span>Register</span> 
               
              </div>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <span>Already have an account?</span>
          <Link to="/login" className="text-blue-500 hover:underline ml-1  font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
