import React, { useState } from 'react';
import { walletAPI } from '../../../utils/api';

const FooterDeposit = ({ selectedMethod = 'UPI-QRpay', selectedAmount = null, currencySymbol = '$', onDepositSuccess = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const isAmountSelected = selectedAmount !== null && selectedAmount !== undefined && selectedAmount !== '';

  const amountLabel = isAmountSelected
    ? `${currencySymbol}${selectedAmount}`
    : 'Select amount';

  const handleDeposit = async () => {
    if (!isAmountSelected || isLoading) return;

    setIsLoading(true);
    setMessage('');

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Please login first');
      }

      // Generate reference ID
      const referenceId = `DEP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Make API call using walletAPI
      const result = await walletAPI.deposit(
        selectedAmount,
        `Wallet Deposit via ${selectedMethod}`,
        referenceId
      );

      if (result.success && result.data.status === 'success') {
        setMessage(`✅ Deposit successful! New balance: ${currencySymbol}${result.data.data.balance_after}`);
        
        // Trigger balance refresh in parent component
        if (onDepositSuccess) {
          onDepositSuccess();
        }
        
        // Optionally redirect to transactions page or refresh balance
        setTimeout(() => {
          window.location.href = '/transactions';
        }, 2000);
      } else {
        setMessage(`❌ ${result.data.message || 'Deposit failed'}`);
      }
    } catch (error) {
      console.error('Deposit error:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
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
