/**
 * API Configuration
 * Centralized API client for connecting frontend to Django backend
 */

// Use relative URL so Vite proxy handles the routing in development
// In production, set VITE_API_BASE_URL environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;  
};

const getAuthToken = () => {
  return localStorage.getItem('token') || null;
};

const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

const removeAuthToken = () => {
  localStorage.removeItem('token');
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = options.token || getAuthToken();
  
  const defaultOptions = {
    headers: getHeaders(token),
    ...options,
  };
  
  try {
    const response = await fetch(url, defaultOptions);
    
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
      return null;
    }
    
    if (response.status === 204) {
      return { success: true };
    }
    
    if (response.status === 404) {
      return null;
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const api = {
  baseUrl: API_BASE_URL,
  
  auth: {
    register: (userData) => apiRequest('/users/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
      token: null,
    }),
    login: (credentials) => apiRequest('/users/api/token/', {
      method: 'POST',
      body: JSON.stringify(credentials),
      token: null,
    }),
    refreshToken: (refreshToken) => apiRequest('/users/api/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
      token: null,
    }),
    getCurrentUser: () => apiRequest('/users/current/'),
  },
  
  chat: {
    sendMessage: (message, userId) => apiRequest('/chatbot/chat/', {
      method: 'POST',
      body: JSON.stringify({ message, user_id: userId }),
    }),
    getConversationHistory: (conversationId) => apiRequest(`/chatbot/conversations/${conversationId}/history/`),
    uploadDataset: (file, title) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      return apiRequest('/chatbot/upload/', {
        method: 'POST',
        body: formData,
        headers: {},
      });
    },
    getAnalytics: () => apiRequest('/chatbot/analytics/'),
  },
  
  dataset: {
    getFAQs: () => apiRequest('/dataset/faq/'),
    getFAQ: (faqId) => apiRequest(`/dataset/faq/${faqId}/`),
    getDocuments: () => apiRequest('/dataset/documents/'),
    getDocument: (documentId) => apiRequest(`/dataset/documents/${documentId}/`),
    uploadDocument: (file, title) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      return apiRequest('/dataset/documents/upload/', {
        method: 'POST',
        body: formData,
        headers: {},
      });
    },
    deleteDocument: (documentId) => apiRequest(`/dataset/documents/${documentId}/delete/`, {
      method: 'DELETE',
    }),
    search: (query, limit = 5) => apiRequest('/dataset/search/', {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    }),
  },
  
  analytics: {
    getSummary: () => apiRequest('/analytics/summary/'),
    getQueryLogs: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/analytics/query-logs/?${queryString}`);
    },
    getUserAnalytics: () => apiRequest('/analytics/user/'),
  },
  
  user: {
    getAll: () => apiRequest('/users/list/'),
    getById: (userId) => apiRequest(`/users/${userId}/`),
    create: (userData) => apiRequest('/users/create/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  },
  
  tts: {
    generate: (text) => apiRequest('/chatbot/tts/', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
  },
  
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getHeaders,
  request: apiRequest,
};

export default api;
