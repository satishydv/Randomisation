import React from "react";
import { RiCheckboxCircleLine, RiHistoryLine, RiArrowDownLine, RiArrowUpLine } from "react-icons/ri";

// Card data
const dashboardCards = [
  { name: "Game History", icon: <RiHistoryLine className="text-[#f2dd9b] w-8 h-8" />, link: "", description: "My game history" },
  { name: "Transaction", icon: <RiCheckboxCircleLine className="text-[#f2dd9b] w-8 h-8" />, link: "", description: "My Transaction History" },
  { name: "Deposit", icon: <RiArrowDownLine className="text-[#f2dd9b] w-8 h-8" />, link: "/history", description: "My Deposits History" },
  { name: "Withdraw", icon: <RiArrowUpLine className="text-[#f2dd9b] w-8 h-8" />, link: "/withdraw", description: "My Withdraw History" },
];

const DashboardGrid = () => {
  return (
    <div className="grid grid-cols-2 mt-16 mb-4 sm:grid-cols-2 gap-4 p-4">
      {dashboardCards.map((card, index) => (
        <a
          key={index}
          href={card.link}
          className="flex  items-center gap-4 justify-center bg-[#4d4d4c] text-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
        >
          <div className="mb-2">{card.icon}</div>
          <div className="flex flex-col ">

          <span className="text-sm sm:text-base font-medium">{card.name}</span>
          <span className="text-gray-400 text-xs mt-1 text-center">{card.description}</span>
          </div>

        </a>
      ))}
    </div>
  );
};

export default DashboardGrid;
