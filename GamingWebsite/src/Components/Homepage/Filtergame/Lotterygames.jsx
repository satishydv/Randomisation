import React, { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react'; // Sirf Loader icon import rakha hai

// Sabhi games ke liye data (Locked status abhi bhi hai, lekin check use nahi ho raha)
const allLotteryGames = [
  { id: 1, name: 'Win Go 30s', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062051do1k.png', category: 'Win Go', locked: true },
  { id: 2, name: 'Win Go 1Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062051do1k.png', category: 'Win Go', locked: false },
  { id: 3, name: 'Win Go 3Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062051do1k.png', category: 'Win Go', locked: true },
  { id: 4, name: 'Win Go 5Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062051do1k.png', category: 'Win Go', locked: false },
  { id: 5, name: '5D 1Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062118e9kt.png', category: '5D', locked: true },
  { id: 6, name: '5D 3Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062118e9kt.png', category: '5D', locked: false },
  { id: 7, name: '5D 5Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062118e9kt.png', category: '5D', locked: false },
  { id: 8, name: '5D 10Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062118e9kt.png', category: '5D', locked: true },
  { id: 9, name: 'K3 1Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062111bt8e.png', category: 'K3', locked: false },
  { id: 10, name: 'K3 3Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062111bt8e.png', category: 'K3', locked: false },
  { id: 11, name: 'K3 5Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062111bt8e.png', category: 'K3', locked: false },
  { id: 12, name: 'K3 10Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062111bt8e.png', category: 'K3', locked: false },
  { id: 13, name: 'Trx Win Go 1Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062124qut6.png', category: 'Trx Win', locked: true },
  { id: 14, name: 'Trx Win Go 3Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062124qut6.png', category: 'Trx Win', locked: false },
  { id: 15, name: 'Trx Win Go 5Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20240110062124qut6.png', category: 'Trx Win', locked: false },
  { id: 16, name: 'MotoRace 1Min', image: 'https://ossimg.bdgadminbdg.com/IndiaBDG/lotterycategory/lotterycategory_20250516054732w6gy.png', category: 'MotoRace', locked: true },
];

// Filter tabs ka data
const filterCategories = ['All', 'Win Go', 'MotoRace', 'Trx Win', 'K3', '5D'];

// --- Loading Toast Component (Semi-transparent background) ---

/**
 * Centered modal to display loading spinner and message.
 */
const LoadingOverlay = ({ isVisible, message }) => {
    if (!isVisible) return null;

    const overlayStyle = {
        // Background ko dark aur blur kar diya (Semi-transparent)
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        backdropFilter: 'blur(2px)', 
        zIndex: 5000,
    };
    
    const toastStyle = {
        backgroundColor: 'transparent',
        color: 'white',
        padding: '20px 30px',
        borderRadius: '12px',
        
        boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center"
            style={overlayStyle}
            role="status"
            aria-live="assertive"
        >
            <div 
                className="flex flex-col items-center space-y-3"
                style={toastStyle}
            >
                {/* Loader Icon: spin animation ke saath */}
                <Loader2 size={32} className="text-yellow-400 animate-spin" />

                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    );
};

// --- Error Toast Component (Solid black background, appears after loader) ---

/**
 * Displays a fixed, centered failure message toast for all games.
 */
const FailMessageToast = ({ isVisible, code, message, onClose }) => {
    if (!isVisible) return null;

    const toastStyle = {
        // Solid Black background
        backgroundColor: 'black', 
        color: '#ffffff',
        padding: '16px 24px',
        borderRadius: '12px',
        textAlign: 'center',
        zIndex: 5001, // Loader se bhi upar
        boxShadow: '0 8px 16px rgba(0,0,0,0.8)',
        maxWidth: '280px',
        cursor: 'pointer',
    };

    return (
        <div 
            role="alert"
            tabIndex="0"
            // Fixed full screen overlay with dark background
            className="fixed inset-0 flex  items-center justify-center z-[5000]  bg-opacity-90" 
            onClick={onClose} 
        >
            <div
                className="fail_message_toast  flex flex-col items-center"
                style={toastStyle}
            >
                {/* Cross icon removed */}

                <div className="font-extrabold text-xl">
                    Error: {code}
                </div>

                <div className="text-md mt-1">
                    {message}
                </div>

      
            </div>
        </div>
    );
};


const App = () => {
    // State to manage the active filter
    const [activeFilter, setActiveFilter] = useState('All');
    
    // --- STATE FOR LOADER ---
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    
    // --- STATE FOR ERROR TOAST ---
    const [isErrorToastVisible, setIsErrorToastVisible] = useState(false);
    const [errorDetails] = useState({
        code: '1003',
        message: 'Game requires recharge to enter'
    });


    // Filtered games ki list ko calculate karo
    const filteredGames = useMemo(() => {
        if (activeFilter === 'All') {
            return allLotteryGames;
        }
        return allLotteryGames.filter(game => game.category === activeFilter);
    }, [activeFilter]);

    // --- UPDATED CLICK HANDLER (Ab sabhi clicks par error dikhayega) ---
    const handleGameClick = (game) => {
        // Clear previous error message if any
        setIsErrorToastVisible(false); 
        
        // 1. Loader aur message dikhana shuru karo
        setLoadingMessage(`Loading ${game.name}...`);
        setIsLoading(true);

        // 2. 1.5 second ka delay simulate karo
        setTimeout(() => {
            setIsLoading(false); // Loader hatao
            
            // 3. Error toast dikhao (sabb game clicks ke liye)
            setIsErrorToastVisible(true);
            
            // Error toast ko 3 seconds baad hata do
            setTimeout(() => {
                setIsErrorToastVisible(false);
            }, 3000);

            // Unlock/navigation logic removed to show error on all clicks
            console.log(`Attempted to enter ${game.name}. Showing error: ${errorDetails.code}`);

        }, 1500); // 1.5 seconds loading time
    };

    return (
        <div className="min-h-screen flex justify-center" style={{backgroundColor: '#1c1c1e', fontFamily: 'Inter, sans-serif'}}>
            <div className=" p-3 bg-[#2c2c2e] rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Lottery Games</h2>
                
                {/* Filter Tabs */}
                <div className="mb-4 overflow-x-auto">
                    <div className="flex items-center space-x-2 pb-4">
                        {filterCategories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveFilter(category)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 whitespace-nowrap ${
                                    activeFilter === category
                                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-md scale-105'
                                        : 'bg-[#3f3f3f] text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Game Cards Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {filteredGames.map(game => (
                        <button 
                            key={game.id} 
                            onClick={() => handleGameClick(game)} // Ab yahaan click handler call hoga
                            className="group flex flex-col items-center text-center p-2 rounded-lg transition-colors hover:bg-[#3f3f3f] focus:outline-none "
                        >
                            <div className="w-full aspect-square rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-md">
                                <img 
                                    src={game.image} 
                                    alt={game.name} 
                                    className="w-full h-full object-cover" 
                                    // Placeholder for broken image links
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/3f3f3f/ffffff?text=Game" }} 
                                />
                            </div>
                            <span className="text-gray-200 text-xs mt-2 font-medium break-words">{game.name}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* 1. Loading Overlay component (dikhne par backdrop blur karega) */}
            <LoadingOverlay 
                isVisible={isLoading} 
                message={loadingMessage} 
            />
            
            {/* 2. Error Toast component (loader ke baad dikhega agar game locked hai) */}
            <FailMessageToast
                isVisible={isErrorToastVisible}
                code={errorDetails.code}
                message={errorDetails.message}
                onClose={() => setIsErrorToastVisible(false)} // Click karne par band ho jaye
            />
        </div>
    );
};

export default App;
