import React from 'react';

// Image data array with links
const walletItems = [
  { name: "ARWallet", src: "/Accounticon/wallet.png", alt: "AR Wallet Icon", link: "" },
  { name: "Deposit", src: "/Accounticon/save-money.png", alt: "Deposit Icon", link: "/deposit" },
  { name: "Withdraw", src: "/Accounticon/credit-card.png", alt: "Withdraw Icon", link: "" },
  { name: "VIP", src: "/Accounticon/vip-card.png", alt: "VIP Icon", link: "" },
];

const WalletDashboardCard = ({ balance = 28.00 }) => {
  return (
    <div className="bg-[#4d4d4c] rounded-xl shadow-md p-4 h-48 w-full max-w-md mx-auto my-4"> 

      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-gray-400 text-sm font-medium">Total Balance</h3>
          <p className="text-white text-2xl font-bold mt-1">${balance.toFixed(2)}</p>
        </div>

        <button className="mt-2 bg-gradient-to-r from-[#f2dd9b] to-[#c4933f] text-white text-md font-semibold px-7 py-1.5 rounded-full hover:bg-blue-700 transition">
          Enter Wallet
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 text-center text-md text-white">
        {walletItems.map((item, index) => (
          <a key={index} href={item.link} className="flex flex-col items-center hover:scale-110 transition-transform">
            <img src={item.src} alt={item.alt} className="w-10 h-10 mb-1" />
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default WalletDashboardCard;