import React from 'react';
import {
  IoNotificationsOutline,
  IoGiftOutline,
  IoTrophyOutline,
  IoQrCodeOutline,
  IoBrushOutline,
  IoStatsChartOutline,
  IoLanguageOutline,
  IoChevronForward
} from 'react-icons/io5';

// डेटा का स्ट्रक्चर वही रहेगा
const settingsData = [
  {
    id: 1,
    icon: <IoNotificationsOutline size={29} />,
    title: 'Notification',
    notificationCount: 3,
    isVisible: true,
  },
  {
    id: 2,
    icon: <IoGiftOutline size={29} />,
    title: 'Gifts',
    isVisible: true,
  },


  
  {
    id: 6,
    icon: <IoStatsChartOutline size={29} />,
    title: 'Game statistics',
    isVisible: true,
  },
  {
    id: 7,
    icon: <IoLanguageOutline size={22} />,
    title: 'Language',
    secondaryText: 'English',
    isVisible: true,
  },
];

const SettingsPanel = () => {
  return (
    <div className="w-full max-w-md mx-auto font-sans bg-[#4d4d4c]  rounded-lg shadow-md overflow-hidden">
      {settingsData.map(item => (
        item.isVisible && (
          <div 
            key={item.id} 
            className="flex justify-between items-center p-6 border-b border-gray-500 last:border-b-0 cursor-pointer transition-colors duration-200 hover:bg-[#696967]"
          >
            {/* Left Side: Icon and Title */}
            <div className="flex items-center gap-3">
              <div className="text-[#f2dd9b] font-bold ">
                {item.icon}
              </div>
              <span className="text-base text-gray-50">{item.title}</span>
            </div>

            {/* Right Side: Badge, Text, and Arrow */}
            <div className="flex items-center gap-3">
              {item.notificationCount && (
                <h5 className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.notificationCount}
                </h5>
              )}
              {item.secondaryText && (
                <span className="text-sm text-white">{item.secondaryText}</span>
              )}
              <IoChevronForward className="text-white" />
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default SettingsPanel;