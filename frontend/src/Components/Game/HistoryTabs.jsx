import React from 'react';

const HistoryTabs = ({ activeTab, onSelect }) => {
  const tabs = [
    { id: 'game', name: 'Game history' },
    { id: 'my', name: 'My history' },
  ];
  return (
    <div className="flex bg-[#1e1e1e] p-4 pt-2">
      <div className="flex w-full bg-gray-900 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`w-1/2 py-4 rounded-md text-sm sm:text-base font-semibold transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-[#f2dd9b] to-[#dbb768] text-amber-700 shadow-inner' 
                : 'text-gray-400 hover:text-white'
              }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryTabs;