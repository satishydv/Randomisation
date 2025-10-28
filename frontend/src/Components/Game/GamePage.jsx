import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gameAPI } from '../../utils/api';
import { 
  gameTabs, 
  numberDataMap, 
  initialMyHistoryData,
  initialHistory30s,
  initialHistory60s,
  initialHistory180s,
  initialHistory300s
} from './utils/gameData';
import GameTabs from './GameTabs';
import GameTimer from './GameTimer';
import BettingSection from './BettingSection';
import HistoryTabs from './HistoryTabs';
import GameHistoryTable from './GameHistoryTable';
import MyHistoryTable from './MyHistoryTable';
import HowToPlayModal from './HowToPlayModal';
import ResultModal from './ResultModal';
import QueueStatus from './QueueStatus';
import GameResultModal from './GameResultModal';
import useGameTimers from './hooks/useGameTimers';
import GlobalStyles from './Styles/GlobalStyles';
import WalletCard from './WalletCard';
import Headersg from './Headersg';
import HorizontalNoticeBar from '../Homepage/NoticeBar';
import { GameProvider, useGameContext } from '../../contexts/GameContext';

// Hook to remember previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// Map tabId to initial dummy history
const initialHistoryMap = {
  1: initialHistory30s,
  2: initialHistory60s,
  3: initialHistory180s,
  4: initialHistory300s
};

