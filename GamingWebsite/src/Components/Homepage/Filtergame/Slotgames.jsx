// src/components/SlotsGames.js
import React from 'react';

// Slots providers ka data
const slotsData = [
  {
    id: 1,
    name: 'JILI',
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_20240110062442t4sm.png',
  },
  {
    id: 2,
    name: 'Pragmatic Play',
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_20240110062430212b.png',
  },
  {
    id: 3,
    name: 'Hacksaw Gaming',
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_202401100624194vcv.png',
  },
  {
    id: 4,
    name: 'PG Soft',
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_2024011006235271p9.png',
  },
  {
    id: 5,
    name: 'Evolution Gaming',
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_20240110062318yniv.png',
  },
  {
    id: 6,
    name: 'NetEnt',
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_20250607151503ovxc.png',
  },
  {
    id: 7,
    name: 'Playtech',
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_20250830170151wibn.png',
  },
  {
    id: 8,
    name: 'Microgaming',
    image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/vendorlogo/vendorlogo_20241119134947rtqo.png',
  },
];

const SlotsGames = () => {
  return (
    <div className="w-full max-w-[480px] p-3 bg-[#2c2c2e] rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Slots</h2>
      <div className="grid grid-cols-2 gap-3">
        {slotsData.map((provider) => (
          <a
            href="#"
            key={provider.id}
            className="group block rounded-lg overflow-hidden bg-[#3f3f3f] shadow-md hover:shadow-yellow-400/20 transition-all duration-300"
          >
            <img
              src={provider.image}
              alt={provider.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SlotsGames;