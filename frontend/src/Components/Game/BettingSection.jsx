import React, { useState } from 'react';
import { colorStyles } from './utils/gameData';
import BettingModal from './BettingModal';
import { useGameContext } from '../../contexts/GameContext';

// 'onBetSuccess' aur 'betSuccess' ko props se liya ja raha hai
const BettingSection = ({ activeTab, activeTimerValue, onBetSuccess, betSuccess }) => {
  const [openModal, setOpenModal] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(1);
  const { addBet, getTabBets } = useGameContext();
  
  // 'betSuccess' state yahan se hata diya gaya hai

  const isBettingLocked = activeTimerValue <= 5;

  const colors = [
    { name: "Green", color: "green" },
    { name: "Violet", color: "violet" },
    { name: "Red", color: "red" }
  ];
  const balls = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    src: `/Gameimg/balls/ball_${i}.webp`
  }));

  // 'showBetSuccess' function ki ab zaroorat nahi, 'onBetSuccess' ka istemaal hoga

  const handleBetClick = (betType, betValue) => {
    if (!isBettingLocked) {
      setOpenModal({ type: betType, value: betValue });
    }
  };

  const handleBetSuccess = (betData) => {
    // Add bet to context
    addBet(activeTab.id, betData.type, betData);
    onBetSuccess();
  };

  return (
    <div className="bg-[#1e1e1e] rounded-2xl shadow-md p-5 text-white space-y-4 overflow-hidden relative">
      {isBettingLocked && activeTimerValue > 0 && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 rounded-2xl pointer-events-none">
          <span className="text-white text-6xl sm:text-[8rem] font-bold animate-pulse-zoom">
            {activeTimerValue}
          </span>
        </div>
      )}

      {/* Ab yeh 'betSuccess' prop par depend karta hai */}
      {betSuccess && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white font-bold text-sm py-4 px-6 rounded-lg shadow-lg z-30">
          Bet Successful
        </div>
      )}

      {/* Color Buttons */}
      <div className="flex justify-between text-center font-semibold text-base">
        {colors.map((c) => (
          <button
            key={c.name}
            disabled={isBettingLocked}
            className={`flex-1 mx-1 py-2 rounded-lg ${colorStyles[c.color].bg} transition ${
              isBettingLocked ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
            }`}
            onClick={() => handleBetClick('color', c.color)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Balls */}
      <div className="grid grid-cols-5 gap-2 mt-2">
        {balls.map((ball) => (
          <button
            key={ball.id}
            disabled={isBettingLocked}
            onClick={() => handleBetClick('number', ball.id)}
            className={`flex items-center justify-center bg-[#222] rounded-lg transition h-20 ${
              isBettingLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-[#333]"
            }`}
          >
            <img
              src={ball.src}
              alt={`Ball ${ball.id}`}
              className="w-16 h-16 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/64x64/222/fff?text=${ball.id}`;
              }}
            />
          </button>
        ))}
      </div>

      {/* Big / Small */}
      <div className="flex justify-between mt-4">
        <button
          disabled={isBettingLocked}
          className={`w-[48%] py-3 rounded-lg font-bold text-lg bg-yellow-500 text-black transition ${
            isBettingLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600"
          }`}
          onClick={() => handleBetClick('bigSmall', 'big')}
        >
          Big
        </button>
        <button
          disabled={isBettingLocked}
          className={`w-[48%] py-3 rounded-lg font-bold text-lg bg-blue-600 transition ${
            isBettingLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          onClick={() => handleBetClick('bigSmall', 'small')}
        >
          Small
        </button>
      </div>

      {openModal && (
        <BettingModal
          betType={openModal.type}
          betValue={openModal.value}
          gameName={activeTab.name}
          gameType={activeTab.id.toString()}
          onClose={() => setOpenModal(null)}
          selectedAmount={selectedAmount}
          setSelectedAmount={setSelectedAmount}
          onBetSuccess={handleBetSuccess}
        />
      )}
    </div>
  );
};

export default BettingSection;
