import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Project from "./Project";
import { baseUrl } from "../utils/baseUrl";
import Loader from "./Loader";

const HomePage = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoadingState] = useState(false);
  const [cachedData, setCachedData] = useState(null);

  // Color the variable names and function names for better readability
  const handleProjectsLoading = useCallback((loadingState) => {
    setProjectsLoadingState(loadingState);
  }, []);

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        setLoading(true);

        if (cachedData) {
          setisLoggedIn(cachedData);
        } else {
          const response = await axios.get(`${baseUrl}/loginStatus`);
          setisLoggedIn(response.data);
          setCachedData(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getLoginStatus();
  }, [cachedData]);

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
      <main className="min-h-screen max-w-7xl mx-auto py-16 px-6">
        <h1 className="text-xl font-bold text-gray-800 mb-8">
          Take Control of Your Content
        </h1>
        <p className="text-base text-gray-600 mb-12">
          XpandCMS is a powerful content management system that allows you to
          easily create, manage, publish, and schedule your content. With a
          user-friendly interface and robust features, you can focus on creating
          exceptional content while XpandCMS takes care of the rest.
        </p>
        <Link
          to="/register"
          className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md"
        >
          Get Started
        </Link>
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
