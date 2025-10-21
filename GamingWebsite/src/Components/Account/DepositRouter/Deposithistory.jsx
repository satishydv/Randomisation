import React, { useState, useEffect } from 'react';
import { walletAPI } from '../../../utils/api';

const DepositHistory = () => {
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch only CREDIT transactions (deposits) with limit of 4
      const result = await walletAPI.getTransactions(4, 0, 'CREDIT');
      
      if (result.success && result.data.status === 'success') {
        console.log('Transactions data:', result.data.data);
        setTransactions(result.data.data);
      } else {
        console.error('API Error:', result.data);
        setError('Failed to fetch transactions');
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Error fetching transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="relative max-w-md mx-auto p-4 rounded-lg shadow-lg">
       {copied && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-black bg-opacity-70 text-white text-sm px-6 py-3 rounded-lg shadow-lg flex flex-col items-center gap-2">
            {/* <RiCheckLine className="text-green-400 text-2xl" /> */}
            <i className="ri-check-line text-green-400 text-2xl "></i>
            <span>Copy Successful</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-6 pb-2">
        <i className="ri-file-history-fill text-2xl text-[#c4933f]"></i>
        <span className="text-xl font-semibold text-gray-50">Deposit history</span>
      </div>

      {/* Deposit List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading transactions...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-400">Error: {error}</div>
            <button 
              onClick={fetchTransactions}
              className="mt-2 px-4 py-2 bg-[#c4933f] text-white rounded hover:opacity-90"
            >
              Retry
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400">No deposit history found</div>
          </div>
        ) : (
          transactions.map((transaction) => {
            // Ensure we have valid transaction data
            if (!transaction || !transaction.id) {
              return null;
            }
            
            return (
            <div
              key={transaction.id}
              className="bg-[#4d4d4c] p-4 rounded-lg shadow"
            >
              {/* Title & Status Row */}
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 mb-2">
                <div className="text-base font-medium bg-green-500 rounded p-1 px-4">
                  {transaction.transaction_type}
                </div>
                <div className="flex items-center">
                  <div className="text-md font-semibold text-[#c4933f] mr-2">
                    {transaction.status}
                  </div>
                  <i className="ri-arrow-right-s-line"></i>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-lg">Amount</span>
                  <span className="font-medium text-[17px] text-[#c4933f]">
                    ${parseFloat(transaction.amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-lg">Payment Method</span>
                  <span className="text-gray-300 text-sm">{transaction.mode_of_payment || 'UPI'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-lg">Time</span>
                  <span className="text-gray-300 text-sm">
                    {new Date(transaction.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-lg">Description</span>
                  <span className="text-gray-300 text-sm">{transaction.description || 'Wallet Deposit'}</span>
                </div>
                {transaction.reference_id && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-lg">Reference ID</span>
                    <div className="flex items-center">
                      <span className="text-gray-300 text-xs mr-2">{transaction.reference_id}</span>
                      <i
                        onClick={() => handleCopy(transaction.reference_id)}
                        className="ri-file-copy-line text-sm text-gray-400 hover:text-[#c4933f] cursor-pointer"
                      ></i>
                    </div>
                  </div>
                )}
              </div>

              {/* Balance Info */}
              <div className="mt-3 p-2 bg-gray-700 rounded text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Balance Before: ${parseFloat(transaction.balance_before || 0).toFixed(2)}</span>
                  <span>Balance After: ${parseFloat(transaction.balance_after || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* FadeIn Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DepositHistory;
