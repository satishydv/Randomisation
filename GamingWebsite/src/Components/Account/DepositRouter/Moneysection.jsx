import React, { useState, useEffect } from "react";
import { walletAPI } from "../../../utils/api";

const Moneysection = ({ refreshTrigger = 0 }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch balance on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchBalance();
  }, [refreshTrigger]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await walletAPI.getBalance();
      
      if (result.success && result.data.status === 'success') {
        setBalance(result.data.data.balance);
      } else {
        setError('Failed to fetch balance');
        setBalance(0);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Error fetching balance');
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    // Start refresh animation
    setRefreshing(true);

    try {
      // Fetch fresh balance
      await fetchBalance();
      
      // Show success popup
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1500);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
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
                {loading ? (
                  <span className="text-lg">Loading...</span>
                ) : error ? (
                  <span className="text-lg text-red-500">Error</span>
                ) : (
                  `$ ${balance.toFixed(2)}`
                )}
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
