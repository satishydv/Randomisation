import React, { useState, useEffect } from 'react';
import { gameAPI } from '../../utils/api';

const QueueStatus = ({ sessionId, onGameComplete }) => {
  const [status, setStatus] = useState('idle');
  const [playerCount, setPlayerCount] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [userResult, setUserResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    let interval;
    
    const checkStatus = async () => {
      try {
        // Check queue status
        const statusResponse = await gameAPI.getQueueStatus(sessionId);
        if (statusResponse.success) {
          setPlayerCount(statusResponse.data.user_count);
        }

        // Check for results
        const resultResponse = await gameAPI.getQueueResults(sessionId);
        if (resultResponse.success && resultResponse.data.status === 'completed') {
          setStatus('completed');
          setGameResult(resultResponse.data.game_result);
          
          // Get user-specific result
          const userResultResponse = await gameAPI.getUserResult(sessionId);
          if (userResultResponse.success && userResultResponse.data.status === 'completed') {
            setUserResult(userResultResponse.data.user_result);
          }
          
          if (onGameComplete) {
            onGameComplete(resultResponse.data);
          }
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Queue status check error:', err);
        setError('Failed to check queue status');
      }
    };

    if (sessionId) {
      setStatus('waiting');
      interval = setInterval(checkStatus, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionId, onGameComplete]);

  if (!sessionId) return null;

  return (
    <div className="bg-[#1e1e1e] rounded-lg p-4 text-white">
      <h4 className="text-lg font-semibold mb-2">Queue Status</h4>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            status === 'idle' ? 'bg-gray-600' :
            status === 'waiting' ? 'bg-yellow-600' :
            status === 'completed' ? 'bg-green-600' : 'bg-gray-600'
          }`}>
            {status.toUpperCase()}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Players:</span>
          <span>{playerCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Session ID:</span>
          <span className="text-xs text-gray-400">{sessionId}</span>
        </div>
        
        {gameResult && (
          <div className="mt-3 p-2 bg-green-900/30 border border-green-500 rounded">
            <p className="text-sm font-semibold text-green-400">Game Result:</p>
            <p className="text-xs">Number: {gameResult.number}</p>
            <p className="text-xs">Big/Small: {gameResult.big_small}</p>
            <p className="text-xs">Color: {gameResult.color}</p>
          </div>
        )}
        
        {userResult && (
          <div className={`mt-3 p-3 rounded-lg border ${
            userResult.isWinner 
              ? 'bg-green-900/30 border-green-500' 
              : 'bg-red-900/30 border-red-500'
          }`}>
            <p className={`text-sm font-semibold ${
              userResult.isWinner ? 'text-green-400' : 'text-red-400'
            }`}>
              {userResult.isWinner ? '🎉 You Won!' : '😞 You Lost'}
            </p>
            
            {userResult.result && (
              <div className="mt-2 space-y-1">
                {userResult.result.netProfit && (
                  <p className="text-xs text-green-300">
                    Profit: +₹{userResult.result.netProfit.toFixed(2)}
                  </p>
                )}
                {userResult.result.netLoss && (
                  <p className="text-xs text-red-300">
                    Loss: -₹{userResult.result.netLoss.toFixed(2)}
                  </p>
                )}
                {userResult.result.totalWinnings > 0 && (
                  <p className="text-xs text-yellow-300">
                    Winnings: ₹{userResult.result.totalWinnings.toFixed(2)}
                  </p>
                )}
                {userResult.result.totalBets > 0 && (
                  <p className="text-xs text-gray-300">
                    Total Bets: ₹{userResult.result.totalBets.toFixed(2)}
                  </p>
                )}
                {userResult.result.walletUpdated && (
                  <p className="text-xs text-green-300">✓ Wallet Updated</p>
                )}
                {!userResult.result.walletUpdated && userResult.result.walletDebug && (
                  <p className="text-xs text-red-300">
                    ⚠ {userResult.result.walletDebug.error}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-2 bg-red-900/30 border border-red-500 rounded text-red-200">
            <p className="text-xs">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueStatus;
