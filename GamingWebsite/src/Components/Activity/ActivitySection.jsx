import React from 'react';
import { Link } from 'react-router-dom';

const activities = [
  {
    title: "LUCKY 10 Days Recharge Bonus",
    imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_20250828203458g7i7.png",
    link: "/activity/1"
  },
  {
    title: "Lucky spin to win iPhone 16 PRO MAX",
    imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_20250227201046ni5t.jpg",
  },
  {
    title: "Invitation bonus",
    imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_2024050515381732s6.png",
  },
  {
    title: "30S/1 MINUTE LOTTERY GAME",
    imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_20240413224931qr21.png",
    link: "/activity/4"
  },
  {
    title: "Aviator Bonus",
    imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_20240502120432m8f3.png",
    link: "/activity/5"
  },
  {
    title: "Super Jackpot Coming",
    imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_202502111801285hey.jpeg",
    link: "/activity/6"
  },
  {
    title: "Unlimited Daily Cash Rebate",
    imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_20240110083259g1n2.png",
    link: "/activity/7"
  },
  {
    title: "Mystery Random Bonus",
    imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_20231125141026uw34.png",
    link: "/activity/8"
  }
];

const ActivitySection = () => {
  return (
    <div className="grid grid-cols-1  gap-6 p-7 bg-zinc-900">
      {activities.map((activity, index) => (
        <Link
          key={index}
          to={activity.link} 
          className="bg-zinc-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-transform duration-300"
        >
          {/* Image */}
          <img
            src={activity.imageSrc}
            alt={activity.title}
            className="w-full h-48 object-cover"
          />

          {/* Title below the image */}
          <div className="p-3 text-center">
            <h3 className="text-white font-semibold text-sm sm:text-base">
              {activity.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ActivitySection;
