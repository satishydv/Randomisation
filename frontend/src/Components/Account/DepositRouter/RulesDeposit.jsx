import React from "react";
import { Info } from "lucide-react"; // Icon for instruction title

const RulesDeposit = () => {
  return (
    <div className="bg-[#2b2b2b] text-white rounded-lg p-4 mt-4 shadow-md">
      {/* Title Section */}
      <div className="flex items-center gap-2 mb-3 border-b border-gray-600 pb-2">
        <div className="bg-[#dbb7681a] p-2 rounded-full">
          <Info size={18} className="text-yellow-400" />
        </div>
        <p className="font-semibold text-lg text-yellow-400">
          Recharge Instructions
        </p>
      </div>

      {/* Instruction List */}
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
        <p>
          If the transfer time is up, please fill out the deposit form again.
        </p>
        <p>
          The transfer amount must match the order you created, otherwise the
          money cannot be credited successfully.
        </p>
        <p>
          If you transfer the wrong amount, our company will not be responsible
          for the lost amount!
        </p>
        <p>
          <span className="text-yellow-400 font-medium">Note:</span> Do not
          cancel the deposit order after the money has been transferred.
        </p>
      </div>
    </div>
  );
};

export default RulesDeposit;
