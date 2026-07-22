/**
 * API Configuration
 * Centralized API client for connecting frontend to Django backend
 */

// Base API URL - can be configured via environment variable

const API_BASE_URL = 'http://127.0.0.1:8000/api';  // url de la base ,pointe sur le serveure local de django 

/*Fonction : Crée les headers HTTP pour les requêtes
Paramètre : token (optionnel) pour l'authentification JWT
Comportement :
Toujours envoie Content-Type: application/json
Ajoute Authorization: Bearer <token> si un token est fourni
Utilisation : Utilisée dans toutes les requêtes pour standardiser les headers  */

const getHeaders = (token = null) => {// creation of an arrow function  with null on parameter values if we  dont give a value it still null
 // creation of an object with json as type
  const headers = {// creation of an object with json as type 
    'Content-Type': 'application/json',
  };
  
  if (token) {// if token exist we will give the auth
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;  
};

// recuper le jwt
const getAuthToken = () => {
  return localStorage.getItem('token') || null;
};

// Store auth token
const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Main API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;//bringing the url 
  const token = options.token || getAuthToken();
// bring the token
  
  const defaultOptions = {
    headers: getHeaders(token),
    ...options,
  };
  
  try {// la requete part vers django
    const response = await fetch(url, defaultOptions);
    
          // Handle 401 Unauthorized - remove token and redirect to login
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
      return null;
    }
    
       // For 204 No Content, return empty object
    if (response.status === 204) {
      return { success: true };
    }
    
      // For 404, return null
    if (response.status === 404) {
      return null;
    }
    
    const data = await response.json();
    
    // Check for error in response
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// API endpoints organized by domain
export const api = {
  // Base URL
      baseUrl: API_BASE_URL,
  
  // Auth endpoints
  auth: {
    login: (credentials) => apiRequest('/users/api/token/', {
      method: 'POST',
      body: JSON.stringify(credentials),
      token: null, // Don't send token for login
    }),
    refreshToken: (refreshToken) => apiRequest('/users/api/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
      token: null,
    }),
    
    getCurrentUser: () => apiRequest('/users/current/'),
  },
  
  // Chat endpoints
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
  
  // Dataset endpoints
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
  
  // Analytics endpoints
  analytics: {
    getSummary: () => apiRequest('/analytics/summary/'),
    getQueryLogs: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/analytics/query-logs/?${queryString}`);
    },
    getUserAnalytics: () => apiRequest('/analytics/user/'),
  },
  
  // User endpoints
  user: {
    getAll: () => apiRequest('/users/list/'),
    getById: (userId) => apiRequest(`/users/${userId}/`),
    create: (userData) => apiRequest('/users/create/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  },
  
  // TTS endpoint
  tts: {
    generate: (text) => apiRequest('/tts/', {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: {},
      responseType: 'arraybuffer',
    }),
  },
  
  // Utility functions
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getHeaders,
  
  // Direct request for custom endpoints
  request: apiRequest,
};

export default api;
