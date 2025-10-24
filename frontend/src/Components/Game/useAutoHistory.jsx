import { useState, useEffect } from 'react';
import { numberDataMap } from '../utils/gameData';

// Hook: Har tab ke liye auto history generate karne ke liye
export default function useAutoHistory(activeTab, activeTimerValue) {
  const [tabHistory, setTabHistory] = useState({}); // { tabId: [historyItems] }

  useEffect(() => {
    if (activeTimerValue === 0) {
      const randomIndex = Math.floor(Math.random() * numberDataMap.length);
      const randomResult = numberDataMap[randomIndex];
      const newPeriod = Date.now().toString().slice(0, 12);

      const newItem = {
        period: newPeriod,
        number: randomResult.path,
        bs: randomResult.bs,
        colors: randomResult.colors
      };

      setTabHistory(prev => {
        const prevHistory = prev[activeTab.id] || [];
        return {
          ...prev,
          [activeTab.id]: [newItem, ...prevHistory.slice(0, 6)] // top 7 results
        };
      });
    }
  }, [activeTimerValue, activeTab.id]);

  return tabHistory;
}
