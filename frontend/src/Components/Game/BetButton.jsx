import React from 'react';
import { colorStyles } from './utils/gameData';

const BetButton = ({ children, isActive, onClick, color = "red", className = "" }) => {
  const theme = colorStyles[color] || colorStyles.red;
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-md text-sm font-bold transition-all duration-200
        ${isActive ? `${theme.bg} text-white shadow-lg` : "bg-gray-800 text-gray-400 shadow-inner"} ${className}`}
    >
      {children}
    </button>
  );
};

export default BetButton;