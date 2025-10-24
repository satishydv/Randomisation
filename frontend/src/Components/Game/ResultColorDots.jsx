import React from 'react';

const ResultColorDots = ({ colors }) => {
  return (
    <div className="flex items-center justify-center gap-1">
      {colors.map((color, index) => {
        let dotClass = "w-3 h-3 rounded-full ";
        if (color === 'red') dotClass += "bg-red-500";
        if (color === 'green') dotClass += "bg-green-500";
        if (color === 'violet') dotClass += "bg-violet-500";
        return <div key={index} className={dotClass}></div>;
      })}
    </div>
  );
};

export default ResultColorDots;