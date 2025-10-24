import React, { useState } from 'react';
import { Home, Zap, Gift, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const navItems = [
    { name: 'Home', icon: <Home />, label: 'Home', group: 'left', link:"/" },
    { name: 'Activity', icon: <Zap />, label: 'Activity', group: 'left',link:"/activity"  },
    { name: 'Wheel', isSpecial: true, label: 'Get $500' },
    { name: 'Promotion', icon: <Gift />, label: 'Promotion', group: 'right' },
    { name: 'Account', icon: <User />, label: 'Account', group: 'right' ,link:"/account"},
  ];

  const wheelImageUrl = 'https://ossimg.bdgadminbdg.com/IndiaBDG/tab/wheel.png';

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[#3f3f3f] text-gray-400  shadow-[0_-2px_5px_rgba(0,0,0,0.5)] z-50 rounded-t-xl">
      <div className="relative flex justify-between items-center h-16 px-4">

        {/* Left group */}
        <div className="flex space-x-14">
          {navItems
            .filter(item => item.group === 'left')
            .map(item => {
              const isActive = activeTab === item.name;
              return (
               <Link 
               to={item.link}>

           <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex flex-col items-center justify-center transition-colors duration-300 py-2 ${
                    isActive ? 'text-yellow-400' : 'hover:text-gray-300'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </button>     
                </Link>
              );
            })}
        </div>

        {/* Wheel special button */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24">
          <button
            onClick={() => setActiveTab('Wheel')}
            className="w-full h-full rounded-full bg-cover bg-center shadow-2xl  focus:outline-none transform hover:scale-105 transition-transform duration-300"
            style={{ backgroundImage: `url(${wheelImageUrl})` }}
          ></button>
          <span className="absolute flex gap-3 items-center justify-center bottom-0 left-1/2 -translate-x-1/2 text-amber-400 text-[14px] font-bold">
            <p>Get</p>
            <p>$50</p>
          </span>
        </div>

        {/* Right group */}
        <div className="flex space-x-9">
          {navItems
            .filter(item => item.group === 'right')
            .map(item => {
              const isActive = activeTab === item.name;
              return (
               <Link to={item.link}>

                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex flex-col items-center justify-center transition-colors duration-300 py-2 ${
                    isActive ? 'text-yellow-400' : 'hover:text-gray-300'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </button>
                </Link>

              );
            })}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
