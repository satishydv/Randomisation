import React from 'react';
// Importing the icons we need
import { FaUsers, FaTrophy } from 'react-icons/fa';
import { RiPercentLine } from 'react-icons/ri';
import { IoReloadCircleSharp } from 'react-icons/io5';

// An array to hold the data for our header items.
// This makes it easy to add or remove items later.
const headerItems = [
  {
    text: "Invitation bonus",
    icon: <FaUsers size={24} className="text-blue-400" />
  },
  {
    text: "Betting rebate",
    icon: <RiPercentLine size={24} className="text-green-400" />
  },
  {
    text: "Super Jackpot",
    icon: <FaTrophy size={24} className="text-yellow-400" />
  },
  {
    text: "Invite Wheel",
    icon: <IoReloadCircleSharp size={24} className="text-purple-400 bg-gradient-to-b from-purple-400" />
  }
];

const ActivityIcon = () => {
  return (
    // Main container: Dark background, padding, and flex layout
    <div className="flex justify-around items-center bg-zinc-800 p-3 rounded-lg">
      
      {/* We map over the array to create each item */}
      {headerItems.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2 cursor-pointer">
          
          {/* Circular background for the icon */}
          <div className="w-14 h-14 bg-zinc-700 rounded-full flex items-center justify-center">
            {item.icon}
          </div>
          
          {/* Text label */}
          <span className="text-xs text-zinc-300">{item.text}</span>

        </div>
      ))}
    </div>
  );
};

export default ActivityIcon;