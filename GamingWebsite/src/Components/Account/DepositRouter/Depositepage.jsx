// Depositepage.jsx
import React, { useState } from "react";
import DHeader from "./DHeader"; // top header
import Moneysection from "./Moneysection"; // wallet/promo info
import ChannelSelection from "./ChannelSelection"; // deposit method select
import DepositAmountSelection from "./DepositAmountSelection"; // amount select
import FooterDeposit from "./FooterDeposit"; // bottom confirm deposit
import DepositHistory from "./Deposithistory"; // previous deposits
import RulesDeposit from "./RulesDeposit"; // optional rules section

const Depositepage = () => {
  // 💡 State for selected channel & amount
  const [selectedChannelName, setSelectedChannelName] = useState("UPI-QRpay");
  const [selectedAmount, setSelectedAmount] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 🔸 Top Header */}
      <DHeader />

      {/* 🔸 Wallet / Promo Section */}
      <Moneysection />

      {/* 🔸 Main Deposit Area */}
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* Payment Channel Selection */}
        <ChannelSelection
          selectedChannel={selectedChannelName}
          onChannelChange={setSelectedChannelName}
        />

        {/* Deposit Amount Selection */}
        <DepositAmountSelection
          selectedAmount={selectedAmount}
          onAmountChange={setSelectedAmount}
        />

        {/* Optional Rules */}
        <RulesDeposit />

        {/* Deposit History */}
        <DepositHistory />
      </div>

      {/* 🔸 Fixed Footer for final confirmation */}
      <FooterDeposit
        selectedMethod={selectedChannelName}
        selectedAmount={selectedAmount}
        currencySymbol="₹"
      />
    </div>
  );
};

export default Depositepage;
