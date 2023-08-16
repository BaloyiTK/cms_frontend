import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { loginUser } from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaCheck, FaSpinner } from "react-icons/fa";

axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
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
      await loginUser(userData);
      setUserData({
        email: "",
        password: "",
      });
      dispatch(authActions.login());
      navigate("/");
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error, {
        icon: <FaTimes className="text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white p-8 rounded shadow-lg w-full sm:w-96 mx-2 border border-gray-300 ">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit} className=" ">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              type="password"
              name="password"
              id="password"
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
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin" />
                  <span>Login</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        <div className="flex justify-center mt-2">
          <Link
            to="/forgot-password"
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="mt-4 text-center">
          <span>Don't have an account?</span>
          <Link to="/register" className="text-blue-500 hover:underline ml-1  font-medium">
            Register
          </Link>
        </div>
       
      </div>
    </div>
  );
};

export default Login;
