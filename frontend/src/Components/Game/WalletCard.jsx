import React, { useState, useEffect } from 'react';
// Icons
import { Wallet, Upload, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { walletAPI } from '../../utils/api';

function WalletCard({ refreshTrigger = 0 }) {
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
  
  // 1. Card ke background image ka style
  const cardStyle = {
    backgroundImage: "url('/Gameimg/walletbgs.webp')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    // 2. & 3. Centering hata di aur upar se padding de di
    <div className="bg-game-bg-dark p-4"> 
      
      <div 
        className="
          w-full max-w-lg mx-auto rounded-3xl p-5 shadow-2xl 
          flex flex-col gap-4
          text-white
          border border-white/10
        "
        style={cardStyle} // <-- 1. Yahaan background image apply ki
      >
        
        {/* L1: Balance Amount */}
        <div className="">
          <div className="text-3xl text-center font-bold text-white tracking-wider">
            {loading ? (
              <span className="text-gray-400">Loading...</span>
            ) : error ? (
              <span className="text-red-400">Error</span>
            ) : (
              `₹${balance.toFixed(2)}`
            )}
          </div>
        </div>

        {/* L2: Wallet Icon aur Label */}
        <div className=" flex items-center justify-center gap-2 text-gray-200 text-sm font-medium">
          <Wallet size={16} className="text-gray-200" />
          <div>Wallet balance</div>
        </div>

        {/* L3: Withdraw aur Deposit Buttons */}
        <div className="Wallet__C-balance-l3 grid grid-cols-2 gap-3 mt-2">
          
          {/* 4. Withdraw Button (Red background, White text) */}
       <Link to="/withdraw">
        <button 
            className="
              flex items-center justify-center gap-2 
              bg-red-600 text-white font-semibold  px-9
              py-3 rounded-full shadow-md
              transition-all hover:bg-opacity-80 active:scale-95
            "
          >
            <Download size={18} />
            Withdraw
          </button>
       </Link>  

          
          {/* 5. Deposit Button (Green background, White text) */}
       <Link to="/deposit">

          <button 
            className="
              flex items-center justify-center gap-4 
              bg-green-500 text-white font-bold  px-9
              py-3 rounded-full shadow-lg
              transition-all hover:bg-opacity-80 active:scale-95
            "
          >
            <Upload size={18} />
            Deposit
          </button>
       </Link>  


        </div>

      </div>
    </div>
  );
}

export default WalletCard;