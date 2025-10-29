import React, { useState, useEffect, useRef } from 'react';

import Header from './Components/Homepage/Header';
import Banner from './Components/Homepage/Banner';
import NoticeBar from './Components/Homepage/NoticeBar';
import GameMenu from './Components/Homepage/Filtergame/Gamemenu';
import LotteryGames from './Components/Homepage/Filtergame/Lotterygames';
import MiniGames from './Components/Homepage/Filtergame/MiniGames ';
import SlotsGames from './Components/Homepage/Filtergame/Slotgames';
import SportsGames from './Components/Homepage/Filtergame/Sprotsdta';
import PopularGames from './Components/Homepage/Filtergame/PopularGames ';
import Member from './Components/Homepage/Member';
import CasinoGames from './Components/Homepage/Filtergame/CasinoGames';
import PvcGames from './Components/Homepage/Filtergame/PvcGames ';
import FishingGames from './Components/Homepage/Filtergame/FishingGames';
import WinningInfo from './Components/Homepage/Winninginfo';
import DailyEarnings from './Components/Homepage/DailyEarning';
import HorizontalNoticeBar from './Components/Homepage/NoticeBar';

const PlaceholderComponent = ({ categoryName }) => (
    <div className="w-full max-w-[480px] md:p-4 bg-[#2c2c2e] rounded-lg text-white text-center">
        <h2 className="text-xl font-bold">{categoryName}</h2>
        <p className="mt-4">The games for the {categoryName} category will be displayed here.</p>
    </div>
);

const Homepage = () => {
  const [activeCategory, setActiveCategory] = useState('Lottery');
  const isInitialRender = useRef(true);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    
    // Force scroll even if clicking the same category
    setTimeout(() => {
      const gameSection = document.getElementById('game-list-section');
      if (gameSection) {
        gameSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  
  useEffect(() => {
    // Only scroll on user clicks, not on initial page load
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const gameSection = document.getElementById('game-list-section');
    if (gameSection) {
      // Small delay to ensure the component has rendered
      setTimeout(() => {
        gameSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [activeCategory]);

  const renderGameComponent = () => {
    switch(activeCategory) {
      case 'Lottery':
        return <LotteryGames />;
      case 'Slots':
        return <SlotsGames />;
      case 'Original':
        return <MiniGames />;
      case 'Sports':
        return <SportsGames />;
        case 'Popular':
          return <PopularGames/>

          case 'Casino':
          return <CasinoGames/>

          case 'Rummy':
            return <PvcGames/>

            case 'Fishing':
            return <FishingGames/>
      default:
        return <PlaceholderComponent categoryName={activeCategory} />;
    }
  };

  return (
   <>
        <Header />
        <div className="space-y-0">
          <Banner />
          <HorizontalNoticeBar />
        <Member/>
        </div>
        <GameMenu 
          onCategoryClick={handleCategoryClick} 
          activeCategory={activeCategory} 
        />
        <div id="game-list-section" className="pt-4">
          {renderGameComponent()}
        </div>
        <WinningInfo/>
        <DailyEarnings/>
   </>

    
  );
};

export default Homepage;