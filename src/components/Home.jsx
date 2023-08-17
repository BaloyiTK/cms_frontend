import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Project from "./Project";
import { baseUrl } from "../utils/baseUrl";
import Loader from "./Loader";
import { FaUser, FaFileAlt, FaPlay } from "react-icons/fa";

const HomePage = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoadingState] = useState(false);
  const [cachedData, setCachedData] = useState(null); // Add a new state for cached data

  const handleProjectsLoading = useCallback((loadingState) => {
    setProjectsLoadingState(loadingState);
  }, []);

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        setLoading(true);

        // Check if cached data exists before making a network request
        if (cachedData) {
          setisLoggedIn(cachedData);
        } else {
          const response = await axios.get(`${baseUrl}/loginStatus`);
          setisLoggedIn(response.data);

          // Cache the response data
          setCachedData(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getLoginStatus();
  }, [cachedData]); // Fetch data again if cachedData changes

  const renderLoader = useMemo(() => <Loader />, []);
  const renderLoggedIn = useMemo(
    () => (
      <main className="max-w-7xl mx-auto py-16 px-6">
        <Project setProjectsLoadingState={handleProjectsLoading} />
      </main>
    ),
    [handleProjectsLoading]
  );

  const renderLoggedOut = useMemo(
    () => (
      <main className="min-h-screen max-w-7xl md:text-center mx-auto py-16 px-6 ">
 <h1 class="text-4xl font-bold mb-8 animate-color-change gradient-heading">
        Take Control Of Your Content
    </h1>

        <p className="text-base text-gray-600 md:text-center mb-8">
          XpandCMS is a powerful content management system that allows you to
          easily create, manage, publish, and schedule your content. With a
          user-friendly interface and robust features, you can focus on creating
          exceptional content while XpandCMS takes care of the rest.
        </p>
        <div className="grid md:flex justify-center items-center">
  <Link
    to="/register"
    className="text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-full flex m-1 items-center md:justify-center w-40 text-sm md:text-base"
  >
    <span className="flex items-center ml-[15%] md:ml-0">
      <FaUser className="mr-1" />
      Get Started
    </span>
  </Link>
  <Link
    to="/register"
    className="text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-full flex m-1 items-center md:justify-center w-40 text-sm md:text-base"
  >
    <span className="flex items-center ml-[15%] md:ml-0">
      <FaFileAlt className="mr-1" />
      Docs
    </span>
  </Link>
  <Link
    to="/register"
    className="text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-full flex m-1 items-center md:justify-center w-40 text-sm md:text-base"
  >
    <span className="flex items-center ml-[15%] md:ml-0">
      <FaPlay className="mr-1" />
      Demo
    </span>
  </Link>
</div>

      </main>
    ),
    []
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {isLoading ? (
        renderLoader
      ) : (
        <>
          {isLoggedIn ? renderLoggedIn : renderLoggedOut}
          <footer className="bg-gray-800 text-white text-center py-4">
            <p>&copy; 2023 XpandCMS. All rights reserved.</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default HomePage;
