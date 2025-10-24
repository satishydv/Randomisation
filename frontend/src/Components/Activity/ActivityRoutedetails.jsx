import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const activities = [
  { id: 1, imageSrc: "/Activitypageimg/1stimageactivity.jpg" },
  { id: 2, imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_20250227201046ni5t.jpg" },
  { id: 3, imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_2024050515381732s6.png" },
  { id: 4, imageSrc: "/Activitypageimg/Activity4router.jpeg" },
  { id: 5, imageSrc: "/Activitypageimg/ACtivity5Router.png" },
  { id: 6, imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_202502111801285hey.jpeg" },
  { id: 7, imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_20240110083259g1n2.png" },
  { id: 8, imageSrc: "https://ossimg.bdgadminbdg.com/IndiaBDG/banner/Banner_20231125141026uw34.png" },
];

const ActivityLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const activity = activities.find((a) => a.id === parseInt(id));

  const handleBack = () => navigate("/activity");

  return (
    <div className="bg-zinc-900 min-h-screen text-white">
      {/* ===== Fixed Header ===== */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-2 bg-[#3f3f3f] text-white z-50">
        <div className="px-4 py-2 flex justify-center items-center relative">
          <button onClick={handleBack}>
            <i className="ri-arrow-left-double-line text-3xl absolute left-3 top-3"></i>
          </button>
          <p className="text-2xl font-semibold">Activity Details</p>
        </div>
      </header>

      {/* ===== Main Section ===== */}
      <main className="pt-20 px-2 flex flex-col items-center">
        {/* Activity Image */}
        <img
          src={activity.imageSrc}
          alt={`Activity ${id}`}
          className="w-full max-w-3xl rounded-lg object-cover mb-6"
        />

        {/* ===== Only for ID 8 ===== */}
        {activity.id === 8 && (
          <div className="max-w-2xl bg-zinc-800 p-4 rounded-lg text-center">
            <h2 className="text-xl font-bold text-amber-400 mb-3">
              ❤️ Mystery Random Bonus
            </h2>

            <p className="text-gray-200 mb-4">
              ❤️ <span className="bg-amber-100 text-black font-black">Click To Follow Telegram Channel:</span>{" "}
              <a
                href="https://web.telegram.org/a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:text-blue-300"
              >
              https://web.telegram.org/a/
              </a>
            </p>

            <p className="text-gray-300 mb-3">
              ❤️ <span className="bg-amber-100 text-black font-black">Mystery Bonus 1:</span>{" "}
              Mystery bonus Rs 1–9,999,999 will be distributed randomly from
              time to time. The more active you are on the platform, the higher
              your engagement rate will be.
            </p>

            <p className="text-gray-300">
              ❤️ <span className="bg-amber-100 text-black font-black">Mystery Bonus 2:</span>{" "}
              Recharge in BDG Game — randomly draw a single recharge amount to
              give a multiple bonus of 1–10×! The time is not fixed. The more
              deposit times, the higher your chances to get it.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ActivityLayout;
