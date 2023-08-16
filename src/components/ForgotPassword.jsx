import axios from 'axios';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { baseUrl } from '../utils/baseUrl';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(`${baseUrl}/forgot-password`, { email });
      console.log(res);
      toast.success('Success! A password reset link has been sent to your email.');
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'An error occurred while sending the reset link.';
      toast.error(errorMessage, {
        icon: <FaTimes className="text-red-500" />,
      });
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white p-8 rounded border border-gray-300 shadow-2xl w-full sm:w-96 mx-3">
        <h1 className="text-3xl font-semibold mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email:
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Send Reset Email
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          Remember Password?{' '}
          <Link to="/login" className="text-blue-500 hover:underline ml-1 font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
