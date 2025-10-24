import { numberDataMap } from './gameData';

export const getYYYYMMDD = () => {
  const today_date = new Date();
  const yyyy = today_date.getFullYear();
  const mm = String(today_date.getMonth() + 1).padStart(2, "0");
  const dd = String(today_date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
};

export const generateGameResult = () => {
  const num = Math.floor(Math.random() * 10);
  const result = numberDataMap[num];
  
  return {
    number: result.path,
    bs: result.bs,
    colors: result.colors
  };
};

export const formatTime = (secs) => {
  const totalSeconds = secs > 0 ? secs : 0;
  const mins = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};