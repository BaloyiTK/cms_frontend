import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Project from "./Project";
import CmsFeatures from "../components/CmsFeatures";
import { baseUrl } from "../utils/baseUrl";
import Loader from "../components/Loader";
import { FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";

// Define a set of modern colors
const colors = [
  "#FFABAB", // Light pink
  "#FFC3A0", // Peach
  "#D5AAFF", // Light purple
  "#6A0572", // Dark purple
  "#4B7BE5", // Light blue
  "#6EEDC1", // Light teal
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cachedData, setCachedData] = useState(null);

  const fetchLoginStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      if (cachedData !== null) {
        setIsLoggedIn(cachedData);
      } else {
        const { data } = await axios.get(`${baseUrl}/loginStatus`);
        setIsLoggedIn(data);
        setCachedData(data);
      }
    } catch (error) {
      console.error('Error fetching login status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cachedData]);

  useEffect(() => {
    fetchLoginStatus();
  }, [fetchLoginStatus]);

  const animationVariants = {
    hidden: { opacity: 0, x: '-100vw' },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '100vw' }
  };

  const handleLearnMoreClick = () => {
    document.getElementById('cms-features').scrollIntoView({
      behavior: 'smooth'
    });
  };

  const renderLoader = useMemo(() => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen bg-white"
    >
      <Loader />
    </motion.div>
  ), []);

  const renderLoggedIn = useMemo(() => (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative container mx-auto p-8 min-h-screen bg-white overflow-hidden"
    >
      <div className="absolute inset-0 z-0 grid grid-cols-4 gap-4 opacity-20">
        {[...Array(16)].map((_, index) => (
          <div
            key={index}
            className="w-24 h-24 rounded-lg"
            style={{
              backgroundColor: getRandomColor(),
              transform: `translate(${Math.random() * 100}px, ${Math.random() * 100}px)`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          ></div>
        ))}
      </div>
      <div className="relative z-10">
        <Project />
      </div>
    </motion.main>
  ), [animationVariants]);

  const renderLoggedOut = useMemo(() => (
    <motion.main
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animationVariants}
      className="relative flex flex-col md:flex-row items-center justify-center min-h-screen bg-white p-8 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 grid grid-cols-6 gap-4 opacity-20">
        {[...Array(36)].map((_, index) => (
          <div
            key={index}
            className="w-20 h-20 rounded-lg"
            style={{
              backgroundColor: getRandomColor(),
              transform: `translate(${Math.random() * 150}px, ${Math.random() * 150}px)`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          ></div>
        ))}
      </div>
      <motion.div
        className="flex-1 flex justify-center md:justify-start mb-8 md:mb-0 relative z-10"
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.9 }}
      >
        <img
          src="/cms2.gif"
          alt="Promotional GIF"
          className="w-full max-w-md"
        />
      </motion.div>
      <motion.div
        className="flex-1 text-center md:text-left md:pl-8 relative z-10"
        initial={{ x: '100vw' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.9 }}
      >
        <h1 className=" digital-font text-5xl font-bold text-gray-900 mb-4">Elevate Your Content</h1>
        <p className="text-xl text-gray-700 mb-8 font-semibold">
          Transform your content management experience with our intuitive platform. Designed for efficiency and ease, XpandCMS makes content management a breeze.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            to="/register"
            className="inline-flex items-center text-white bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            <FaRocket className="mr-2 text-xl" />
            Start Now
          </Link>
          <button
            onClick={handleLearnMoreClick}
            className="inline-flex items-center text-white bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            <span className="mr-2">Learn More</span>
          </button>
        </div>
      </motion.div>
    </motion.main>
  ), [animationVariants]);

  return (
    <div className="relative bg-white min-h-screen overflow-hidden">
      {isLoading ? renderLoader : (isLoggedIn ? renderLoggedIn : (
        <>
          {renderLoggedOut}
          <CmsFeatures />
        </>
      ))}
    </div>
  );
};

export default HomePage;
