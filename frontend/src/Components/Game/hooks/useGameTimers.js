import { useState, useEffect, useRef } from 'react';
import { gameTabs } from '../utils/gameData';

// Hook: Multi-tab timer + history periods
export default function useGameTimers() {
  const [timers, setTimers] = useState(() => {
    const initialTimers = {};
    gameTabs.forEach(tab => { initialTimers[tab.duration] = tab.duration; });
    return initialTimers;
  });

  const [periods, setPeriods] = useState(() => {
    const initialPeriods = {};
    gameTabs.forEach(tab => { initialPeriods[tab.duration] = 1; });
    return initialPeriods;
  });

  const intervalRefs = useRef({}); // har tab ka interval reference

  useEffect(() => {
    // Setup interval for each tab
    gameTabs.forEach(tab => {
      if (!intervalRefs.current[tab.duration]) {
        intervalRefs.current[tab.duration] = setInterval(() => {
          setTimers(prev => {
            const currentTime = prev[tab.duration];
            if (currentTime > 0) return { ...prev, [tab.duration]: currentTime - 1 };
            
            // Timer hit 0 → reset & increment period
            setPeriods(periodsPrev => ({
              ...periodsPrev,
              [tab.duration]: periodsPrev[tab.duration] + 1
            }));
            return { ...prev, [tab.duration]: tab.duration };
          });
        }, 1000);
      }
    });

    // Cleanup
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { timers, periods };
}
