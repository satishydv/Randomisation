import React from 'react';

// PVC Games ka data
const pvcData = [
  {
    id: 1,
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_20240110062231cp7g.png',
  },
  {
    id: 2,
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_20240110062223jjaj.png',
  },
  {
    id: 3,
   
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_20250830170136ql3l.png',
  },
];

const PvcGames = () => {
  return (
    <div className="w-full max-w-[480px] p-3 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">PVC Games</h2>
      <div className="grid grid-cols-2 gap-1">
        {pvcData.map((provider) => (
          <a
            href="#"
            key={provider.id}
            className="group flex flex-col items-center   rounded-lg transition-all duration-300 "
          >
            <div className="w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={provider.image}
                alt={provider.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PvcGames;