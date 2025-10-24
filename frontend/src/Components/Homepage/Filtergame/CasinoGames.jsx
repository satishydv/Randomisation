import React from 'react';

// Casino providers ka data
const casinoData = [
  {
    id: 1,
    name: 'TP Casino',
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_20240110062454o17n.png',
  },
  {
    id: 2,
    name: 'Teenpatti Casino',
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_202506071514221ixw.png',
  },
];

const CasinoGames = () => {
  return (
    <div className="w-full max-w-[480px] p-3 bg-[#2c2c2e] rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Casino</h2>
      <div className="grid grid-cols-2 gap-3">
        {casinoData.map((provider) => (
          <a
            href="#"
            key={provider.id}
            className="group flex flex-col items-center text-center bg-[#3f3f3f] p-2 rounded-lg transition-all duration-300 hover:bg-gray-700"
          >
            <div className="w-full rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={provider.image}
                alt={provider.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-gray-300 text-sm mt-2 font-medium">{provider.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CasinoGames;