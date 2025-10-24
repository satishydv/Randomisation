import React from 'react';
// react-icons से जरूरी आइकन्स इम्पोर्ट करें
import { IoSettingsOutline, IoChatbubbleEllipsesOutline, IoMegaphoneOutline, IoHeadsetOutline, IoBookOutline, IoInformationCircleOutline } from 'react-icons/io5';

// सर्विस आइटम्स का डेटा
const serviceItems = [
  { icon: <IoSettingsOutline />, title: "Settings" },
  { icon: <IoChatbubbleEllipsesOutline />, title: "Feedback" },
  { icon: <IoMegaphoneOutline />, title: "Announcement" },
  { icon: <IoHeadsetOutline />, title: "Customer Service" },
  { icon: <IoBookOutline />, title: "Beginner's Guide" },
  { icon: <IoInformationCircleOutline />, title: "About us" },
];

const ServiceCenter = () => {
  return (
    <>
    <div className="bg-[#4d4d4c] p-4 mt-4 font-sans rounded-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-50 mb-4">
        Service center
      </h1>

      <div className="grid grid-cols-3 gap-3">
        {serviceItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-2  cursor-pointer transition-transform hover:scale-105"
          >
            {/* आइकॉन */}
            <div className="text-3xl text-[#f2dd9b] mb-2">
              {item.icon}
            </div>
            
            {/* टेक्स्ट */}
            <span className="text-sm text-white text-center">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>

    
    </>

  );
};

export default ServiceCenter;