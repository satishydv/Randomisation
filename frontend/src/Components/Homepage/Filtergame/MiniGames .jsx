import React from 'react';

// Mini Games ka poora data
const miniGamesData = [
  { id: 1, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/121.png' },
  { id: 2, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/800.png' },
  { id: 3, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/SPRIBE/22001.png' },
  { id: 4, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/123.png' },
  { id: 5, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/903.png' },
  { id: 6, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/124.png' },
  { id: 7, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/229.png' },
  { id: 8, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/900.png' },
  { id: 9, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/812.png' },
  { id: 10, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/811.png' },
  { id: 11, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/810.png' },
  { id: 12, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/505.png' },
  { id: 13, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/504.png' },
  { id: 14, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/503.png' },
  { id: 15, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/502.png' },
  { id: 16, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/501.png' },
  { id: 17, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/500.png' },
  { id: 18, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/119.png' },
  { id: 19, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/118.png' },
  { id: 20, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/115.png' },
  { id: 21, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/114.png' },
  { id: 22, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/113.png' },
  { id: 23, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/112.png' },
  { id: 24, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/111.png' },
  { id: 25, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/110.png' },
  { id: 26, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/109.png' },
  { id: 27, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/108.png' },
  { id: 28, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/107.png' },
  { id: 29, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/106.png' },
  { id: 30, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/105.png' },
  { id: 31, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/104.png' },
  { id: 32, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/103.png' },
  { id: 33, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/102.png' },
  { id: 34, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/101.png' },
  { id: 35, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/100.png' },
  { id: 36, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/224.png' },
  { id: 37, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/232.png' },
  { id: 38, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/233.png' },
  { id: 39, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/235.png' },
  { id: 40, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/JILI/236.png' },
  { id: 41, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/SPRIBE/22002.png' },
  { id: 42, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/SPRIBE/22003.png' },
  { id: 43, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/SPRIBE/22004.png' },
  { id: 44, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/SPRIBE/22005.png' },
  { id: 45, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/SPRIBE/22006.png' },
  { id: 46, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/SPRIBE/22007.png' },
  { id: 47, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/SPRIBE/22008.png' },
  { id: 48, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/804.png' },
  { id: 49, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/120.png' },
  { id: 50, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/TB_Chess/813.png' },
  { id: 51, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/Aviamasters.png' },
  { id: 52, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/DiceClash.png' },
  { id: 53, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/DragonsCrash.png' },
  { id: 54, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/EasterPlinko.png' },
  { id: 55, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/FishingClub.png' },
  { id: 56, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/FootballPlinko.png' },
  { id: 57, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/HeadsTails.png' },
  { id: 58, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/HeadsTailsXY.png' },
  { id: 59, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/Limbo.png' },
  { id: 60, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/MinesweeperXY.png' },
  { id: 61, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/MultihandBlackjackPro2.png' },
  { id: 62, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/Plinko.png' },
  { id: 63, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/Plinko2.png' },
  { id: 64, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/PlinkoXY.png' },
  { id: 65, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/RocketDice.png' },
  { id: 66, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/RocketDiceXY.png' },
  { id: 67, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/SpaceXY.png' },
  { id: 68, image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamelogo/BGAMING/WinterFishingClub.png' },
];

const MiniGames = () => {
  return (
    <div className="w-full max-w-[480px] p-3 bg-[#2c2c2e] rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Mini games</h2>
      <div className="grid grid-cols-4 sm:grid-cols-3 gap-3">
        {miniGamesData.map(game => (
          <a href="#" key={game.id} className="group">
            <img 
              src={game.image} 
              alt={`Mini Game ${game.id}`}
              className="w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default MiniGames;