import React from 'react';

// Fishing Games ka poora data
const fishingData = [
  { id: 1, name: 'Crazy Hunter', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/32.png' },
  { id: 2, name: 'Go Rush', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JDB/7001.png' },
  { id: 3, name: 'Fishing Disco', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JDB/7002.png' },
  { id: 4, name: 'Fishing Yilufa', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JDB/7003.png' },
  { id: 5, name: '5 Dragons Fishing', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JDB/7004.png' },
  { id: 6, name: 'Cai Shen Fishing', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JDB/7005.png' },
  { id: 7, name: 'Dragon Fishing', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JDB/7006.png' },
  { id: 8, name: 'Dragon Master', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JDB/7007.png' },
  { id: 9, name: 'Jackpot Fishing', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/1.png' },
  { id: 10, name: 'Dinosaur Tycoon', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/119.png' },
  { id: 11, name: 'Royal Fishing', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/20.png' },
  { id: 12, name: 'Bombing Fishing', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/42.png' },
  { id: 13, name: 'Happy Fishing', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/60.png' },
  { id: 14, name: 'Mega Fishing', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/71.png' },
  { id: 15, name: 'Dragon Treasure', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/74.png' },
  { id: 16, name: 'Magic Lamp', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/82.png' },
  { id: 17, name: 'All-star Fishing', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/212.png' },
  { id: 18, name: 'Dragon Fishing II', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JDB/7009.png' },
  { id: 19, name: 'Lucky Fishing', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JDB/7008.png' },
  { id: 20, name: 'Paradise', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/CQ9/AB3.png' },
  { id: 21, name: 'Paradise 2', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/CQ9/AT01.png' },
  { id: 22, name: 'Lustrous Ocean', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/CQ9/AT05.png' },
  { id: 23, name: 'Hero Fishing', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/CQ9/GO02.png' },
];


const FishingGames = () => {
  return (
    <div className="w-full max-w-[480px] p-3 bg-[#2c2c2e] rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Fishing</h2>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
        {fishingData.map(game => (
          <a href="#" key={game.id} className="group">
            <img 
              src={game.image} 
              alt={game.name}
              className="w-full rounded-lg transition-transform duration-300 group-hover:scale-105 shadow-md"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default FishingGames;