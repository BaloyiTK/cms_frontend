import React, { useEffect, useState, useRef } from "react";
import { getUser } from "../utils/api";

const ProfilePicture = ({ toggleDropdown }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [character, setCharacter] = useState(null);
  const [user, setUser] = useState(() => {
    // Try to load user data from cache
    const cachedUser = localStorage.getItem("cachedUser");
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const userPhoto = user && user.photo;
 

  useEffect(() => {
    if (!user) {
      // If user data is not in cache, fetch it
      getUser()
        .then((response) => {
          setUser(response);
          // Cache the fetched user data
          localStorage.setItem("cachedUser", JSON.stringify(response));
          if (response && response.email) {
            setCharacter(response.email[0].toUpperCase());
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      if (user.email) {
        setCharacter(user.email[0].toUpperCase());
      }
    }
  }, [user]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && character) {
      const context = canvas.getContext("2d");

      // Set canvas size
      const canvasSize = 150;
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      context.fillStyle = "#1abc9c"; // Set background color
      context.fillRect(0, 0, canvasSize, canvasSize);
      context.font = `${canvasSize * 0.5}px Arial`; // Adjust font size
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "#ffffff";
      context.fillText(character, canvasSize / 2, canvasSize / 2);
      
      // Convert canvas to data URL
      const imageData = canvas.toDataURL();

      // Assign the image data to the image element
      if (imageRef.current) {
        imageRef.current.src = imageData;
      }
    }
  }, [character]);

  if (!character) {
    return null; // or render a placeholder component or loading indicator
  }

  return (
    <div className=" border-2 rounded-full border-white profile-picture-container hover:border-2 hover:border-orange-600">
      {userPhoto ? (
        <img
          src={userPhoto}
          className="w-10 h-10 rounded-full justify-center items-center profile-image "
          alt="Profile Image"
          onClick={toggleDropdown}
        />
      ) : (
        <>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          <img
            ref={imageRef}
            className="w-10 h-10 rounded-full justify-center items-center profile-image"
            alt="Profile Image"
            onClick={toggleDropdown}
          />
        </>
      )}
    </div>
  );
};

export default ProfilePicture;
