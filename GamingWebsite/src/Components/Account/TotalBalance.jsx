import React, { useState, useEffect } from 'react';
import { walletAPI } from '../../utils/api';

// Image data array with links
const walletItems = [
  { name: "ARWallet", src: "/Accounticon/wallet.png", alt: "AR Wallet Icon", link: "" },
  { name: "Deposit", src: "/Accounticon/save-money.png", alt: "Deposit Icon", link: "/deposit" },
  { name: "Withdraw", src: "/Accounticon/credit-card.png", alt: "Withdraw Icon", link: "" },
  { name: "VIP", src: "/Accounticon/vip-card.png", alt: "VIP Icon", link: "" },
];

const WalletDashboardCard = ({ refreshTrigger = 0 }) => {
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
      
      console.log('Fetching balance...');
      const result = await walletAPI.getBalance();
      console.log('Balance API result:', result);
      
      if (result.success && result.data.status === 'success') {
        console.log('Balance fetched successfully:', result.data.data.balance);
        setBalance(result.data.data.balance);
      } else {
        console.error('API Error:', result.data);
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
  return (
    <div className="bg-[#4d4d4c] rounded-xl shadow-md p-4 h-48 w-full max-w-md mx-auto my-4"> 

      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-gray-400 text-sm font-medium">Total Balance</h3>
          {loading ? (
            <p className="text-gray-400 text-lg mt-1">Loading...</p>
          ) : error ? (
            <p className="text-red-400 text-lg mt-1">Error</p>
          ) : (
            <p className="text-white text-2xl font-bold mt-1">${balance.toFixed(2)}</p>
          )}
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