// API Utility Functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/game';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add Authorization header if access token exists
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    defaultOptions.headers.Authorization = `Bearer ${accessToken}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    return {
      success: response.ok,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      data: { message: 'Network error. Please check your connection.' },
      status: 0,
    };
  }
};

// Authentication API functions
export const authAPI = {
  // Login user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  // Logout user
  logout: async (refreshToken) => {
    return apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  // Verify access token
  verifyToken: async () => {
    return apiRequest('/auth/verify', {
      method: 'POST',
    });
  },
};

// Token management utilities
export const tokenManager = {
  // Store tokens in localStorage
  setTokens: (accessToken, refreshToken, userData) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    if (userData) {
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
  },

  // Get tokens from localStorage
  getTokens: () => ({
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    userData: JSON.parse(localStorage.getItem('user_data') || 'null'),
  }),

  // Clear tokens from localStorage
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const accessToken = localStorage.getItem('access_token');
    return !!accessToken;
  },

  // Get authorization header
  getAuthHeader: () => {
    const accessToken = localStorage.getItem('access_token');
    return accessToken ? `Bearer ${accessToken}` : null;
  },
};

export default apiRequest;
