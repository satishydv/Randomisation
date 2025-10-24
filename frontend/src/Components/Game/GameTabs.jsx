import React from 'react';
import { gameTabs } from './utils/gameData';

const GameTabs = ({ activeTab, onSelect }) => {
  return (
    <div className="bg-[#4d4d4c] rounded-2xl flex justify-between mb-4 shadow-md p-1">
      {gameTabs.map((tab) => {
        const isActive = activeTab.id === tab.id;
        return (
          <button 
            key={tab.id} 
            onClick={() => onSelect(tab)} 
            className={`flex-1 mx-1 py-6 sm:py-6 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 ${
              isActive 
                ? "bg-gradient-to-r from-[#f2dd9b] to-[#dbb768] text-[#975411] shadow-md scale-105" 
                : " text-gray-300 "
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <img 
                src={isActive ? "/Gameimg/timer.webp" : "/Gameimg/timer-grey.webp"} 
                alt="Timer Icon" 
                className="w-9 h-9"
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = isActive 
                    ? "https://placehold.co/36x36/dbb768/975411?text=T" 
                    : "https://placehold.co/36x36/4d4d4c/999?text=T"; 
                }}
              />
              {tab.name}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default GameTabs;