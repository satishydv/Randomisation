import React, { useState, useMemo } from 'react';
import { colorStyles } from './utils/gameData';
import CustomCheckbox from './CustomCheckbox';
import BetButton from './BetButton';
import { gameAPI } from '../../utils/api';

const BettingModal = ({ betType, betValue, gameName, onClose, selectedAmount, setSelectedAmount, onBetSuccess, gameType = '1' }) => {
  const [quantity, setQuantity] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [isAgreed, setIsAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Determine theme based on bet type and value
  const getTheme = () => {
    if (betType === 'color') {
      return colorStyles[betValue] || colorStyles.green;
    } else if (betType === 'number') {
      return colorStyles.green; // Default theme for numbers
    } else if (betType === 'bigSmall') {
      return betValue === 'big' ? colorStyles.yellow : colorStyles.blue;
    }
    return colorStyles.green;
  };

  const theme = getTheme();
  const totalAmount = useMemo(() => selectedAmount * quantity * multiplier, [selectedAmount, quantity, multiplier]);

  const handlePlaceBet = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const betData = {
        [betType]: {
          value: betValue,
          amount: totalAmount
        }
      };
      
      // First get the active session for this game type
      const sessionResponse = await gameAPI.getActiveSession(gameType);
      if (!sessionResponse.success) {
        setError('Failed to get active session');
        return;
      }
      
      // Then join the queue with the active session
      const response = await gameAPI.joinQueue(gameType, betData);
      
      if (response.success) {
        // Success - bet queued
        const successData = {
          type: betType,
          value: betValue,
          amount: totalAmount,
          quantity: quantity,
          multiplier: multiplier,
          queueId: response.data.queue_id,
          sessionId: response.data.session_id,
          processed: response.data.processed
        };
        
        onBetSuccess(successData);
        onClose();
      } else {
        setError(response.data.error || 'Failed to place bet');
      }
    } catch (err) {
      console.error('Bet placement error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 overflow-hidden p-4">
      <div className="w-full max-w-md bg-[#1e1e1e] rounded-t-2xl shadow-2xl animate-slide-up">
        <div className={`${theme.bg} rounded-t-2xl p-4 text-center relative`}>
          <h1 className="text-xl font-bold text-white">{gameName}</h1>
          <p className="text-sm text-white/80 mt-1">
            Select {betType === 'number' ? `Number ${betValue}` : 
                   betType === 'color' ? betValue.charAt(0).toUpperCase() + betValue.slice(1) :
                   betType === 'bigSmall' ? betValue.charAt(0).toUpperCase() + betValue.slice(1) : 'Bet'}
          </p>
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-white/70 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-red-200">
              <p className="font-semibold">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400 font-medium">Balance</span>
              <div className="flex gap-2">
                 {[1, 10, 100, 1000].map((val) => (
                   <BetButton 
                     key={val} 
                     isActive={selectedAmount === val} 
                     color={betValue} 
                     onClick={() => setSelectedAmount(val)}
                   >
                     {val}
                   </BetButton>
                 ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400 font-medium">Quantity</span>
              <div className="flex items-center gap-3">
                <span className="text-white font-bold text-lg">₹{totalAmount.toFixed(2)}</span>
                <div className="flex items-center bg-gray-800 rounded-md shadow-inner">
                  <button 
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} 
                    className={`${theme.text} text-2xl font-bold px-3 py-1`}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    readOnly 
                    className="w-12 sm:w-16 bg-transparent text-white text-center font-bold outline-none" 
                  />
                  <button 
                    onClick={() => setQuantity((prev) => prev + 1)} 
                    className={`${theme.text} text-2xl font-bold px-3 py-1`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

             <div className="grid grid-cols-6 gap-2">
               {[1, 5, 10, 20, 50, 100].map((val) => (
                 <BetButton 
                   key={val} 
                   isActive={multiplier === val} 
                   color={betValue} 
                   onClick={() => setMultiplier(val)}
                 >
                   X{val}
                 </BetButton>
               ))}
             </div>
          </div>

          <CustomCheckbox 
            isChecked={isAgreed} 
            onToggle={() => setIsAgreed(!isAgreed)} 
            label="I agree" 
            rulesText="《Pre-sale rules》" 
          />
        </div>

        <div className="flex p-3 border-t border-white/10">
          <button 
            onClick={onClose} 
            className="w-1/3 bg-gray-800 text-gray-400 font-bold py-3 rounded-lg shadow-inner mr-2"
          >
            Cancel
          </button>
          <button 
            disabled={!isAgreed || isSubmitting} 
            onClick={handlePlaceBet} 
            className={`w-2/3 ${theme.bg} text-white font-bold py-3 rounded-lg shadow-lg ${(!isAgreed || isSubmitting) && "opacity-50 cursor-not-allowed"}`}
          >
            {isSubmitting ? 'Placing Bet...' : `Total ₹${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BettingModal;