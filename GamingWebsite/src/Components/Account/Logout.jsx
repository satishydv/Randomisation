import React, { useState } from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Logout = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Call the logout function from AuthContext
      // This will clear tokens and update authentication state
      await logout();
      
      console.log("User logged out successfully!");
      setShowDialog(false);
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local session and redirect
      localStorage.clear();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Log out बटन */}
      <div className='w-full pt-7 pb-14 max-w-sm mx-auto font-sans'>
        <button
          onClick={() => setShowDialog(true)}
          className='w-full p-3 border border-[#f2dd9b] rounded-full text-[#f2dd9b] text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition-transform active:scale-95'
        >
          <i className="ri-logout-circle-line pr-3"></i>
          Log out
        </button>
      </div>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#4d4d4c]  rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 text-center">
            <div className="mx-auto flex  flex-col items-center justify-center h-16 w-16 rounded-full bg-red-600">
              <IoWarningOutline className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mt-4">
              Do you want to log out?
            </h1>
          
            <div className="mt-6 flex flex-col justify-center gap-4">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-8 py-2.5 bg-gradient-to-r from-[#f2dd9b] to-[#c4933f] text-white font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging out...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
              <button
                onClick={() => setShowDialog(false)}
                disabled={isLoggingOut}
                className="px-8 py-2.5 text-[#c4933f] font-semibold rounded-full border border-[#f2dd9b] disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
