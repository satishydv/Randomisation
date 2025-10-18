import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const walletItems = [
  { name: "ARWallet", src: "/Accounticon/wallet.png", alt: "AR Wallet Icon", link: "" },
  { name: "Deposit", src: "/Accounticon/save-money.png", alt: "Deposit Icon", link: "/deposit" },
  { name: "Withdraw", src: "/Accounticon/credit-card.png", alt: "Withdraw Icon", link: "" },
  { name: "VIP", src: "/Accounticon/vip-card.png", alt: "VIP Icon", link: "" },
];

export default function AccountHeader({ balance = 28.00 }) {
  const [showMsg, setShowMsg] = useState(false);
  const msgRef = useRef(null);
  const uid = "19349024";

  // कॉपी फंक्शन
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(uid);
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
              <h3 className="text-lg font-semibold leading-none">MEMBERNNGBKUGJ</h3>
              <img className="h-auto w-16" src="/Accountimg/Vip.webp" alt="" />
            </div>
            <div
              onClick={handleCopy}
              className="mt-2 text-xs text-white bg-[#dd9138] p-1 px-4 rounded-full inline-block cursor-pointer active:scale-95 transition-transform"
            >
              <span className="font-medium pr-2">UID</span>
              <span className="text-white pr-2">|</span>
              <span className="pr-1 select-none">1934924</span>
              {/* <RiFileCopyLine className="inline text-sm" /> */}
              <i className="ri-file-copy-line text-sm"></i>
            </div>
            <div className="mt-2 text-sm text-white">
              Last login: <span className="text-white">2025-10-16 09:33:39</span>
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
                <p className="text-white text-2xl font-bold mt-1">${balance.toFixed(2)}</p>
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