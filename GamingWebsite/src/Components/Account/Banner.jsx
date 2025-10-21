import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { walletAPI, userAPI } from "../../utils/api";

const walletItems = [
  { name: "ARWallet", src: "/Accounticon/wallet.png", alt: "AR Wallet Icon", link: "" },
  { name: "Deposit", src: "/Accounticon/save-money.png", alt: "Deposit Icon", link: "/deposit" },
  { name: "Withdraw", src: "/Accounticon/credit-card.png", alt: "Withdraw Icon", link: "" },
  { name: "VIP", src: "/Accounticon/vip-card.png", alt: "VIP Icon", link: "" },
];

export default function AccountHeader({ refreshTrigger = 0 }) {
  const [showMsg, setShowMsg] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    username: 'MEMBERNNGBKUGJ',
    user_id: '1934924',
    last_login: '2025-10-16 09:33:39'
  });
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const msgRef = useRef(null);

  // Fetch balance and user data on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchBalance();
    fetchUserData();
  }, [refreshTrigger]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching balance in Banner...');
      const result = await walletAPI.getBalance();
      console.log('Banner Balance API result:', result);
      
      if (result.success && result.data.status === 'success') {
        console.log('Banner Balance fetched successfully:', result.data.data.balance);
        setBalance(result.data.data.balance);
      } else {
        console.error('Banner API Error:', result.data);
        setError('Failed to fetch balance');
        setBalance(0);
      }
    } catch (err) {
      console.error('Banner Error fetching balance:', err);
      setError('Error fetching balance');
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      setUserLoading(true);
      setUserError(null);
      
      console.log('Fetching user data in Banner...');
      const result = await userAPI.getProfile();
      console.log('User Profile API result:', result);
      
      if (result.success && result.data.status === 'success') {
        console.log('User data fetched successfully:', result.data.data);
        setUserData({
          username: result.data.data.username,
          user_id: result.data.data.user_id,
          last_login: result.data.data.last_login
        });
      } else {
        console.error('User API Error:', result.data);
        setUserError('Failed to fetch user data');
        // Keep default values on error
      }
    } catch (err) {
      console.error('Banner Error fetching user data:', err);
      setUserError('Error fetching user data');
      // Keep default values on error
    } finally {
      setUserLoading(false);
    }
  };

  // कॉपी फंक्शन
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userData.user_id);
      setShowMsg(true);
      setTimeout(() => setShowMsg(false), 500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // GSAP एनिमेशन
  useEffect(() => {
    if (showMsg && msgRef.current) {
      gsap.fromTo(
        msgRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [showMsg]);

  return (
    <div className="relative w-full bg-gradient-to-r from-[#f2dd9b] to-[#c4933f] text-white rounded-b-3xl shadow-lg font-sans pb-28">
      
      <div className="py-10 px-7 flex justify-start">
        <div className="flex justify-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
            <img src="/winningimgs/Avatar1.jpg" alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold leading-none">
                {userLoading ? 'Loading...' : userError ? 'Error' : userData.username}
              </h3>
              <img className="h-auto w-16" src="/Accountimg/Vip.webp" alt="" />
            </div>
            <div
              onClick={handleCopy}
              className="mt-2 text-xs text-white bg-[#dd9138] p-1 px-4 rounded-full inline-block cursor-pointer active:scale-95 transition-transform"
            >
              <span className="font-medium pr-2">UID</span>
              <span className="text-white pr-2">|</span>
              <span className="pr-1 select-none">
                {userLoading ? 'Loading...' : userError ? 'Error' : userData.user_id}
              </span>
              {/* <RiFileCopyLine className="inline text-sm" /> */}
              <i className="ri-file-copy-line text-sm"></i>
            </div>
            <div className="mt-2 text-sm text-white">
              Last login: <span className="text-white">
                {userLoading ? 'Loading...' : userError ? 'Error' : userData.last_login}
              </span>
            </div>
          </div>
        </div>
      </div>

   {/* Wallet dashboard */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
          <div className="bg-[#4d4d4c] rounded-xl shadow-md p-4 h-48 w-full">
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
              <button className="mt-2 bg-gradient-to-r from-[#f2dd9b] to-[#c4933f] text-white text-md font-semibold px-7 py-1.5 rounded-full hover:opacity-90 transition">
                Enter Wallet
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 pt-4 text-center text-md text-white">
              {walletItems.map((item, index) => (
                <a key={index} href={item.link} className="flex flex-col items-center hover:scale-110 transition-transform">
                  <img src={item.src} alt={item.alt} className="w-10 h-10 mb-1" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
      </div>


      {/* GSAP Popup */}
      {showMsg && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div ref={msgRef} className="bg-black bg-opacity-70 text-white text-sm px-6 py-3 rounded-lg shadow-lg flex flex-col items-center gap-2">
            {/* <RiCheckLine className="text-green-400 text-2xl" /> */}
            <i className="ri-check-line text-green-400 text-2xl"></i>
            <span>Copy Successful</span>
          </div>
        </div>
      )}
    </div>
  );
}