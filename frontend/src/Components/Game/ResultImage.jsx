import React from 'react';

const ResultImage = ({ path }) => {
  const altNum = path.split('_').pop()?.split('.')[0] || 'ball';
  return (
    <img 
      src={path} 
      alt={`Ball ${altNum}`} 
      className="w-8 h-8"
      onError={(e) => { 
        e.target.onerror = null; 
        e.target.src = `https://placehold.co/32x32/222/fff?text=${altNum}`; 
      }}
    />
  );
};

export default ResultImage;