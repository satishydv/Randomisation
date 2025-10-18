import React, { useState } from 'react';

// Mock Data
const depositData = [
  {
    id: 'RC2025101617202817068541f',
    balance: '₹ 200.00',
    type: '7Day-QRpay',
    time: '2025-10-16 17:20:28',
    status: 'To Be Paid',
  },
  {
    id: 'RC2025101516552420448273f',
    balance: '₹500.00',
    type: '7Day-QRpay',
    time: '2025-10-15 16:55:24',
    status: 'To Be Paid',
  },
  {
    id: 'RC2025101516445745950029a',
    balance: '₹200.00',
    type: '7Day-QRpay',
    time: '2025-10-15 16:44:57',
    status: 'To Be Paid',
  },
  {
    id: 'RC2025101516414811642177e',
    balance: '₹200.00',
    type: 'UPI-QRpay',
    time: '2025-10-15 16:41:48',
    status: 'To Be Paid',
  },
];



const DepositHistory = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="relative max-w-md mx-auto p-4 rounded-lg shadow-lg">
       {copied && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-black bg-opacity-70 text-white text-sm px-6 py-3 rounded-lg shadow-lg flex flex-col items-center gap-2">
            {/* <RiCheckLine className="text-green-400 text-2xl" /> */}
            <i className="ri-check-line text-green-400 text-2xl "></i>
            <span>Copy Successful</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-6 pb-2">
        <i className="ri-file-history-fill text-2xl text-[#c4933f]"></i>
        <span className="text-xl font-semibold text-gray-50">Deposit history</span>
      </div>

      {/* Deposit List */}
      <div className="space-y-4">
        {depositData.map((record) => (
          <div
            key={record.id}
            className="bg-[#4d4d4c] p-4 rounded-lg shadow "
          >
            {/* Title & Status Row */}
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 mb-2">
              <div className="text-base font-medium bg-green-500 rounded p-1 px-4">
                Deposit
              </div>
              <div className="flex items-center">
                <div className="text-md font-semibold text-[#c4933f] mr-2">
                  {record.status}
                </div>
                <i className="ri-arrow-right-s-line"></i>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-300 text-lg">Balance</span>
                <span className="font-medium text-[17px] text-[#c4933f]">
                  {record.balance}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-lg">Type</span>
                <span className="text-gray-300 text-sm">{record.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-lg">Time</span>
                <span className="text-gray-300 text-sm">{record.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg">Order number</span>
                <div className="flex items-center">
                  <span className="text-gray-300 text-xs mr-2">{record.id}</span>
                  <i
                    onClick={() => handleCopy(record.id)}
                    className="ri-file-copy-line text-sm text-gray-400 hover:text-[#c4933f] cursor-pointer"
                  ></i>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => console.log(`Submit receipt for ${record.id}`)}
              className="mt-3 w-full py-2 bg-gradient-to-r from-[#f2dd9b] to-[#c4933f] text-white font-medium rounded-full hover:opacity-90 transition duration-150"
            >
              Submit Receipt
            </button>
          </div>
        ))}
      </div>

      {/* FadeIn Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DepositHistory;
