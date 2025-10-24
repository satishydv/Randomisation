import React, { useState } from 'react';
import { XCircle } from 'lucide-react'; // Using XCircle (Fail icon) from lucide-react

// --- 1. The Toast Component ---
const FailMessageToast = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    // Custom dark theme styling for the Toast
    const toastStyle = {
        backgroundColor: '#cc3333', // Dark Red for Error
        color: '#ffffff',
        padding: '12px 20px',
        borderRadius: '8px',
        textAlign: 'center',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 4000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '250px',
    };

    return (
        <div 
            role="dialog" 
            tabIndex="0" 
            className="fail_message_toast" 
            style={toastStyle}
            onClick={onClose} // Close on click anywhere in the toast
        >
            <div className="van-toast__icon mb-2">
                {/* Error Icon */}
                <XCircle size={32} className="text-white" />
            </div>
            
            <div className="van-toast__text font-bold text-lg">
                Error: 1003
            </div>
            
            <div className="van-toast__text text-sm mt-1">
                Game requires recharge to enter
            </div>
        </div>
    );
};


// --- 2. Example Usage in a Game Card Component ---
const GameCard = () => {
    // State to manage the visibility of the toast
    const [isErrorToastVisible, setIsErrorToastVisible] = useState(false);

    // This function runs when the user clicks 'Play Now'
    const handleGameClick = () => {
        // In a real app, you'd check the user's balance/status here (e.g., if (balance < required) { ... })
        const userHasRecharged = false; // Simulate: User has NOT recharged

        if (!userHasRecharged) {
            // Show the error toast
            setIsErrorToastVisible(true);
            
            // Automatically hide the toast after 3 seconds (3000ms)
            setTimeout(() => {
                setIsErrorToastVisible(false);
            }, 3000); 
        } else {
            // Logic to navigate/enter the game
            console.log("Entering Game...");
        }
    };

    return (
        <div className="p-4 bg-[#3c3c3c] rounded-lg shadow-xl text-white max-w-sm mx-auto mt-10">
            <h3 className="text-xl font-semibold mb-3">Popular Slot Game</h3>
            <p className="text-gray-400 mb-4">Spin the reels for a chance to win big!</p>
            
            <button 
                onClick={handleGameClick}
                className="w-full py-3 font-bold rounded-lg transition-colors"
                style={{ backgroundColor: '#ffc107', color: 'black' }} // Golden/Accent Button
            >
                Play Now
            </button>
            
            {/* The Error Pop-up Component */}
            <FailMessageToast 
                isVisible={isErrorToastVisible} 
                onClose={() => setIsErrorToastVisible(false)} // Allows manual closing
            />
        </div>
    );
};

export default GameCard;