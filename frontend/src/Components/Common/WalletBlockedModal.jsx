import React from 'react';
import { X, Wallet, AlertTriangle } from 'lucide-react';

const WalletBlockedModal = ({ isOpen, onClose, onRecharge }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-[6000]">
      <div className="bg-[#2c2c2e] rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-red-500/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Wallet Blocked</h3>
          </div>
          {/* <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button> */}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Wallet className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your wallet has been blocked and you cannot access games at this time.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Please recharge your wallet to continue playing.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onRecharge}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Recharge Now
            </button>
            {/* <button
              onClick={onClose}
              className="px-4 py-3 bg-[#3f3f3f] text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button> */}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Need help? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletBlockedModal;
