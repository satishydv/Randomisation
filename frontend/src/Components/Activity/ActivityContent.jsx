import React from "react";
import { Link } from "react-router-dom";

const contentItems = [
  {
    imageSrc: "/Activitypageimg/signInBanner.webp",
    title: "Gifts",
    description: "Enter the redemption code to receive gift rewards",
    link: "/Gift", // navigate yahan karega
  },
  {
    imageSrc: "/Activitypageimg/Atttendence.webp",
    title: "Attendance Bonus",
    description:
      "The more consecutive days you sign in, the higher the reward will be.",
    link: "/Bonus",
  },
];

const ActivityContent = () => {
  return (
    <div className="bg-zinc-900 p-4 rounded-lg flex gap-4 justify-center">
      {contentItems.map((item, index) => (
        <Link
          to={item.link}
          key={index}
          className="bg-zinc-800 rounded-lg w-1/2 hover:scale-105 hover:shadow-xl transition-transform duration-300"
        >
          {/* Image fills the width */}
          <img
            src={item.imageSrc}
            alt={item.title}
            className="w-full h-20 object-cover rounded-t-lg"
          />

          {/* Content below */}
          <div className="p-4 text-center">
            <h3 className="font-bold text-white text-lg">{item.title}</h3>
            <p className="text-sm text-zinc-400 mt-1">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ActivityContent;
