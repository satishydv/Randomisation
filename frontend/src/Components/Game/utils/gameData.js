// All static game data

export const gameTabs = [
  { id: 1, name: "Win Go 30s", duration: 30 },
  { id: 2, name: "Win Go 1Min", duration: 60 },
  { id: 3, name: "Win Go 3Min", duration: 180 },
  { id: 4, name: "Win Go 5Min", duration: 300 },
];

export const numberDataMap = [
  { path: "/Gameimg/balls/ball_0.webp", colors: ['red', 'violet'], bs: 'Small' },
  { path: "/Gameimg/balls/ball_1.webp", colors: ['green'], bs: 'Small' },
  { path: "/Gameimg/balls/ball_2.webp", colors: ['red'], bs: 'Small' },
  { path: "/Gameimg/balls/ball_3.webp", colors: ['green'], bs: 'Small' },
  { path: "/Gameimg/balls/ball_4.webp", colors: ['red'], bs: 'Small' },
  { path: "/Gameimg/balls/ball_5.webp", colors: ['green', 'violet'], bs: 'Big' },
  { path: "/Gameimg/balls/ball_6.webp", colors: ['red'], bs: 'Big' },
  { path: "/Gameimg/balls/ball_7.webp", colors: ['green'], bs: 'Big' },
  { path: "/Gameimg/balls/ball_8.webp", colors: ['red'], bs: 'Big' },
  { path: "/Gameimg/balls/ball_9.webp", colors: ['green'], bs: 'Big' },
];

export const colorStyles = {
  green: { bg: "bg-green-600", text: "text-green-400" },
  red: { bg: "bg-red-600", text: "text-red-400" },
  violet: { bg: "bg-violet-600", text: "text-violet-400" },
  blue: { bg: "bg-blue-600", text: "text-blue-400" },
  yellow: { bg: "bg-yellow-500", text: "text-black" },
};

export const initialMyHistoryData = [
  { id: 1, period: '20251023100050635', selection: 'Green', amount: 100, result: 'Win', profit: 90 },
  { id: 2, period: '20251023100050634', selection: 'Big', amount: 1000, result: 'Loss', profit: -1000 },
  { id: 3, period: '20251023100050633', selection: 'Number 2', amount: 10, result: 'Win', profit: 88.20 },
  { id: 4, period: '20251023100050632', selection: 'Red', amount: 50, result: 'Loss', profit: -50 },
  { id: 5, period: '20251023100050631', selection: 'Small', amount: 200, result: 'Win', profit: 196 },
  { id: 6, period: '20251023100050630', selection: 'Violet', amount: 10, result: 'Loss', profit: -10 },
  { id: 7, period: '20251023100050629', selection: 'Green', amount: 100, result: 'Win', profit: 90 },
];

export const initialHistory30s = [
  { period: '20251023100050637', number: "/Gameimg/balls/ball_7.webp", bs: 'Big', colors: ['green'] },
  { period: '20251023100050636', number: "/Gameimg/balls/ball_4.webp", bs: 'Small', colors: ['red'] },
  { period: '20251023100050635', number: "/Gameimg/balls/ball_0.webp", bs: 'Small', colors: ['red', 'violet'] },
  { period: '20251023100050634', number: "/Gameimg/balls/ball_1.webp", bs: 'Small', colors: ['green'] },
  { period: '20251023100050633', number: "/Gameimg/balls/ball_2.webp", bs: 'Small', colors: ['red'] },
  { period: '20251023100050632', number: "/Gameimg/balls/ball_5.webp", bs: 'Big', colors: ['green', 'violet'] },
  { period: '20251023100050631', number: "/Gameimg/balls/ball_9.webp", bs: 'Big', colors: ['green'] },
];

export const initialHistory60s = [
  { period: '20251023200030127', number: "/Gameimg/balls/ball_6.webp", bs: 'Big', colors: ['red'] },
  { period: '20251023200030126', number: "/Gameimg/balls/ball_1.webp", bs: 'Small', colors: ['green'] },
  { period: '20251023200030125', number: "/Gameimg/balls/ball_5.webp", bs: 'Big', colors: ['green', 'violet'] },
  { period: '20251023200030124', number: "/Gameimg/balls/ball_8.webp", bs: 'Big', colors: ['red'] },
  { period: '20251023200030123', number: "/Gameimg/balls/ball_2.webp", bs: 'Small', colors: ['red'] },
  { period: '20251023200030122', number: "/Gameimg/balls/ball_0.webp", bs: 'Small', colors: ['red', 'violet'] },
  { period: '20251023200030121', number: "/Gameimg/balls/ball_4.webp", bs: 'Small', colors: ['red'] },
];

export const initialHistory180s = [
  { period: '20251023300010015', number: "/Gameimg/balls/ball_3.webp", bs: 'Small', colors: ['green'] },
  { period: '20251023300010014', number: "/Gameimg/balls/ball_5.webp", bs: 'Big', colors: ['green', 'violet'] },
  { period: '20251023300010013', number: "/Gameimg/balls/ball_7.webp", bs: 'Big', colors: ['green'] },
  { period: '20251023300010012', number: "/Gameimg/balls/ball_9.webp", bs: 'Big', colors: ['green'] },
  { period: '20251023300010011', number: "/Gameimg/balls/ball_0.webp", bs: 'Small', colors: ['red', 'violet'] },
  { period: '20251023300010010', number: "/Gameimg/balls/ball_2.webp", bs: 'Small', colors: ['red'] },
  { period: '20251023300010009', number: "/Gameimg/balls/ball_4.webp", bs: 'Small', colors: ['red'] },
];

export const initialHistory300s = [
  { period: '20251023400005007', number: "/Gameimg/balls/ball_6.webp", bs: 'Big', colors: ['red'] },
  { period: '20251023400005006', number: "/Gameimg/balls/ball_4.webp", bs: 'Small', colors: ['red'] },
  { period: '20251023400005005', number: "/Gameimg/balls/ball_2.webp", bs: 'Small', colors: ['red'] },
  { period: '20251023400005004', number: "/Gameimg/balls/ball_0.webp", bs: 'Small', colors: ['red', 'violet'] },
  { period: '20251023400005003', number: "/Gameimg/balls/ball_1.webp", bs: 'Small', colors: ['green'] },
  { period: '20251023400005002', number: "/Gameimg/balls/ball_3.webp", bs: 'Small', colors: ['green'] },
  { period: '20251023400005001', number: "/Gameimg/balls/ball_5.webp", bs: 'Big', colors: ['green', 'violet'] },
];