// Game Content Component (uses GameContext)
function GameContent() {
  const location = useLocation();
  
  // Add debugging
  console.log('GameContent rendering...');
  
  let gameContext;
  try {
    gameContext = useGameContext();
    console.log('GameContext loaded successfully:', gameContext);
  } catch (error) {
    console.error('GameContext error:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Context Error</h1>
          <p className="text-gray-300 mb-4">Failed to load game context.</p>
          <p className="text-sm text-gray-500">Error: {error.message}</p>
        </div>
      </div>
    );
  }
  
  const { playGame1, hasBets, getTabResult, clearTabResult, isTabLoading } = gameContext;

  // --- Active Tab State with URL support ---
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const tabId = params.get('tab');
    if (tabId) {
      const foundTab = gameTabs.find(tab => tab.id === parseInt(tabId, 10));
      if (foundTab) return foundTab;
    }
    return gameTabs[0];
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [activeHistoryTab, setActiveHistoryTab] = useState('game');
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);
  const [resultModalData, setResultModalData] = useState(null);
  const [betSuccess, setBetSuccess] = useState(false);
  const [betsPlaced, setBetsPlaced] = useState(new Set());
  const [apiError, setApiError] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [gameResultModal, setGameResultModal] = useState({ isOpen: false, userResult: null, gameResult: null });
  const [walletRefreshTrigger, setWalletRefreshTrigger] = useState(0);

  const { timers, periods } = useGameTimers();
  const activeTimerValue = timers[activeTab.duration];
  const activePeriodForDisplay = periods[activeTab.duration];

  // --- Auto History Logic Per Tab ---
  const [tabHistory, setTabHistory] = useState({}); // { tabId: [historyItems] }

  // Initialize tab history with 7 dummy records per tab
  useEffect(() => {
    setTabHistory(prev => ({
      ...prev,
      [activeTab.id]: initialHistoryMap[activeTab.id] || []
    }));
  }, [activeTab.id]);

  // Check for queue results when timer reaches 5 seconds
  useEffect(() => {
    if (activeTimerValue === 5 && hasBets(activeTab.id)) {
      const checkQueueResults = async () => {
        try {
          setApiError(null);
          // Get results from queue system instead of calling game API
          const result = await gameAPI.getTimerResult('1');
          
          if (result.success && result.data.has_result) {
            const gameResult = result.data.game_result;
            const userResult = result.data.user_result;
            
            // Debug logging
            console.log('Game result structure:', gameResult);
            console.log('Outcomes:', gameResult.outcomes);
            
            // Update history with queue result
            const newItem = {
              period: Date.now().toString().slice(0, 12),
              number: gameResult.generatedNumber,
              bs: gameResult.outcomes?.bigSmall || 'Unknown',
              colors: gameResult.outcomes?.colors || []
            };

            setTabHistory(prev => {
              const prevHistory = prev[activeTab.id] || [];
              return {
                ...prev,
                [activeTab.id]: [newItem, ...prevHistory.slice(0, 6)] // keep top 7
              };
            });

            // Show result modal with queue results
            if (betsPlaced.has(activeTab.id)) {
              const userWinLoss = userResult.isWinner ? 
                { isWin: true, profit: userResult.result.netProfit || userResult.result.winningAmount } :
                { isWin: false, profit: userResult.result.netLoss || 0 };

              setResultModalData({
                gameName: activeTab.name,
                period: newItem.period,
                gameResult: newItem,
                userResult: userWinLoss
              });

              setBetsPlaced(prev => {
                const newSet = new Set(prev);
                newSet.delete(activeTab.id);
                return newSet;
              });

              // Refresh wallet balance after game result
              setWalletRefreshTrigger(prev => prev + 1);
            }
          } else {
            // No queue results available - show "no game played" message
            console.log('No queue results available for this game');
          }
        } catch (error) {
          console.error('Queue Result Error:', error);
          setApiError(error.message);
        }
      };

      checkQueueResults();
    }
  }, [activeTimerValue, activeTab.id, hasBets, betsPlaced]);

  // Check for queue results when timer hits 0 (fallback for no bets)
  useEffect(() => {
    if (activeTimerValue === 0 && !hasBets(activeTab.id)) {
      const checkQueueResults = async () => {
        try {
          // Check if there are any queue results available
          const result = await gameAPI.getTimerResult('1');
          
          if (result.success && result.data.has_result) {
            const gameResult = result.data.game_result;
            
            // Update history with queue result
            const newItem = {
              period: Date.now().toString().slice(0, 12),
              number: gameResult.generatedNumber,
              bs: gameResult.outcomes?.bigSmall || 'Unknown',
              colors: gameResult.outcomes?.colors || []
            };

            setTabHistory(prev => {
              const prevHistory = prev[activeTab.id] || [];
              return {
                ...prev,
                [activeTab.id]: [newItem, ...prevHistory.slice(0, 6)] // keep top 7
              };
            });
          } else {
            // No queue results - generate random result as fallback
            const randomIndex = Math.floor(Math.random() * numberDataMap.length);
            const randomResult = numberDataMap[randomIndex];
            const newPeriod = Date.now().toString().slice(0, 12);

            const newItem = {
              period: newPeriod,
              number: randomResult.path,
              bs: randomResult.bs,
              colors: randomResult.colors
            };

            setTabHistory(prev => {
              const prevHistory = prev[activeTab.id] || [];
              return {
                ...prev,
                [activeTab.id]: [newItem, ...prevHistory.slice(0, 6)] // keep top 7
              };
            });
          }
        } catch (error) {
          console.error('Queue Result Error (fallback):', error);
          // Fallback to random result on error
          const randomIndex = Math.floor(Math.random() * numberDataMap.length);
          const randomResult = numberDataMap[randomIndex];
          const newPeriod = Date.now().toString().slice(0, 12);

          const newItem = {
            period: newPeriod,
            number: randomResult.path,
            bs: randomResult.bs,
            colors: randomResult.colors
          };

          setTabHistory(prev => {
            const prevHistory = prev[activeTab.id] || [];
            return {
              ...prev,
              [activeTab.id]: [newItem, ...prevHistory.slice(0, 6)] // keep top 7
            };
          });
        }
      };

      checkQueueResults();
    }
  }, [activeTimerValue, activeTab.id, hasBets]);

  const activeGameHistoryData = tabHistory[activeTab.id] || [];

  const handleBetSuccess = (betData) => {
    setBetSuccess(true);
    setTimeout(() => setBetSuccess(false), 2000);
    // Track that this tab has bets for the current period
    setBetsPlaced(prev => new Set(prev).add(activeTab.id));
    
    // Set session ID if this is a new bet
    if (betData && betData.sessionId) {
      setCurrentSessionId(betData.sessionId);
    }

    // Refresh wallet balance after bet placement
    setWalletRefreshTrigger(prev => prev + 1);
  };

  const prevActiveGameHistory = usePrevious(activeGameHistoryData);
  const prevActiveTab = usePrevious(activeTab);

  // Show result modal if bet won/lost
  useEffect(() => {
    if (!prevActiveGameHistory || !prevActiveTab) return;
    if (prevActiveTab.id !== activeTab.id) return;

    const historyChanged = activeGameHistoryData !== prevActiveGameHistory &&
      activeGameHistoryData.length > 0 &&
      (prevActiveGameHistory.length === 0 || activeGameHistoryData[0]?.period !== prevActiveGameHistory[0]?.period);

    if (historyChanged) {
      const newGameResult = activeGameHistoryData[0];
      if (betsPlaced.has(newGameResult.period)) {
        const dummyUserResult = {
          isWin: Math.random() > 0.5,
          profit: Math.random() > 0.5 ? 98.00 : -100.00
        };

        setResultModalData({
          gameName: activeTab.name,
          period: newGameResult.period,
          gameResult: newGameResult,
          userResult: dummyUserResult
        });

        setBetsPlaced(prev => {
          const newSet = new Set(prev);
          newSet.delete(newGameResult.period);
          return newSet;
        });
      }
    }
  }, [activeGameHistoryData, activeTab, prevActiveGameHistory, prevActiveTab, betsPlaced]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <GlobalStyles />

      <div className="w-full max-w-2xl mx-auto">
        <Headersg />

        <WalletCard refreshTrigger={walletRefreshTrigger} />
        <HorizontalNoticeBar />
        <GameTabs activeTab={activeTab} onSelect={setActiveTab} />

        <GameTimer
          activeTab={activeTab}
          seconds={activeTimerValue}
          period={activePeriodForDisplay}
          onHowToPlayClick={() => setIsHowToPlayModalOpen(true)}
        />

        {/* API Error Display */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            <p className="font-semibold">Game Error:</p>
            <p className="text-sm">{apiError}</p>
            <button 
              onClick={() => setApiError(null)}
              className="mt-2 text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {isTabLoading(activeTab.id) && (
          <div className="mb-4 p-3 bg-blue-900/50 border border-blue-500 rounded-lg text-blue-200">
            <p className="font-semibold">Processing Game...</p>
            <p className="text-sm">Please wait while we process your bets.</p>
          </div>
        )}

        <BettingSection
          activeTab={activeTab}
          activeTimerValue={activeTimerValue}
          betSuccess={betSuccess}
          onBetSuccess={handleBetSuccess}
        />


        {/* Queue Status */}
        {currentSessionId && (
          <div className="mt-5">
            <QueueStatus 
              sessionId={currentSessionId}
              onGameComplete={(result) => {
                console.log('Game completed:', result);
                // Show result modal
                if (result.user_result) {
                  setGameResultModal({
                    isOpen: true,
                    userResult: result.user_result,
                    gameResult: result.game_result
                  });
                }
              }}
            />
          </div>
        )}

        <div className="mt-5 bg-[#1e1e1e] rounded-2xl shadow-md text-white overflow-hidden">
          <HistoryTabs activeTab={activeHistoryTab} onSelect={setActiveHistoryTab} />
          <div>
            {activeHistoryTab === 'game' && <GameHistoryTable gameType={activeTab.id} limit={7} />}
            {activeHistoryTab === 'my' && <MyHistoryTable limit={7} />}
          </div>
        </div>
      </div>

      {isHowToPlayModalOpen && <HowToPlayModal onClose={() => setIsHowToPlayModalOpen(false)} />}
      {resultModalData && <ResultModal {...resultModalData} onClose={() => setResultModalData(null)} />}
      
      {/* Game Result Modal */}
      <GameResultModal
        isOpen={gameResultModal.isOpen}
        onClose={() => setGameResultModal({ isOpen: false, userResult: null, gameResult: null })}
        userResult={gameResultModal.userResult}
        gameResult={gameResultModal.gameResult}
      />
    </div>
  );
}

// Main GamePage component with GameProvider
export default function GamePage() {
  try {
    return (
      <GameProvider>
        <GameContent />
      </GameProvider>
    );
  } catch (error) {
    console.error('GamePage Error:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Game Error</h1>
          <p className="text-gray-300 mb-4">Something went wrong loading the game.</p>
          <p className="text-sm text-gray-500">Error: {error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
