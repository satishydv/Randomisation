import React from 'react';

const GlobalStyles = () => (
  <style>{`
    @keyframes slide-up {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    .animate-slide-up { animation: slide-up 0.3s ease-out; }
    @keyframes pulse-zoom {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
    }
    .animate-pulse-zoom { animation: pulse-zoom 1s ease-in-out infinite; }
  `}</style>
);

export default GlobalStyles;