import React, { useState } from "react";

const Moneysection = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleRefresh = () => {
    // Start refresh animation
    setRefreshing(true);

    // After short delay, show popup
    setTimeout(() => {
      setRefreshing(false);
      setShowPopup(true);

      // Hide popup after 1.5 sec
      setTimeout(() => setShowPopup(false), 1500);
    }, 1000);
  };

  return (
    <>
      <div className="w-full max-w-md mt-18 mx-auto relative">
        <div className="relative">
          <img src="/Accounticon/Deposit/Deposit.webp" alt="" />

          <div className="absolute inset-0 p-3">
            {/* Header */}
            <div className="flex gap-2 items-center">
              <img
                className="h-4 w-4"
                src="/Accounticon/Deposit/folder.webp"
                alt="folder"
              />
              <p className="text-md text-[#8f5206]">Balance</p>
            </div>

            {/* Money + Refresh */}
            <div className="flex gap-3 items-center mt-1">
              <p
                className={`text-[#8f5206] text-3xl font-bold transition-all duration-300 ${
                  refreshing ? "opacity-0" : "opacity-100"
                }`}
              >
                $ 28.00
              </p>

              <img
                onClick={handleRefresh}
                className={`w-8 h-4 cursor-pointer transition-transform duration-500 ${
                  refreshing ? "rotate-180" : ""
                }`}
                src="/Accounticon/Deposit/refresh.webp"
                alt="refresh"
              />
            </div>
          </div>
        </div>

        {/* ✅ Center Popup */}
        {showPopup && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div  className="bg-black bg-opacity-70 text-white text-sm px-6 py-3 rounded-lg shadow-lg flex flex-col items-center gap-2">
            {/* <RiCheckLine className="text-green-400 text-2xl" /> */}
            <i className="ri-check-line text-green-400 text-2xl"></i>
            <span>Refresh Successful</span>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Moneysection;
