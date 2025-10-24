import React from 'react';

const popularGamesData = [
  { id: 1, name: 'Ludo King', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/121.png', rtp: '97.39%' },
  { id: 2, name: 'Win Go 30S', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/ARLottery/WinGo_30S_20250812193414816.png', rtp: '97.4%' },
  { id: 3, name: 'Rummy', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/800.png', rtp: '97.78%' },
  { id: 4, name: 'Aviator', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/SPRIBE/22001.png', rtp: '97.2%' },
  { id: 5, name: 'Dragon Tiger', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/123.png', rtp: '97.49%' },
  { id: 6, name: 'Andar Bahar', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/124.png', rtp: '97.41%' },
  { id: 7, name: 'Super Ace', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/51.png', rtp: '97.72%' },
  { id: 8, name: 'Fortune Gems', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/109.png', rtp: '96.94%' },
  { id: 9, name: 'Crazy 777', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/223.png', rtp: '97.75%' },
  { id: 10, name: 'Golden Land', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/200.png', rtp: '96.22%' },
  { id: 11, name: 'Jump High', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/CQ9/19.png', rtp: '96.96%' },
  { id: 12, name: 'Money Coming', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/197.png', rtp: '97.17%' },
  { id: 13, name: 'Golden Empire', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/49.png', rtp: '97.71%' },
  { id: 14, name: 'Crazy Hunter', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/32.png', rtp: '96.57%' },
  { id: 15, name: 'Thor X', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/27.png', rtp: '97.98%' },
  { id: 16, name: 'Mega Ace', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/35.png', rtp: '97.9%' },
  { id: 17, name: 'Lucky Goldbricks', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JDB/14027.png', rtp: '96.38%' },
  { id: 18, name: 'Pharaoh Treasure', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/47.png', rtp: '96.07%' },
  { id: 19, name: 'Mahjong Ways', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JDB/14036.png', rtp: '97.6%' },
  { id: 20, name: 'Neko Fortune', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/77.png', rtp: '97.09%' },
  { id: 21, name: 'Go Rush', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JDB/7001.png', rtp: '96.52%' },
  { id: 22, name: 'Magic Lamp', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/82.png', rtp: '97.42%' },
  { id: 23, name: 'Grand Wheel', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/EVO_Electronic/grandwheel000000.png', rtp: '96.46%' },
  { id: 24, name: 'Teen Patti', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/Card365/707.png', rtp: '96.18%' },
];

const PopularGames = () => {
  return (
    <div className="w-full max-w-[480px] p-3 bg-[#2c2c2e] rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Popular</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {popularGamesData.map((game) => (
          <a href="#" key={game.id} className="group space-y-2">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="win-odds-container text-xs font-semibold">
              <div className="flex justify-between text-gray-300 px-1">
                <span>RTP</span>
                <span>{game.rtp}</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1  overflow-hidden">
                <div
                  className="bg-gradient-to-r  from-yellow-400 to-orange-500 h-3.5 rounded-full"
                  style={{ width: game.rtp }}
                ></div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PopularGames;