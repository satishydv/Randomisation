import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle } from 'lucide-react';
import gsap from 'gsap';

// --- Bonus Data Array ---
const bonusData = [
  { deposit: 200000, bonus: 10000.0 },
  { deposit: 100000, bonus: 5000.0 },
  { deposit: 30000, bonus: 2000.0 },
  { deposit: 10000, bonus: 600.0 },
  { deposit: 3000, bonus: 300.0 },
  { deposit: 1000, bonus: 150.0 },
  { deposit: 300, bonus: 60.0 },
  { deposit: 100, bonus: 20.0 },
];

// 💡 Custom Theme Colors
const customVars = {
  '--accent-color': '#ffc107',
  '--progress-bg': '#333333',
  '--progress-line': '#ff9900',
  '--dialog-bg': '#2a2a2a',
  '--item-bg': '#3c3c3c',
};

// --- Bonus Item Component ---
const BonusListItem = ({ deposit, bonus, currentDeposit = 0 }) => {
  const progress = Math.min(100, (currentDeposit / deposit) * 100);

  return (
    <div
      className="p-4 rounded-lg shadow-md first_list-item"
      style={{
        backgroundColor: customVars['--item-bg'],
        border: `1px solid ${customVars['--progress-bg']}`,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2 head">
        <div className="font-semibold text-lg text-white title">
          First deposit <span>{deposit.toLocaleString('en-IN')}</span>
        </div>
        <div
          className="font-bold text-xl  text-[#dbb768] "
        >
          + ₹{bonus.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
      </div>

      {/* Description */}
      <div className="text-sm text-gray-400 mb-3 description">
        Deposit {deposit.toLocaleString('en-IN')} for the first time and you will
        receive {bonus.toLocaleString('en-IN')} bonus
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 foot">
        <div
          className="relative flex-1 h-4 rounded-full progress"
          style={{ backgroundColor: customVars['--progress-bg'] }}
        >
          <div
            className="h-full rounded-full line"
            style={{
              backgroundColor: customVars['--progress-line'],
              width: `${progress}%`,
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white step">
            {currentDeposit}/{deposit.toLocaleString('en-IN')}
          </div>
        </div>

        <button
          className="px-4 py-1.5 text-black font-bold rounded-full bg-gradient-to-r from-[#f2dd9b] to-[#dbb768] shadow-md transition-colors btn n2"
   
        >
          Deposit
        </button>
      </div>
    </div>
  );
};

// --- Main Pop-up Component ---
const FirstDepositBonusDialog = ({ onClose }) => {
  const [noReminders, setNoReminders] = useState(false);
  const dialogRef = useRef(null);

  // 🎬 GSAP Animation (only popup scales, no screen darkening)
  useEffect(() => {
    const el = dialogRef.current;
    gsap.set(el, { scale: 0, opacity: 0 });
    gsap.to(el, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      delay: 2,
      ease: 'power3.out',
    });
  }, []);

  const handleActivityClick = () => {
    console.log('Navigating to Activity/Promotions page.');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[2001] pointer-events-none">
      {/* Only popup visible — no background overlay */}
      <div
        ref={dialogRef}
        className="relative w-[90%] max-w-sm h-96 rounded-xl shadow-2xl flex flex-col items-center van-dialog pointer-events-auto"
        style={{
          backgroundColor: customVars['--dialog-bg'],
          transformOrigin: 'center',
        }}
      >
        {/* Header */}
        <div className="van-dialog__header border-b border-gray-700 p-4">
          <div className="text-center header">
            <div className="text-xl font-bold text-white title">
              Extra first deposit bonus
            </div>
            <div className="text-sm text-gray-400 mt-1 tip">
              Each account can only receive rewards once
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 close"
        >
          <X size={24} />
        </button>

        {/* Scrollable Content */}
        <div id='scroll' className="van-dialog__content p-4 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4 container">
            {bonusData.map((item) => (
              <BonusListItem
                key={item.deposit}
                deposit={item.deposit}
                bonus={item.bonus}
                currentDeposit={0}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="van-dialog__footer p-4  border-t border-gray-700 flex justify-between items-center footer">
          <div
            onClick={() => setNoReminders(!noReminders)}
            className="flex items-center cursor-pointer text-sm text-gray-400 active"
          >
            <div role="checkbox" className="van-checkbox " aria-checked={noReminders}>
              <div
                className={`van-checkbox__icon van-checkbox__icon--round border ${
                  noReminders
                    ? 'bg-gradient-to-r from-[#f2dd9b] to-[#dbb768]'
                    : 'bg-gray-500 border-gray-400'
                }`}
              >
                <i className="van-badge__wrapper van-icon van-icon-success">
                  <CheckCircle
                    size={16}
                    className={`text-black ${noReminders ? 'opacity-100' : 'opacity-0'}`}
                  />
                </i>
              </div>
            </div>
            No more reminders today
          </div>

          <button
            onClick={handleActivityClick}
            className="px-5 py-2 ml-7  text-black font-bold rounded-full shadow-lg bg-gradient-to-r from-[#f2dd9b] to-[#dbb768] transition-colors btn"
           
          >
            Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstDepositBonusDialog;
