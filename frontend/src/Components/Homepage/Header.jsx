// src/Components/Header.jsx
import React from "react";
import { FiDownload, FiHeadphones } from "react-icons/fi";

const Header = () => {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[#3f3f3f] text-white z-50">
      <div className="px-4 py-2 flex justify-between items-center">
        {/* ===== Left Side: Logo + Welcome ===== */}
        <div className="flex flex-col space-y-1">
          <div className="logo">
            <img
              src="https://ossimg.bdgadminbdg.com/IndiaBDG/other/h5setting_202401100608011fs2.png"
              alt="BDG Logo"
              className="h-10 w-auto"
            />
          </div>

          <div className="flex items-center space-x-5">
            <img
              src="/newproject/usicon.webp"
              alt="EN"
              className="h-6 w-6 rounded"
            />
            <span className="text-sm font-semibold text-[#d9ac4f]">
              Welcome to BDG Game
            </span>
          </div>
        </div>

        {/* ===== Right Side: Buttons ===== */}
        <div className="flex flex-col space-y-2">
          <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#f2dd9b] to-[#dbb768] text-black text-sm font-semibold px-3 py-3 hover:brightness-110 transition">
            <FiDownload className="text-base" />
            Download App
          </button>

          <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#f2dd9b] to-[#dbb768] text-black text-sm font-semibold px-3 py-3 hover:brightness-110 transition">
            <FiHeadphones className="text-base" />
            Customer Service
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
