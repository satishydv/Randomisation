import React, { useState, useEffect } from 'react';
import { gameAPI } from '../../utils/api';

const QueueSystem = ({ gameType = '1', onGameComplete }) => {
  const [sessionId, setSessionId] = useState(null);
  const [queueStatus, setQueueStatus] = useState('idle'); // idle, waiting, processing, completed
  const [playerCount, setPlayerCount] = useState(0);
  const [betData, setBetData] = useState({
    number: { value: 5, amount: 100 },
    color: { value: 'red', amount: 50 },
    bigSmall: { value: 'big', amount: 75 }
  });
  const [gameResult, setGameResult] = useState(null);
  const [error, setError] = useState(null);

  // Polling for queue status
  useEffect(() => {
    let interval;
    
    if (sessionId && queueStatus === 'waiting') {
      interval = setInterval(async () => {
        try {
          const response = await gameAPI.getQueueStatus(sessionId);
          if (response.success) {
            setPlayerCount(response.data.user_count);
            
            // Check if game is completed
            const resultResponse = await gameAPI.getQueueResults(sessionId);
            if (resultResponse.success && resultResponse.data.status === 'completed') {
              setQueueStatus('completed');
              setGameResult(resultResponse.data.game_result);
              if (onGameComplete) {
                onGameComplete(resultResponse.data);
              }
            }
          }
        } catch (err) {
          console.error('Queue status check error:', err);
        }
      }, 2000); // Check every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionId, queueStatus, onGameComplete]);

  const handleJoinQueue = async () => {
    try {
      setError(null);
      setQueueStatus('waiting');
      
      const response = await gameAPI.joinQueue(gameType, betData, sessionId);
      
      if (response.success) {
        if (response.data.processed) {
          setQueueStatus('completed');
          setGameResult(response.data.result);
          if (onGameComplete) {
            onGameComplete(response.data);
          }
        } else {
          setSessionId(response.data.session_id);
          setQueueStatus('waiting');
        }
      } else {
        setError(response.data.error || 'Failed to join queue');
        setQueueStatus('idle');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setQueueStatus('idle');
    }
  };

  const handleBetChange = (betType, field, value) => {
    setBetData(prev => ({
      ...prev,
      [betType]: {
        ...prev[betType],
        [field]: value
      }
    }));
  };

  const resetQueue = () => {
    setSessionId(null);
    setQueueStatus('idle');
    setPlayerCount(0);
    setGameResult(null);
    setError(null);
  };

  return (
    <div className="bg-[#1e1e1e] rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4">Multiplayer Queue System</h3>
      
      {/* Queue Status */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Status:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            queueStatus === 'idle' ? 'bg-gray-600' :
            queueStatus === 'waiting' ? 'bg-yellow-600' :
            queueStatus === 'processing' ? 'bg-blue-600' :
            queueStatus === 'completed' ? 'bg-green-600' : 'bg-gray-600'
          }`}>
            {queueStatus.toUpperCase()}
          </span>
        </div>
        
        {queueStatus === 'waiting' && (
          <div className="text-sm text-gray-300">
            Players in queue: {playerCount}
            <br />
            Session ID: {sessionId}
          </div>
        )}
      </div>

      {/* Betting Interface */}
      {queueStatus === 'idle' && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-3">Place Your Bets</h4>
          
          {/* Number Bet */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Number Bet</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="9"
                value={betData.number.value}
                onChange={(e) => handleBetChange('number', 'value', parseInt(e.target.value))}
                className="w-20 px-2 py-1 bg-gray-700 rounded text-white"
              />
              <input
                type="number"
                min="1"
                value={betData.number.amount}
                onChange={(e) => handleBetChange('number', 'amount', parseFloat(e.target.value))}
                className="w-24 px-2 py-1 bg-gray-700 rounded text-white"
                placeholder="Amount"
              />
            </div>
          </div>

          {/* Color Bet */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Color Bet</label>
            <div className="flex gap-2">
              <select
                value={betData.color.value}
                onChange={(e) => handleBetChange('color', 'value', e.target.value)}
                className="px-2 py-1 bg-gray-700 rounded text-white"
              >
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="violet">Violet</option>
              </select>
              <input
                type="number"
                min="1"
                value={betData.color.amount}
                onChange={(e) => handleBetChange('color', 'amount', parseFloat(e.target.value))}
                className="w-24 px-2 py-1 bg-gray-700 rounded text-white"
                placeholder="Amount"
              />
            </div>
          </div>

          {/* Big/Small Bet */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Big/Small Bet</label>
            <div className="flex gap-2">
              <select
                value={betData.bigSmall.value}
                onChange={(e) => handleBetChange('bigSmall', 'value', e.target.value)}
                className="px-2 py-1 bg-gray-700 rounded text-white"
              >
                <option value="big">Big</option>
                <option value="small">Small</option>
              </select>
              <input
                type="number"
                min="1"
                value={betData.bigSmall.amount}
                onChange={(e) => handleBetChange('bigSmall', 'amount', parseFloat(e.target.value))}
                className="w-24 px-2 py-1 bg-gray-700 rounded text-white"
                placeholder="Amount"
              />
            </div>
          </div>
        </div>
      )}

      {/* Game Result */}
      {gameResult && (
        <div className="mb-4 p-4 bg-green-900/30 border border-green-500 rounded-lg">
          <h4 className="text-lg font-semibold mb-2 text-green-400">Game Result</h4>
          <div className="text-sm">
            <p>Generated Number: {gameResult.generatedNumber}</p>
            <p>Outcome: {gameResult.outcome}</p>
            <p>Big/Small: {gameResult.bigSmall}</p>
            <p>Colors: {gameResult.colors?.join(', ')}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-200">
          <p className="font-semibold">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {queueStatus === 'idle' && (
          <button
            onClick={handleJoinQueue}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            Join Queue
          </button>
        )}
        
        {queueStatus === 'waiting' && (
          <button
            onClick={resetQueue}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium"
          >
            Leave Queue
          </button>
        )}
        
        {queueStatus === 'completed' && (
          <button
            onClick={resetQueue}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};

export default QueueSystem;
