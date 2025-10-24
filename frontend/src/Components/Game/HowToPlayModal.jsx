import React from 'react';

const HowToPlayModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] rounded-2xl max-w-lg w-full shadow-lg overflow-hidden animate-slide-up">
        <div className="bg-gradient-to-r from-[#f2dd9b] to-[#dbb768] p-4 text-center relative">
          <h2 className="text-xl font-bold text-[#975411]">How to Play</h2>
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-[#975411] hover:text-amber-800 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-4 text-white text-sm space-y-3 max-h-[60vh] overflow-y-auto">
          <p>30 seconds 1 issue, 25 seconds to order, 5 seconds waiting for the draw.. It opens all day. The total number of trade is 2880 issues.</p>
          <p>If you spend 100 to trade, after deducting 2 service fee, your contract amount is 98:</p>
          <p>1. Select green: if the result shows 1,3,7,9 you will get (98*2) 196; If the result shows 5, you will get (98*1.5) 147</p>
          <p>2. Select red: if the result shows 2,4,6,8 you will get (98*2) 196; If the result shows 0, you will get (98*1.5) 147</p>
          <p>3. Select violet: if the result shows 0 or 5, you will get (98*4.5) 441</p>
          <p>4. Select number: if the result is the same as the number you selected, you will get (98*9) 882</p>
          <p>5. Select big: if the result shows 5,6,7,8,9 you will get (98 * 2) 196</p>
          <p>6. Select small: if the result shows 0,1,2,3,4 you will get (98 * 2) 196</p>
        </div>

        <div className="flex justify-center p-3 border-t border-white/20">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-[#f2dd9b] to-[#dbb768] text-[#975411] font-bold px-6 py-2 rounded-xl shadow-md hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModal;