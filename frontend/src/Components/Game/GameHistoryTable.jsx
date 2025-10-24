import React from "react";

// Components for rendering
const ResultImage = ({ path }) => (
  <img src={path} alt="ball" className="w-10 h-10 mx-auto" />
);

const ResultColorDots = ({ colors }) => (
  <div className="flex justify-center gap-1">
    {colors.map((color, index) => (
      <span
        key={index}
        className={`w-3 h-3 rounded-full ${
          color === "red"
            ? "bg-red-600"
            : color === "green"
            ? "bg-green-600"
            : "bg-violet-600"
        }`}
      />
    ))}
  </div>
);

const GameHistoryTable = ({ historyData = [] }) => {
  return (
    <div className="text-gray-300 text-sm">
      {/* Header */}
      <div className="flex py-4 px-3 bg-gray-800 font-semibold">
        <div className="flex-none basis-10/24">Period</div>
        <div className="flex-none basis-5/24 text-center">Number</div>
        <div className="flex-none basis-5/24 text-center">Big Small</div>
        <div className="flex-none basis-4/24 text-center">Color</div>
      </div>

      {/* Body */}
      {historyData.length === 0 && (
        <div className="text-center text-gray-500 p-8">No history yet.</div>
      )}
      {historyData.slice(0, 7).map((item) => (
        <div
          key={item.period}
          className="flex items-center py-3 px-3 border-b border-gray-700 last:border-b-0"
        >
          <div className="flex-none basis-10/24 font-medium">{item.period}</div>
          <div className="flex-none basis-5/24 flex justify-center">
            <ResultImage path={item.number} />
          </div>
          <div className="flex-none basis-5/24 text-center font-medium">
            {item.bs}
          </div>
          <div className="flex-none basis-4/24 text-center">
            <ResultColorDots colors={item.colors} />
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="flex justify-between items-center p-3 text-gray-500 border-t border-gray-700">
        <button className="opacity-50 cursor-not-allowed">{"<"}</button>
        <span>1/50</span>
        <button className="hover:text-white">{">"}</button>
      </div>
    </div>
  );
};

export default GameHistoryTable;
