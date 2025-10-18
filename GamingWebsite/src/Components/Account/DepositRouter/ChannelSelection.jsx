import React from "react";
import { IoWalletOutline } from "react-icons/io5";

const channels = [
  { name: "UPI-QRpay", range: "200 - 20K" },

];

const ChannelSelection = ({
  selectedChannel = "UPI-QRpay",
  onChannelChange = () => {},
}) => {
  return (
    <div className="p-4 max-w-lg mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <IoWalletOutline className="text-xl text-amber-500" />
        <h2 className="text-md font-bold text-gray-300">Select Channel</h2>
      </div>

      {/* Channel Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {channels.map((channel) => {
          const isActive = selectedChannel === channel.name;
          return (
            <div
              key={channel.name}
              onClick={() => onChannelChange(channel.name)}
              className={`p-3 rounded-lg text-center cursor-pointer transition-all duration-200 
                border ${
                  isActive
                    ? "bg-gradient-to-r from-[#f2dd9b] to-[#c4933f] text-black border-yellow-300 shadow-lg scale-105"
                    : "bg-[#4d4d4c] text-white border-transparent hover:border-yellow-500 hover:scale-105"
                }`}
            >
              <p
                className={`text-sm font-semibold ${
                  isActive ? "text-black" : "text-white"
                }`}
              >
                {channel.name}
              </p>
              <p
                className={`text-xs mt-1 ${
                  isActive ? "text-gray-800" : "text-gray-300"
                }`}
              >
                Balance: {channel.range}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChannelSelection;
