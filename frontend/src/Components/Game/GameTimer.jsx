import React from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from './utils/helpers';

const GameTimer = ({ activeTab, seconds, period, onHowToPlayClick }) => {
  return (
    <div 
      className="relative bg-cover bg-center p-4 sm:p-5 rounded-2xl shadow-md mb-5" 
      style={{ 
        backgroundColor: '#fde68a', 
        backgroundImage: "url('/Gameimg/wingotimer.webp')", 
        backgroundSize: 'cover' 
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <button 
            onClick={onHowToPlayClick} 
            className="flex items-center gap-2 text-[#8f5206] px-3 py-1 sm:px-6 sm:py-2 border-2 border-amber-900 rounded-full font-bold bg-white/30 hover:bg-white/50 transition text-xs sm:text-base"
          >
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> How to Play
          </button>
          <div className="text-base sm:text-lg text-[#8f5206] font-semibold">{activeTab.name}</div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="text-[#8f5206] text-sm sm:text-lg font-semibold mb-1">Time Remaining</div>
          <div className="flex gap-1 text-white font-mono text-xl sm:text-2xl">
            {formatTime(seconds).split("").map((char, idx) => (
              <div 
                key={idx} 
                className="w-6 h-10 sm:w-9 sm:h-13 p-2 sm:p-3 flex items-center justify-center bg-black bg-opacity-50 rounded-md shadow-inner"
              >
                {char}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-right mt-3">
        <span className="text-sm font-semibold text-[#8f5206]"> {period}</span>
      </div>
    </div>
  );
};

export default GameTimer;