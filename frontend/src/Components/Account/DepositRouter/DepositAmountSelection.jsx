import React from 'react';
import { IoCardOutline, IoCloseCircle } from 'react-icons/io5';

const presetAmounts = [1, 5, 10, 20, 50, 100, 500, 1000, 10000];

const DepositAmountSelection = ({ selectedAmount, onAmountChange }) => {

  const handleManualChange = (value) => {
    const num = parseFloat(value);
    if (!isNaN(num)) onAmountChange(num);
    else onAmountChange(null);
  };

  return (
    <div className="bg-[#333333] p-4 rounded-lg max-w-lg mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <IoCardOutline className="text-xl text-amber-500" />
        <h2 className="text-md font-bold text-gray-300">Deposit amount</h2>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {presetAmounts.map((value) => (
          <button
            key={value}
            onClick={() => onAmountChange(value)}
            className={`p-3 rounded-lg text-center cursor-pointer transition-all duration-200 font-semibold ${
              Number(selectedAmount) === value
                ? 'bg-gradient-to-r from-[#f2dd9b] to-[#c4933f] text-black shadow-lg'
                : 'bg-[#4d4d4c] text-white hover:bg-[#5c5c5b]'
            }`}
          >
            <span className="text-md">$</span> {value}
          </button>
        ))}
      </div>

      {/* Manual Input Field */}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-lg text-gray-400">$</span>
        <input
          type="number"
          value={selectedAmount === null ? '' : selectedAmount}
          onChange={(e) => handleManualChange(e.target.value)}
          placeholder="$10.00 - $10,000.00"
          className="
            w-full bg-[#4d4d4c] text-white placeholder-gray-500 rounded-lg 
            p-3 pl-8 pr-10 border border-transparent 
            focus:border-amber-500 focus:ring-0 outline-none transition
          "
        />
        {selectedAmount && (
          <IoCloseCircle
            onClick={() => onAmountChange(null)}
            className="absolute right-3 text-2xl text-gray-500 cursor-pointer hover:text-white transition-colors"
          />
        )}
      </div>
    </div>
  );
};

export default DepositAmountSelection;
