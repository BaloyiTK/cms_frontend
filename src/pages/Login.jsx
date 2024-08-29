import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { loginUser } from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTimes,
  FaSpinner,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Icon from "../images/Icon.png";

axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex justify-center items-center mt-10 ">
      <div
        className="bg-white p-8 rounded shadow-lg w-full sm:w-96 mx-3 border border-gray-300"
        // style={{ fontFamily: "Arial, sans-serif" }}
      >
        <div className="flex justify-center items-center">
          <div className="text-center mb-5">
            <img src={Icon} alt="" className="mx-auto" />
            <h1 className="font-bold text-2xl mt-1">Login</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="">
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline relative"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin" />
                  <span className="ml-2">Logging in...</span>
                </div>
              ) : (
                <>
                  <span className="pr-3 ">Login</span>
                  <FaSignInAlt className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="flex justify-center mt-2">
          <Link
            to="/forgot-password"
            className="text-blue-500 hover:underline font-semibold"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="mt-4 text-center">
          <span className="font-medium">Don't have an account?</span>
          <Link
            to="/register"
            className="text-blue-500 hover:underline ml-1 font-medium"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
