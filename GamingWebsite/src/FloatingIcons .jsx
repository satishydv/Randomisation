import React from "react";
import { useNavigate } from "react-router-dom"; // navigation ke liye
import "remixicon/fonts/remixicon.css";

const FloatingIcons = () => {
  const navigate = useNavigate();

  // Common handler for all icons
  const handleClick = () => {
    navigate("/login"); // sabhi icon par click hone par login page par le jao
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
    

      {/* Call Image */}
      <button
        onClick={handleClick}
        className="rounded-full shadow-lg hover:scale-110 transition-transform"
        title="Go to Login"
      >
        <img
          src="/newproject/Icons/Rename.webp"
          alt="Call Icon"
          className="w-18 h-18 object-contain"
        />
      </button>

      {/* Message Image */}
      <button
        onClick={handleClick}
        className="rounded-full shadow-lg hover:scale-110 transition-transform"
        title="Go to Login"
      >
        <img
          src="/newproject/Icons/Spinner.webp"
          alt="Message Icon"
          className="w-18 h-18 object-contain"
        />
      </button>

        {/* WhatsApp Image */}
      <button
        onClick={handleClick}
        className="rounded-full shadow-lg hover:scale-110 transition-transform"
        title="Go to Login"
      >
        <img
          src="/newproject/Icons/Icon3.webp"
          alt="WhatsApp Icon"
          className="w-18 h-18 object-contain"
        />
      </button>
    </div>
  );
};

export default FloatingIcons;
