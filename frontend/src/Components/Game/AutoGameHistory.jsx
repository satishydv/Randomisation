import React, { useEffect, useMemo, useState, useRef } from "react";
import GameHistoryTable from "./GameHistoryTable";
import {
  numberDataMap,
  getDurationByTab,
  buildPeriod,
  getYYYYMMDD,
  initialHistory30s,
  initialHistory60s,
  initialHistory180s,
  initialHistory300s
} from "./utils/gameData";

// Map tabId to initial dummy data
const initialHistoryMap = {
  1: initialHistory30s,
  2: initialHistory60s,
  3: initialHistory180s,
  4: initialHistory300s,
};

const AutoGameHistory = ({ tabId = 1 }) => {
  const duration = useMemo(() => getDurationByTab(tabId), [tabId]);

  const [timer, setTimer] = useState(duration);
  const [historyData, setHistoryData] = useState([]);
  const [periodCounter, setPeriodCounter] = useState(8); // next after 7
  const [periodDate, setPeriodDate] = useState(getYYYYMMDD());
  const timeoutRef = useRef(null);

  // Initialize history per tab
  useEffect(() => {
    const todayString = getYYYYMMDD(new Date());
    setPeriodDate(todayString);

    const initial = initialHistoryMap[tabId] || [];
    setHistoryData(initial);
    setPeriodCounter(initial.length + 1); // next counter after last dummy
    setTimer(getDurationByTab(tabId));

    return () => clearTimeout(timeoutRef.current);
  }, [tabId]);

  // Timer countdown loop
  useEffect(() => {
    if (timer > 0) {
      timeoutRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(timeoutRef.current);
    }

    // Timer hit 0 → generate next record
    generateNewTop();
    setTimer(duration);
  }, [timer, duration]);

  // Generate one new record and prepend at top, keep only 7
  const generateNewTop = () => {
    const todayString = getYYYYMMDD(new Date());
    let nextCounter = periodCounter;
    let dateForPeriod = new Date();

    // If date changed, reset
    if (todayString !== periodDate) {
      const fresh = initialHistoryMap[tabId] || [];
      setHistoryData(fresh);
      setPeriodDate(todayString);
      setPeriodCounter(fresh.length + 1);
      return;
    }

    // Normal case: add one new record
    const rnd = Math.floor(Math.random() * numberDataMap.length);
    const pick = numberDataMap[rnd];

    const newItem = {
      period: buildPeriod(nextCounter, dateForPeriod),
      number: pick.path,
      bs: pick.bs,
      colors: pick.colors,
    };

    setHistoryData((prev) => [newItem, ...prev.slice(0, 6)]); // max 7
    setPeriodCounter((c) => c + 1);
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-semibold text-white ">
        🕒 Next Result in: {timer}s
      </h2>
      <GameHistoryTable historyData={historyData} />
    </div>
  );
};

export default AutoGameHistory;
