import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

// Sample winners
const initialWinningData = [
    { id: 1, username: "Naz***m", amount: "4,505.00" ,gameImage:"/winning2img.png"},
    { id: 2, username: "Fai***al", amount: "170.00",gameImage:"/winningimg.png" },
    { id: 3, username: "Mem***OBO", amount: "4,420.00",gameImage:"/winningimg3.png" },
    { id: 4, username: "kha***n", amount: "4,505.00",gameImage:"/winningimg.png" },
    { id: 5, username: "Mem***YTR", amount: "420.00",gameImage:"/winningimg.png" },
    { id: 6, username: "Mem***VFW", amount: "3,924.45" ,gameImage:"/winningimg3.png"},
    { id: 7, username: "Mem***XYZ", amount: "1,234.50", gameImage:"/winning2img.png "},
    { id: 8, username: "Mem***ABC", amount: "500.00" ,gameImage:"/winningimg3.png"},
];

const userImages = [
    "https://i.pravatar.cc/40?img=1",
    "https://i.pravatar.cc/40?img=2",
    "https://i.pravatar.cc/40?img=3",
    "https://i.pravatar.cc/40?img=4",
    "https://i.pravatar.cc/40?img=5",
    "https://i.pravatar.cc/40?img=6",
    "https://i.pravatar.cc/40?img=7",
    "https://i.pravatar.cc/40?img=8",
];

const ITEM_HEIGHT = 77; 

const WinningInfo = () => {
    const [winners, setWinners] = useState([]);
    const listRef = useRef(null);
    const tlRef = useRef(null); // GSAP Timeline reference
    const hasAnimated = useRef(false);

    // 1. Initialize data and duplicate for seamless loop
    useEffect(() => {
        const data = initialWinningData.map((item, i) => ({
            ...item,
            userImage: userImages[i % userImages.length],
            // Use unique IDs for keys
            id: `${item.id}-${i}`,
        }));

        const duplicatedData = [
            ...data.map(item => ({...item, id: `set1-${item.id}`})),
            ...data.map(item => ({...item, id: `set2-${item.id}`})),
            ...data.map(item => ({...item, id: `set3-${item.id}`})) 
        ];
        setWinners(duplicatedData);
    }, []);

    // 2. GSAP Continuous Scroll Logic
    useEffect(() => {
        if (!listRef.current || winners.length === 0 || hasAnimated.current) return;
        
        hasAnimated.current = true;
        
        const originalListLength = initialWinningData.length;
        const totalOriginalHeight = originalListLength * ITEM_HEIGHT;

        const tl = gsap.timeline({
            repeat: -1, // Repeat infinitely
            paused: true,
            onRepeat: () => {
                gsap.set(listRef.current, { y: 0 }); 
            }
        });


        const animationDistance = totalOriginalHeight * 2; 

        tl.fromTo(listRef.current, 
            { y: 0 }, 
            { 
                y: -animationDistance, 
                duration: originalListLength * 0.8 * 2, 
                ease: "none", 
            }
        );
        
        tlRef.current = tl; 

        const timer = setTimeout(() => {
            tl.play();
        }, 500); 

        return () => {
            clearTimeout(timer);
            if (tlRef.current) tlRef.current.kill(); 
        };
        
    }, [winners]);


    return (
        <div className="w-full max-w-[480px] bg-[#222] rounded-xl p-4 mt-6 shadow-2xl border border-[#333] overflow-hidden">
            <h2 className="text-xl font-bold text-white mb-3">Winning Information</h2>

            <div className="h-[520px] overflow-hidden relative">
                <div
                    ref={listRef}
                    className="flex flex-col space-y-3"
                    style={{ transform: 'translateY(0px)' }} 
                >
                    {winners.map((winner) => (
                        <div
                            key={winner.id}
                            className="flex items-center justify-between bg-[#333] p-4 rounded-lg shadow-md transition-transform duration-300"
                            style={{ minHeight: "65px" }} 
                        >
                            <div className="flex items-center space-x-3">
                                <img
                                    src={winner.userImage}
                                    alt="User"
                                    className="w-12 h-12 rounded-full border border-gray-600"
                                />
                                <div>
                                    <p className="text-gray-300 text-md font-medium">
                                        {winner.username}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <img
                                    src={winner.gameImage}
                                    alt="Game"
                                    className="w-28 h-12 object-cover rounded-2xl"
                                />
                                <div className="text-right">
                                    <p className="text-green-400 font-bold text-lg">
                                        💲{winner.amount}
                                    </p>
                                    <p className="text-gray-300 text-xs">Winning amount</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WinningInfo;