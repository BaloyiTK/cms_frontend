import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions, dropdownActions } from "../store";
import { getLoginStatus } from "../utils/api";
import ProfilePicture from "./ProfilePicture";
import { baseUrl } from "../utils/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowRight, FaTimes, FaUserPlus } from "react-icons/fa";
import {
  RiLogoutBoxLine,
  RiAccountCircleLine,
} from "react-icons/ri";
import LOGO from "../images/LOGO.png";
import { FiMail } from 'react-icons/fi';

const ProfileDropdown = React.memo(({ handleLogout, handleAccountClick }) => (
  <div className="absolute w-fit right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md z-50">
    <Link
      to="/"
      className=" px-4 py-2 text-gray-700 hover:bg-gray-300 hover:text-white flex items-center"
      onClick={handleLogout}
    >
      <RiLogoutBoxLine className="mr-2 text-red-500" />{" "}
      {/* Add the logout icon */}
      Logout
    </Link>
    <Link
      to="/account-settings"
      className="px-4 py-2 text-gray-700 hover:bg-gray-300 hover:text-white flex items-center"
      onClick={handleAccountClick}
    >
      <RiAccountCircleLine className="mr-2 text-blue-500" />{" "}
      {/* Add the account icon */}
      Account
    </Link>
  </div>
));

const NavBar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isDropdownOpen = useSelector((state) => state.dropdown.isOpen);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [profilePictureKey, setProfilePictureKey] = useState(0);

  const handleLogout = useCallback(async () => {
    try {
      await axios.get(`${baseUrl}/logout`);
      dispatch(authActions.logout());
      navigate("/login");
      dispatch(dropdownActions.closeDropdown());
      toast.success("Logged out successfully.");
      localStorage.removeItem(`cachedUser`); // Clear the cache
    } catch (error) {
      console.error(error);
      toast.error(error, {
        icon: <FaTimes className="text-red-500" />,
      });
    }
  }, [dispatch, navigate]);

  const toggleDropdown = useCallback(() => {
    dispatch(
      isDropdownOpen
        ? dropdownActions.closeDropdown()
        : dropdownActions.openDropdown()
    );
  }, [dispatch, isDropdownOpen]);

  const handleAccountClick = useCallback(() => {
    dispatch(dropdownActions.closeDropdown());
  }, [dispatch]);

  const reloadProfilePictureKey = useCallback(() => {
    setProfilePictureKey((prevKey) => prevKey + 1);
    dispatch(dropdownActions.closeDropdown());
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    getLoginStatus()
      .then((response) => {
        setLoading(false);
        if (response) {
          dispatch(authActions.login());
        } else {
          dispatch(authActions.logout());
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [dispatch, navigate, isLoggedIn]);

  const location = useLocation();

  const loggedInLinks = useMemo(
    () => (
      <div className="relative">
        <ProfilePicture
          key={profilePictureKey}
          toggleDropdown={toggleDropdown}
          setProfilePictureKey={reloadProfilePictureKey}
        />
        {isDropdownOpen && (
          <ProfileDropdown
            handleLogout={handleLogout}
            handleAccountClick={handleAccountClick}
          />
        )}
      </div>
    ),
    [
      profilePictureKey,
      isDropdownOpen,
      handleLogout,
      handleAccountClick,
      reloadProfilePictureKey,
      toggleDropdown,
    ]
  );

  const unauthenticatedLinks = useMemo(
    () => (
      <div className="flex items-center">
      {location.pathname !== "/login" && (
        <Link
          to="/login"
          className="text-gray-600 md:ml-4 font-semibold flex items-center md:space-x-1 hover:bg-gray-200 hover: py-1 px-2 rounded-full transition duration-300 ease-in-out"
        >
          <RiAccountCircleLine className="w-5 h-5 mr-1 md:m-0" />
          <span>Login</span>
        </Link>
      )}
      {location.pathname !== "/register" && (
        <Link
          to="/register"
          className="text-gray-600  md:ml-4 font-semibold flex items-center md:space-x-1 hover:bg-gray-200 hover: py-1 px-2 rounded-full transition duration-300 ease-in-out"
        >
          <FaUserPlus className="w-5 h-5 mr-1 md:m-0 " />
          <span>Register</span>
        </Link>
      )}
    
    </div>
    
    ),
    [location.pathname]
  );

  return (
    <header className="shadow bg-white h-22 border-b bo">
      <nav className="flex justify-between items-center w-[95%] mx-auto h-20">
        <Link
          to="/"
          className="flex justify-center text-2xl font-bold text-gray-800 mt-[1.5%]"
          onClick={reloadProfilePictureKey}
        >
          <img src={LOGO} alt="" />
      
        </Link>
        {!isLoading && (
          <div className="flex items-center">
            {isLoggedIn ? loggedInLinks : unauthenticatedLinks}
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;