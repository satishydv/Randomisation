import React, { useState, useEffect } from 'react';

// Yeh CSS component aapke diye gaye HTML classes ko style karega
const ResultModalCss = () => (
  <style>{`
    .result-modal-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 70;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .winning-modal {
      position: relative;
      width: 90%;
      max-width: 380px;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* --- YEH NAYA STRUCTURE HAI --- */
    .winning-body-container {
      position: relative;
      width: 100%;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
    
    .winning-body-container > img {
      display: block;
      width: 100%;
      height: auto;
    }
    
    .winning-content-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: space-between; /* Content ko upar neeche stretch karega */
      padding: 24px;
      text-align: center;
    }
    /* --- END NAYA STRUCTURE --- */

    .winning-wrap-l1 {
      font-size: 2.25rem; /* 36px */
      font-weight: 700;
      line-height: 1.2;
      color: #fff; /* Ensuring text is white on image */
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      margin-top: 20%; /* Content ko thoda neeche kiya */
    }
    
    .winning-wrap-l2 {
      margin-top: 16px;
    }

    .winner_box {
      background: rgba(0, 0, 0, 0.25); /* Thoda dark background text ke liye */
      border-radius: 12px;
      padding: 16px;
      backdrop-filter: blur(2px); /* Background image ko blur karega */
    }
    .winner_box > span {
      font-size: 0.875rem; /* 14px */
      color: #d1d5db; /* gray-300 */
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .winner_result {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 12px;
      font-size: 1.125rem; /* 18px */
      font-weight: 700;
    }
    
    /* Result ke colors ke liye Dynamic classes */
    .winner_result .color_red { color: #f87171; } /* red-400 */
    .winner_result .color_green { color: #4ade80; } /* green-400 */
    .winner_result .color_violet { color: #c084fc; } /* violet-400 */
    
    .winner_result > div {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .winning-wrap-l3 {
      margin-top: 20px;
    }
    
    .winning-wrap-l3 .isLose,
    .winning-wrap-l3 .isWin {
      font-size: 1.5rem; /* 24px */
      font-weight: 700;
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    .winning-wrap-l3 .isWin {
      color: #fef08a; /* yellow-200 */
    }
    .winning-wrap-l3 .isLose {
      color: #e5e7eb; /* gray-200 */
    }

    .gameDetail {
      font-size: 0.875rem; /* 14px */
      color: #d1d5db; /* gray-300 */
    }
    .gameDetail p {
      font-size: 0.875rem; /* 14px */
      color: #e5e7eb; /* gray-200 */
      margin-top: 4px;
      font-weight: 500;
    }

    .winning-wrap-l4 {
      margin-top: 20px;
      font-size: 0.875rem; /* 14px */
      color: #e5e7eb; /* gray-200 */
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      text-shadow: 0 1px 2px rgba(0,0,0,0.4);
    }
    
    .winning-wrap-l4 input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: #f2dd9b;
    }
    
    .closeBtn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.2s;
      z-index: 10;
    }
    .closeBtn:hover {
      background-color: rgba(0, 0, 0, 0.4);
    }
    .closeBtn::before,
    .closeBtn::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 14px;
      height: 2px;
      background-color: white;
      transform-origin: center;
    }
    .closeBtn::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    .closeBtn::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  `}
  </style>
);

const ResultModal = ({ gameName, period, gameResult, userResult, onClose }) => {
  const [countdown, setCountdown] = useState(3);
  // Naya State: Checkbox ko control karne ke liye
  const [isAutoClose, setIsAutoClose] = useState(true);

  useEffect(() => {
    let interval;
    let timer;

    if (isAutoClose) {
      // 3 second ka auto-close timer (sirf agar checkbox checked hai)
      interval = setInterval(() => {
        setCountdown(prev => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      timer = setTimeout(() => {
        onClose();
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timer) clearTimeout(timer);
    };
  }, [onClose, isAutoClose]); // Yeh effect 'isAutoClose' par depend karega

  // --- Result data taiyar karte hain ---
  const mainColor = gameResult.colors[0] || 'red';
  const colorName = mainColor.charAt(0).toUpperCase() + mainColor.slice(1);
  const colorClass = `color_${mainColor}`;
  
  // Naya image path logic
  const bgImage = userResult.isWin ? '/Gameimg/winmg.webp' : '/Gameimg/Looseimg.webp';
  // Fallback image agar load na ho
  const placeholder = userResult.isWin 
    ? 'https://placehold.co/400x550/dc2626/white?text=WIN'
    : 'https://placehold.co/400x550/374151/white?text=LOSE';


  return (
    <div className="result-modal-overlay">
      <ResultModalCss />
      
      <div className="winning-modal">
        
        {/* NOTE: Yahan par aapka Lottie/SVG animation player aayega jo sirf jeetne par dikhega */}
        {userResult.isWin && (
          <div className="winning-animation">
            {/* Abhi ke liye yeh khali hai */}
          </div>
        )}
        
        <div className="winning-body-container">
          {/* Background Image as <img> tag */}
          <img 
            src={bgImage} 
            alt={userResult.isWin ? 'Win' : 'Loss'} 
            onError={(e) => { e.target.onerror = null; e.target.src = placeholder; }}
          />

          {/* Content Wrapper (Positioned on top of image) */}
          <div className="winning-content-wrapper">
            <div className="winning-main">
              <div className="winning-wrap">
                
                {/* Line 1: Title (Jeet/Haar) */}
                <div className="winning-wrap-l1">
                  {userResult.isWin ? 'Congratulations!' : 'Sorry'}
                </div>
                
                {/* Line 2: Khel ka Result */}
                <div className="winning-wrap-l2">
                  <div className="winner_box">
                    <span>Lottery results</span>
                    <div className="winner_result">
                      <div className={colorClass}>
                        <span>{colorName}</span>
                      </div>
                      <div className={colorClass}>{gameResult.number}</div>
                      <div className={colorClass}>{gameResult.bs}</div>
                    </div>
                  </div>
                </div>
                
                {/* Line 3: Aapka P/L aur Period */}
                <div className="winning-wrap-l3">
                  <div className={userResult.isWin ? 'isWin' : 'isLose'}>
                    {userResult.isWin 
                      ? `Win +₹${userResult.profit.toFixed(2)}` 
                      : `Lose` // Aapne kaha tha "Lose" dikhana hai
                    }
                  </div>
                  <div className="gameDetail">
                    Period: {gameName}
                    <p>{period}</p>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Line 4: Auto-close timer aur Checkbox (ab neeche hai) */}
            <label className="winning-wrap-l4" htmlFor="autoCloseCheck">
              <input 
                id="autoCloseCheck"
                type="checkbox" 
                checked={isAutoClose} 
                onChange={() => setIsAutoClose(!isAutoClose)} 
              />
              {isAutoClose ? `${countdown} seconds auto close` : 'Auto close disabled'}
            </label>
          </div>
          
          {/* Close Button (Top Right) */}
          <div className="closeBtn" onClick={onClose}></div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;

