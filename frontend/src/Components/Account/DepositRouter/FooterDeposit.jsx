import React, { useState } from 'react';
import { walletAPI } from '../../../utils/api';

const FooterDeposit = ({ selectedMethod = 'UPI-QRpay', selectedAmount = null, currencySymbol = '$', onDepositSuccess = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const isAmountSelected = selectedAmount !== null && selectedAmount !== undefined && selectedAmount !== '';

  const amountLabel = isAmountSelected
    ? `$${selectedAmount}`
    : 'Select amount';

  const handleDeposit = () => {
    if (!isAmountSelected || isLoading) return;

    setIsLoading(true);
    setMessage('');

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Please login first');
      }

      // Store the selected amount and method in localStorage for the transactions page
      localStorage.setItem('pendingDeposit', JSON.stringify({
        amount: selectedAmount,
        method: selectedMethod,
        timestamp: Date.now()
      }));

      setMessage('✅ Redirecting to payment...');
      
      // Redirect to transactions page
      setTimeout(() => {
        window.location.href = '/transactions';
      }, 1000);
    } catch (error) {
      console.error('Deposit error:', error);
      setMessage(`❌ Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-gray-900 z-40 rounded-t-xl">
      <div className="flex items-center justify-between p-3 max-w-lg mx-auto">
        <div>
          <p className="text-xs text-gray-200">Recharge Method:</p>
          <h2 className="text-lg font-bold text-white -mt-1">{selectedMethod}</h2>
          <p className="text-xs text-gray-300 mt-1">
            Amount: <span className="font-semibold text-white">{amountLabel}</span>
          </p>
        </div>

        <button
          onClick={handleDeposit}
          disabled={!isAmountSelected || isLoading}
          className={`
            py-3 px-5 rounded-lg font-bold shadow-md active:scale-95 transition-all
            ${isAmountSelected && !isLoading
              ? 'bg-gradient-to-r from-[#f2dd9b] to-[#c4933f] text-black'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? 'Processing...' : `Deposit ${isAmountSelected ? amountLabel : ''}`}
        </button>
      </div>
      
      {/* Message display */}
      {message && (
        <div className={`px-3 py-2 text-sm text-center ${
          message.includes('✅') ? 'text-green-400' : 'text-red-400'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FooterDeposit;
