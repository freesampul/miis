import React, { createContext, useContext, useState } from 'react';
import options from './options'; // Adjust the import path as necessary

// Create the AvatarContext
const AvatarContext = createContext();

// Define the AvatarProvider component
export const AvatarProvider = ({ children }) => {
  // Initialize avatar state dynamically based on options keys
  const initialAvatarState = Object.keys(options).reduce((acc, key) => {
    acc[key.toLowerCase()] = null;
    return acc;
  }, {});

  const [avatar, setAvatar] = useState(initialAvatarState);

  // Function to pick a random item from an array
  const getRandomItem = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  // Function to randomize the avatar
  const randomizeAvatar = () => {
    const randomizedAvatar = Object.keys(options).reduce((acc, key) => {
      acc[key.toLowerCase()] = getRandomItem(options[key]);
      return acc;
    }, {});
    setAvatar(randomizedAvatar);
  };

  return (
    <AvatarContext.Provider value={{ avatar, setAvatar, randomizeAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};

// Custom hook to use the AvatarContext
export const useAvatar = () => useContext(AvatarContext);
