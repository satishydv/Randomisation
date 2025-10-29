import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { walletAPI } from "../../../utils/api";
import WalletBlockedModal from "../../Common/WalletBlockedModal";

// --- UPDATED: Added ?tab=ID to links ---
const allLotteryGames = [
 { id: 1, name: "Win Go 30s", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062051do1k.png", category: "Win Go", link: "/win-30s?tab=1" },
 { id: 2, name: "Win Go 1Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062051do1k.png", category: "Win Go", link: "/win-30s?tab=2" },
 { id: 3, name: "Win Go 3Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062051do1k.png", category: "Win Go", link: "/win-30s?tab=3" },
 { id: 4, name: "Win Go 5Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062051do1k.png", category: "Win Go", link: "/win-30s?tab=4" },
 { id: 5, name: "5D 1Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062118e9kt.png", category: "5D" },
 { id: 6, name: "5D 3Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062118e9kt.png", category: "5D" },
 { id: 7, name: "5D 5Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062118e9kt.png", category: "5D" },
 { id: 8, name: "5D 10Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062118e9kt.png", category: "5D" },
 { id: 9, name: "K3 1Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062111bt8e.png", category: "K3" },
 { id: 10, name: "K3 3Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062111bt8e.png", category: "K3" },
 { id: 11, name: "K3 5Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062111bt8e.png", category: "K3" },
 { id: 12, name: "K3 10Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062111bt8e.png", category: "K3" },
 { id: 13, name: "Trx Win Go 1Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062124qut6.png", category: "Trx Win" },
 { id: 14, name: "Trx Win Go 3Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062124qut6.png", category: "Trx Win" },
 { id: 15, name: "Trx Win Go 5Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062124qut6.png", category: "Trx Win" },
 { id: 16, name: "MotoRace 1Min", image: "https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20250516054732w6gy.png", category: "MotoRace" },
];

const filterCategories = ["All", "Win Go", "MotoRace", "Trx Win", "K3", "5D"];

// --- Loader Overlay ---
const LoadingOverlay = ({ isVisible, message }) => {
 if (!isVisible) return null;
 return (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-[5000]">
   <div className="flex flex-col items-center text-white">
    <Loader2 size={36} className="animate-spin text-yellow-400" />
    <p className="mt-2 text-sm">{message}</p>
   </div>
  </div>
 );
};

const LotteryGames = () => {
 const [activeFilter, setActiveFilter] = useState("All");
 const [isLoading, setIsLoading] = useState(false);
 const [loadingMessage, setLoadingMessage] = useState("");
 const [showWalletBlockedModal, setShowWalletBlockedModal] = useState(false);
 const navigate = useNavigate();

 const filteredGames = useMemo(() => {
  if (activeFilter === "All") return allLotteryGames;
  return allLotteryGames.filter((g) => g.category === activeFilter);
 }, [activeFilter]);

 const checkWalletStatus = async () => {
  try {
   console.log('Checking wallet status...');
   const response = await walletAPI.getStatus();
   console.log('Wallet status response:', response);
   if (response.success) {
    console.log('Wallet is blocked:', response.data.is_blocked);
    return response.data.is_blocked;
   }
   console.log('API call failed, allowing access');
   return false;
  } catch (error) {
   console.error('Error checking wallet status:', error);
   return false;
  }
 };

 const handleGameClick = async (game) => {
  setLoadingMessage(`Loading ${game.name}...`);
  setIsLoading(true);

  try {
   // Check wallet status before allowing game access
   const isWalletBlocked = await checkWalletStatus();
   
   console.log('Game click - Wallet blocked result:', isWalletBlocked);
   
   if (isWalletBlocked) {
    console.log('Blocking game access due to wallet status');
    setIsLoading(false);
    setShowWalletBlockedModal(true);
    return;
   }

   console.log('Allowing game access - wallet not blocked');
   // Wait 1.2s before allowing navigation
   setTimeout(() => {
    setIsLoading(false);
    // routing handled in App.jsx — no navigate here
   }, 1200);
  } catch (error) {
   console.error('Error in game click handler:', error);
   setIsLoading(false);
  }
 };

 const handleRechargeClick = () => {
  setShowWalletBlockedModal(false);
  navigate('/account');
 };

 return (
  <div
   className="min-h-screen flex justify-center"
   style={{ backgroundColor: "#1c1c1e", fontFamily: "Inter, sans-serif" }}
  >
   <div className="p-3 bg-[#2c2c2e] rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold text-white mb-4 text-center">
     Lottery Games
    </h2>

    {/* Filter Tabs */}
    <div className="mb-4 overflow-x-auto">
     <div className="flex items-center space-x-2 pb-4">
      {filterCategories.map((category) => (
       <button
        key={category}
        onClick={() => setActiveFilter(category)}
        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 whitespace-nowrap ${
         activeFilter === category
          ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-md scale-105"
          : "bg-[#3f3f3f] text-gray-300 hover:bg-gray-600"
        }`}
       >
        {category}
       </button>
      ))}
     </div>
    </div>

    {/* Game Cards */}
    <div className="grid grid-cols-3 gap-3">
     {filteredGames.map((game) =>
      game.link ? (
       <Link
        to={game.link} // --- YEH APNE AAP UPDATED LINK USE KAREGA ---
        key={game.id}
        onClick={(e) => {
         e.preventDefault(); // stop immediate routing
         handleGameClick(game);
         setTimeout(() => {
          window.location.href = game.link; // manually open after loader
         }, 1200);
        }}
        className="group flex flex-col items-center text-center p-2 rounded-lg transition-colors hover:bg-[#3f3f3f]"
       >
        <div className="w-full aspect-square rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-md">
         <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover"
          onError={(e) => {
           e.target.onerror = null;
           e.target.src =
            "https://placehold.co/100x100/3f3f3f/ffffff?text=Game";
          }}
         />
      _  </div>
        <span className="text-gray-200 text-xs mt-2 font-medium break-words">
         {game.name}
        </span>
       </Link>
      ) : (
       <button
        key={game.id}
        onClick={() => handleGameClick(game)}
        className="group flex flex-col items-center text-center p-2 rounded-lg transition-colors hover:bg-[#3f3f3f]"
       >
        <div className="w-full aspect-square rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-md">
         <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover"
         />
        </div>
        <span className="text-gray-200 text-xs mt-2 font-medium break-words">
         {game.name}
        </span>
       </button>
      )
     )}
    </div>
   </div>

   <LoadingOverlay isVisible={isLoading} message={loadingMessage} />
   
   {/* Wallet Blocked Modal */}
   <WalletBlockedModal
    isOpen={showWalletBlockedModal}
    onClose={() => setShowWalletBlockedModal(false)}
    onRecharge={handleRechargeClick}
   />
  </div>
 );
};

export default LotteryGames;