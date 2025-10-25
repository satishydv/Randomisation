import React from 'react';

const GameResultModal = ({ isOpen, onClose, userResult, gameResult }) => {
  if (!isOpen || !userResult) return null;

  const isWinner = userResult.isWinner;
  const result = userResult.result;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-[#1e1e1e] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className={`${isWinner ? 'bg-green-600' : 'bg-red-600'} rounded-t-2xl p-6 text-center`}>
          <div className="text-6xl mb-2">
            {isWinner ? '🎉' : '😞'}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isWinner ? 'Congratulations!' : 'Better Luck Next Time!'}
          </h2>
          <p className="text-white/80 mt-1">
            {isWinner ? 'You Won!' : 'You Lost'}
          </p>
        </div>

        {/* Game Result */}
        {gameResult && (
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Game Result</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-800 rounded p-2">
                <p className="text-xs text-gray-400">Number</p>
                <p className="text-lg font-bold text-white">{gameResult.number}</p>
              </div>
              <div className="bg-gray-800 rounded p-2">
                <p className="text-xs text-gray-400">Big/Small</p>
                <p className="text-lg font-bold text-white">{gameResult.big_small}</p>
              </div>
              <div className="bg-gray-800 rounded p-2">
                <p className="text-xs text-gray-400">Color</p>
                <p className="text-lg font-bold text-white">{gameResult.color}</p>
              </div>
            </div>
          </div>
        )}

        {/* User Result */}
        {result && (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Your Result</h3>
            
            <div className="space-y-3">
              {/* Profit/Loss */}
              {result.netProfit && (
                <div className="bg-green-900/30 border border-green-500 rounded-lg p-3">
                  <p className="text-green-400 font-semibold">Profit</p>
                  <p className="text-2xl font-bold text-green-300">+₹{result.netProfit.toFixed(2)}</p>
                </div>
              )}
              
              {result.netLoss && (
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-3">
                  <p className="text-red-400 font-semibold">Loss</p>
                  <p className="text-2xl font-bold text-red-300">-₹{result.netLoss.toFixed(2)}</p>
                </div>
              )}

              {/* Bet Details */}
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 text-sm mb-2">Bet Details</p>
                <div className="space-y-1">
                  {result.totalBets > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Bets:</span>
                      <span className="text-white">₹{result.totalBets.toFixed(2)}</span>
                    </div>
                  )}
                  {result.totalWinnings > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Winnings:</span>
                      <span className="text-green-400">₹{result.totalWinnings.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Wallet Status */}
              <div className={`rounded-lg p-3 ${
                result.walletUpdated 
                  ? 'bg-green-900/30 border border-green-500' 
                  : 'bg-red-900/30 border border-red-500'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`text-lg ${result.walletUpdated ? 'text-green-400' : 'text-red-400'}`}>
                    {result.walletUpdated ? '✓' : '⚠'}
                  </span>
                  <span className="text-sm font-medium">
                    {result.walletUpdated ? 'Wallet Updated' : 'Wallet Update Failed'}
                  </span>
                </div>
                {!result.walletUpdated && result.walletDebug && (
                  <p className="text-xs text-red-300 mt-1">
                    {result.walletDebug.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultModal;
