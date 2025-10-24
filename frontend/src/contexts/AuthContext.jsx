import React, { createContext, useContext, useState, useEffect } from 'react';
import { tokenManager, authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { accessToken, userData } = tokenManager.getTokens();
        
        if (accessToken && userData) {
          // Verify token is still valid
          const response = await authAPI.verifyToken();
          
          if (response.success) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, try to refresh
            const { refreshToken } = tokenManager.getTokens();
            if (refreshToken) {
              const refreshResponse = await authAPI.refreshToken(refreshToken);
              
              if (refreshResponse.success) {
                // Update access token
                localStorage.setItem('access_token', refreshResponse.data.tokens.access_token);
                setUser(userData);
                setIsAuthenticated(true);
              } else {
                // Refresh failed, clear tokens
                tokenManager.clearTokens();
                setUser(null);
                setIsAuthenticated(false);
              }
            } else {
              // No refresh token, clear everything
              tokenManager.clearTokens();
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        tokenManager.clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        const { access_token, refresh_token } = response.data.tokens;
        const userData = response.data.data;
        
        tokenManager.setTokens(access_token, refresh_token, userData);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      const { refreshToken } = tokenManager.getTokens();
      
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
