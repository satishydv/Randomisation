import React, { useState } from "react";
import { ArrowLeft, Gift, Clock } from "lucide-react"; // for icons

const Giftdescription = () => {
  const [giftCode, setGiftCode] = useState("");
  const [history, setHistory] = useState([]); // no data initially

  const handleRedeem = () => {
    if (giftCode.trim() === "") return alert("Please enter a gift code!");
    // For demo: add fake record to history
    setHistory([{ code: giftCode, date: new Date().toLocaleString() }, ...history]);
    setGiftCode("");
  };

  return (
    <div className="w-full min-h-full pt-16 bg-[#1e1e1e] text-white flex flex-col">
        <img src="/Activitypageimg/gift.webp" alt="" />
      {/* ===== Header ===== */}
      

      {/* ===== Gift Section ===== */}
      <div className="flex-1 p-5 flex  gap-5 flex-col ">
        <div>

        <p className="text-lg text-gray-400 ">Hi</p>
        <p className="text-gray-400 ">We have a gift for you</p>
        </div>

        <h4 className="text-md mt-2 text-left">Please enter the gift code below</h4>

        <input
          type="text"
          value={giftCode}
          onChange={(e) => setGiftCode(e.target.value)}
          placeholder="Please enter gift code"
          className="mt-4 w-full bg-[#2a2a2a] p-3 rounded-lg outline-none text-white placeholder-gray-500"
        />

        <button
          onClick={handleRedeem}
          className="mt-4 w-full bg-gradient-to-r from-[#f2dd9b] to-[#dbb768] py-2 rounded-lg font-semibold hover:opacity-90"
        >
          Receive
        </button>
      </div>

      {/* ===== History Section ===== */}
      <div className="p-5 border-t border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Gift size={18} />
          <span className="font-semibold">History</span>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center text-gray-500 mt-10">
            <Clock size={40} className="mb-2" />
            <p>No data</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={index}
                className="bg-[#2a2a2a] p-3 rounded-lg flex justify-between items-center"
              >
                <span>{item.code}</span>
                <span className="text-gray-400 text-sm">{item.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Giftdescription;
