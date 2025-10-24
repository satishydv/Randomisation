import React, { createContext, useContext, useState, useCallback } from 'react';
import { gameAPI } from '../utils/api';

const GameContext = createContext();

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  // Betting state for all 4 tabs
  const [tabBets, setTabBets] = useState({
    1: { number: null, color: null, bigSmall: null }, // 30s tab
    2: { number: null, color: null, bigSmall: null }, // 60s tab
    3: { number: null, color: null, bigSmall: null }, // 180s tab
    4: { number: null, color: null, bigSmall: null }, // 300s tab
  });

  // Game results for all tabs
  const [tabResults, setTabResults] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  // Loading states for API calls
  const [loadingStates, setLoadingStates] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  // Add bet to specific tab
  const addBet = useCallback((tabId, betType, betData) => {
    setTabBets(prev => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        [betType]: betData
      }
    }));
  }, []);

  // Clear bets for specific tab
  const clearTabBets = useCallback((tabId) => {
    setTabBets(prev => ({
      ...prev,
      [tabId]: { number: null, color: null, bigSmall: null }
    }));
  }, []);

  // Check if tab has any bets
  const hasBets = useCallback((tabId) => {
    const bets = tabBets[tabId];
    return bets.number || bets.color || bets.bigSmall;
  }, [tabBets]);

  // Get current user ID from localStorage
  const getCurrentUserId = useCallback(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.user_id || parsed.id;
    }
    return null;
  }, []);

  // Play Game 1 for specific tab
  const playGame1 = useCallback(async (tabId) => {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const bets = tabBets[tabId];
    if (!hasBets(tabId)) {
      throw new Error('No bets placed for this tab');
    }

    // Prepare player data for API
    const playerBets = {};
    if (bets.number) {
      playerBets.number = {
        value: bets.number.value,
        amount: bets.number.amount
      };
    }
    if (bets.color) {
      playerBets.color = {
        value: bets.color.value,
        amount: bets.color.amount
      };
    }
    if (bets.bigSmall) {
      playerBets.bigSmall = {
        value: bets.bigSmall.value,
        amount: bets.bigSmall.amount
      };
    }

    const players = [{
      userId: userId,
      bets: playerBets
    }];

    setLoadingStates(prev => ({ ...prev, [tabId]: true }));

    try {
      const response = await gameAPI.playGame1(players);
      
      if (response.success) {
        setTabResults(prev => ({
          ...prev,
          [tabId]: response.data
        }));
        
        // Clear bets after successful game
        clearTabBets(tabId);
        
        return response.data;
      } else {
        throw new Error(response.data.error || 'Game failed');
      }
    } catch (error) {
      console.error('Game 1 API Error:', error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, [tabId]: false }));
    }
  }, [tabBets, hasBets, getCurrentUserId, clearTabBets]);

  // Get tab bets
  const getTabBets = useCallback((tabId) => {
    return tabBets[tabId];
  }, [tabBets]);

  // Get tab result
  const getTabResult = useCallback((tabId) => {
    return tabResults[tabId];
  }, [tabResults]);

  // Clear tab result
  const clearTabResult = useCallback((tabId) => {
    setTabResults(prev => ({
      ...prev,
      [tabId]: null
    }));
  }, []);

  // Check if tab is loading
  const isTabLoading = useCallback((tabId) => {
    return loadingStates[tabId];
  }, [loadingStates]);

  const value = {
    tabBets,
    addBet,
    clearTabBets,
    hasBets,
    playGame1,
    getTabBets,
    getTabResult,
    clearTabResult,
    isTabLoading,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
