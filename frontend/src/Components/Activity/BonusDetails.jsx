import React from 'react';

const BonusBanner = ({ todayBonus = "0.00", totalBonus = "0.00" }) => {
  return (
    // Main Container: Full width, dark background, and vertical padding
    <div className="w-full bg-[#333332] py-4 text-white">
      
      <ul className="flex w-full list-none p-9 mb-4">
        
        <li className="flex-1 text-center border-r border-zinc-600">
          <p className="text-md text-white">Today's bonus</p>
          <h3 className="text-3xl font-bold mt-1">₹{todayBonus}</h3>
        </li>
        
        <li className="flex-1 text-center">
          <p className="text-md text-white">Total bonus</p>
          <h3 className="text-3xl font-bold mt-1">₹{totalBonus}</h3>
        </li>

      </ul>

      <div className="px-4 flex items-center justify-center"> 
        <button 
          className="px-9 py-4 bg-transparent text-yellow-400 font-bold  border border-yellow-400 rounded-full"
        >
          Bonus details
        </button>
      </div>

    </div>
  );
};

export default BonusBanner;