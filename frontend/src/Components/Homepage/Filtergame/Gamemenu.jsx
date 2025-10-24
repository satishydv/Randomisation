import React from 'react';

const GameMenu = ({ onCategoryClick, activeCategory }) => {
  const gameCategories = [
    {
      name: 'Lottery',
      image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamecategory/gamecategory_202401100619315n2k.png',
      bgImage: '/newproject/bgofonecontainer.webp',
    },
    {
      name: 'Original',
      image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamecategory/gamecategory_20240110061847fevc.png',
      bgImage: '/newproject/bgofonecontainer.webp',
    },
    {
      name: 'Slots',
      image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamecategory/gamecategory_20240110061937gbid.png',
      bgImage: '/newproject/bgofonecontainer.webp',
    },
    {
      name: 'Sports',
      image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamecategory/gamecategory_20240110061915xrqy.png',
    },
    {
      name: 'Popular',
      image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamecategory/gamecategory_202401100619464x51.png',
      isPopular: true,
    },
    {
      name: 'Casino',
      image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamecategory/gamecategory_20240110061909hwqs.png',
    },
    {
      name: 'Rummy',
      image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamecategory/gamecategory_20240110061902xb6m.png',
      bgImage: '/newproject/bgofonecontainer.webp',
    },
    {
      name: 'Fishing',
      image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/gamecategory/gamecategory_20240110061856jkxn.png',
      bgImage: '/newproject/bgofonecontainer.webp',
    },
  ];

  const box2Style = {
    backgroundImage: `url('/newproject/third_bg.webp')`,
  };

  return (
    <div className="game_menu w-full max-w-[480px] p-3 bg-[#212121] rounded-b-lg shadow-inner">
      <div className="grid grid-cols-3 gap-3">
        {gameCategories.slice(0, 3).map((category) => (
          <button
            onClick={() => onCategoryClick(category.name)}
            key={category.name}
            style={{ backgroundImage: `url(${category.bgImage})` }}
            // CHANGE: 'group' class add ki gayi hai
            className={`group relative flex flex-col items-center justify-end pb-2 rounded-lg bg-cover bg-center h-30 pt-5 transition-all duration-300 focus:outline-none hover:-translate-y-1
              ${activeCategory === category.name ? 'ring-2 ring-yellow-400 scale-105 shadow-lg' : 'ring-0'}`}
          >
            <img
              src={category.image}
              alt={category.name}
              // CHANGE: Hover effect ke liye classes add ki gayi hain
              className="absolute -top-4 w-26 h-26 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-black text-sm font-bold">{category.name}</span>
          </button>
        ))}

        <div
          style={box2Style}
          className="col-span-3 flex justify-around p-3 rounded-lg bg-cover bg-center"
        >
          {gameCategories.slice(3, 6).map((category) => (
            <button
              onClick={() => onCategoryClick(category.name)}
              key={category.name}
              // CHANGE: 'group' class add ki gayi hai
              className={`group flex flex-col items-center w-[30%] transition-transform duration-300 focus:outline-none ${category.isPopular ? 'relative' : ''}
                ${activeCategory === category.name ? 'scale-110' : ''}`}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                // CHANGE: Hover effect ke liye classes add ki gayi hain
                className="w-26 h-26 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent my-1"></div>
              <span className="text-black text-sm font-bold">{category.name} </span>
              {category.isPopular && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1 rounded-bl py-[1px] font-bold">
                  HOT
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-3 col-span-3">
          {gameCategories.slice(6, 8).map((category) => (
            <button
              onClick={() => onCategoryClick(category.name)}
              key={category.name}
              style={{ backgroundImage: `url(${category.bgImage})` }}
              // CHANGE: 'group' class add ki gayi hai
              className={`group flex items-center justify-center p-2 rounded-lg bg-cover bg-center h-28 transition-all duration-300 focus:outline-none gap-2
                ${activeCategory === category.name ? 'ring-2 ring-yellow-400 scale-105 shadow-lg' : 'ring-0'}`}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                // CHANGE: Hover effect ke liye classes add ki gayi hain
                className="w-32 h-32 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-black text-md font-bold text-center">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameMenu;