import axios from 'axios';
import React, { useState } from 'react';
import { FaEnvelope, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { baseUrl } from '../utils/baseUrl';
import { useNavigate, Link } from 'react-router-dom';
import Icon from "../images/Icon.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(`${baseUrl}/forgot-password`, { email });
      
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
      <div className="bg-white p-8 rounded border border-gray-300 shadow-lg w-full sm:w-96 mx-3">
       
        <div className="text-center mb-5">
            <img src={Icon} alt="" className="mx-auto" />
            <h1 className="font-semibold text-2xl mt-1">Forgot Password</h1>
          </div>
        <form onSubmit={handleSubmit}>
          <p className='text-sm mb-2'>Please enter the email address associated with your XpandCMS Account</p>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email:
            </label>

            <div className="relative flex items-center">
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 pl-8"
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="email"
              />
              <FaEnvelope className="text-gray-500 absolute left-2 " />
            </div>
        
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Send Instructions
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
