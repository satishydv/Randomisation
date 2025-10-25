import React, { useState } from 'react';
import { gameAPI } from '../../utils/api';

const QueueTest = () => {
  const [gameType, setGameType] = useState('1');
  const [betData, setBetData] = useState({
    number: { value: 5, amount: 100 },
    color: { value: 'red', amount: 50 },
    bigSmall: { value: 'big', amount: 75 }
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forceLoading, setForceLoading] = useState(false);
  const [waitingStatus, setWaitingStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [checkLoading, setCheckLoading] = useState(false);

  const handleTestQueue = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing queue with:', { gameType, betData });
      
      // First get active session
      const sessionResponse = await gameAPI.getActiveSession(gameType);
      console.log('Active session response:', sessionResponse);
      
      if (!sessionResponse.success) {
        setError('Failed to get active session: ' + sessionResponse.data.error);
        return;
      }
      
      // Then join queue
      const response = await gameAPI.joinQueue(gameType, betData);
      
      console.log('Queue response:', response);
      
      if (response.success) {
        setResult({
          message: 'Queue test successful!',
          data: response.data,
          sessionId: sessionResponse.data.session_id
        });
      } else {
        setError(response.data.error || 'Queue test failed');
      }
    } catch (err) {
      console.error('Queue test error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForceProcess = async () => {
    setForceLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/game/force-process?game_type=${gameType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setResult({
          message: 'Queue force processed successfully!',
          data: data.data
        });
      } else {
        setError(data.error || 'Force process failed');
      }
    } catch (err) {
      console.error('Force process error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setForceLoading(false);
    }
  };

  const handleCheckWaitingStatus = async () => {
    setStatusLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/game/waiting-status?game_type=${gameType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setWaitingStatus(data.data);
      } else {
        setError(data.error || 'Failed to get waiting status');
      }
    } catch (err) {
      console.error('Waiting status error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleCheckAndProcess = async () => {
    setCheckLoading(true);
    setError(null);
    setCheckResult(null);

    try {
      const response = await fetch(`/api/game/check-and-process?game_type=${gameType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setCheckResult(data.data);
      } else {
        setError(data.error || 'Check and process failed');
      }
    } catch (err) {
      console.error('Check and process error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setCheckLoading(false);
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

  return (
    <div className="bg-[#1e1e1e] rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4">Queue System Test</h3>
      
      {/* Game Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Game Type:</label>
        <select
          value={gameType}
          onChange={(e) => setGameType(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 rounded text-white"
        >
          <option value="1">Number Game</option>
          <option value="2">Big/Small Game</option>
          <option value="3">Color Game</option>
        </select>
      </div>

      {/* Bet Data */}
      <div className="mb-4 space-y-3">
        <h4 className="text-lg font-semibold">Bet Data:</h4>
        
        {/* Number Bet */}
        <div className="flex gap-2">
          <label className="w-20 text-sm">Number:</label>
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

        {/* Color Bet */}
        <div className="flex gap-2">
          <label className="w-20 text-sm">Color:</label>
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

        {/* Big/Small Bet */}
        <div className="flex gap-2">
          <label className="w-20 text-sm">Big/Small:</label>
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

      {/* Test Button */}
      <div className="space-y-2">
        <button
          onClick={handleTestQueue}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold ${
            loading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Testing Queue...' : 'Test Queue System'}
        </button>
        
         <button
           onClick={handleForceProcess}
           disabled={forceLoading}
           className={`w-full py-3 px-4 rounded-lg font-semibold ${
             forceLoading 
               ? 'bg-gray-600 cursor-not-allowed' 
               : 'bg-red-600 hover:bg-red-700'
           }`}
         >
           {forceLoading ? 'Force Processing...' : 'Force Process Queue'}
         </button>
         
         <button
           onClick={handleCheckWaitingStatus}
           disabled={statusLoading}
           className={`w-full py-3 px-4 rounded-lg font-semibold ${
             statusLoading 
               ? 'bg-gray-600 cursor-not-allowed' 
               : 'bg-green-600 hover:bg-green-700'
           }`}
         >
           {statusLoading ? 'Checking...' : 'Check Waiting Status'}
         </button>
         
         <button
           onClick={handleCheckAndProcess}
           disabled={checkLoading}
           className={`w-full py-3 px-4 rounded-lg font-semibold ${
             checkLoading 
               ? 'bg-gray-600 cursor-not-allowed' 
               : 'bg-purple-600 hover:bg-purple-700'
           }`}
         >
           {checkLoading ? 'Checking...' : 'Check & Process'}
         </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-4 p-4 bg-green-900/30 border border-green-500 rounded-lg">
          <h4 className="text-lg font-semibold text-green-400 mb-2">Success!</h4>
          <pre className="text-sm text-green-200 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Waiting Status */}
      {waitingStatus && (
        <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-400 mb-2">Waiting Status</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Game Type:</span> {waitingStatus.game_type}</p>
            <p><span className="font-semibold">Waiting Count:</span> {waitingStatus.waiting_count}</p>
            <p><span className="font-semibold">User Count:</span> {waitingStatus.user_count}</p>
            <p><span className="font-semibold">Can Process:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                waitingStatus.can_process ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {waitingStatus.can_process ? 'YES' : 'NO'}
              </span>
            </p>
            <p><span className="font-semibold">Waiting Users:</span> {waitingStatus.waiting_users.join(', ')}</p>
            
            {waitingStatus.bets.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold mb-2">Waiting Bets:</p>
                {waitingStatus.bets.map((bet, idx) => (
                  <div key={idx} className="ml-4 p-2 bg-gray-800 rounded text-xs">
                    <p>User: {bet.user_id}</p>
                    <p>Bet: {bet.bet_data}</p>
                    <p>Created: {bet.created_at}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Check Result */}
      {checkResult && (
        <div className="mt-4 p-4 bg-purple-900/30 border border-purple-500 rounded-lg">
          <h4 className="text-lg font-semibold text-purple-400 mb-2">Check & Process Result</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Message:</span> {checkResult.message}</p>
            <p><span className="font-semibold">Processed:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                checkResult.processed ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {checkResult.processed ? 'YES' : 'NO'}
              </span>
            </p>
            {checkResult.participants && (
              <p><span className="font-semibold">Participants:</span> {checkResult.participants}</p>
            )}
            {checkResult.game_result_id && (
              <p><span className="font-semibold">Game Result ID:</span> {checkResult.game_result_id}</p>
            )}
            {checkResult.waiting_count && (
              <p><span className="font-semibold">Waiting Count:</span> {checkResult.waiting_count}</p>
            )}
            {checkResult.user_count && (
              <p><span className="font-semibold">User Count:</span> {checkResult.user_count}</p>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg">
          <h4 className="text-lg font-semibold text-red-400 mb-2">Error:</h4>
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
};

export default QueueTest;
