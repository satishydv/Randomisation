import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Import your components
import Homepage from "./Homepage";
import FloatingIcons from "./FloatingIcons ";
import NavBar from "./Components/NAvbar/Navbar";
import AuthPage from "./Components/Login/AuthPage";
import ScrollTop from "./ScrollTop";
import Activtypage from "./Activtypage";
import ActivityLayout from "./Components/Activity/ActivityRoutedetails";
import GiftPage from "./Components/Activity/Gift/GiftPage";
import Accountpage from "./Accountpage";
import Depositepage from "./Components/Account/DepositRouter/Depositepage";
import UpiPaymentDetails from "./Components/Account/DepositRouter/UpiPaymentpage";

// ✅ Import your popup (don’t change its content)
import FirstDepositBonusDialog from "./Components/Popup/Popup";
import Depositehistorypage from "./Components/Account/DepositDetails/Depositehistorypage";
import Withdrawpage from "./Components/Account/Witdrawdetails/Withdrawpage";

const App = () => {
  const location = useLocation();

  // 💡 Show popup control
  const [isBonusPopupOpen, setIsBonusPopupOpen] = useState(false);

  // 💡 Routes where popup + navbar should appear
  const popupRoutes = ["/", "/activity", "/promotion", "/account"];

  // 💡 Show popup automatically when user navigates to any of these routes
  useEffect(() => {
    if (popupRoutes.includes(location.pathname)) {
      setIsBonusPopupOpen(true);
    } else {
      setIsBonusPopupOpen(false);
    }
  }, [location.pathname]);

  // 💡 Determine if Navbar or Floating icons should show
  const showNavBar = popupRoutes.includes(location.pathname);
  const showFloatingIcons = location.pathname !== "/login";

  return (
    <AuthProvider>
      <div id="app" className="min-h-screen flex justify-center items-center bg-[#2c2c2e]">
        <div className="relative w-[480px] h-[800px] bg-[#222222] text-white overflow-hidden flex flex-col rounded-xl shadow-2xl">
          
          {/* Scrollable Content */}
          <div id="scroll" className="flex-1 overflow-y-auto pb-48">
            <ScrollTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<AuthPage />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route path="/activity" element={
                <ProtectedRoute>
                  <Activtypage />
                </ProtectedRoute>
              } />
              <Route path="/activity/:id" element={
                <ProtectedRoute>
                  <ActivityLayout />
                </ProtectedRoute>
              } />
              <Route path="/gift" element={
                <ProtectedRoute>
                  <GiftPage />
                </ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute>
                  <Accountpage />
                </ProtectedRoute>
              } />
              <Route path="/deposit" element={
                <ProtectedRoute>
                  <Depositepage />
                </ProtectedRoute>
              } />
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <UpiPaymentDetails />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <Depositehistorypage />
                </ProtectedRoute>
              } />
              <Route path="/withdraw" element={
                <ProtectedRoute>
                  <Withdrawpage />
                </ProtectedRoute>
              } />
              
            </Routes>

            {showFloatingIcons && <FloatingIcons />}
          </div>

          {/* NavBar (only for main routes) */}
          {showNavBar && <NavBar />}

          {/* 💡 Popup appears when visiting any main route */}
          {isBonusPopupOpen && (
            <FirstDepositBonusDialog onClose={() => setIsBonusPopupOpen(false)} />
          )}
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
