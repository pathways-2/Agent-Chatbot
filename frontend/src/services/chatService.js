import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else if (status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (status === 400) {
        throw new Error(data.error || 'Invalid request. Please check your input.');
      } else {
        throw new Error(data.error || `Server error: ${status}`);
      }
    } else if (error.request) {
      // Request was made but no response
      throw new Error('Unable to connect to server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred.');
    }
  }
);

export const chatService = {
  // Send a chat message
  async sendMessage(message, sessionId) {
    try {
      const response = await api.post('/chat', {
        message,
        sessionId
      });
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Check backend health
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Get conversation history
  async getConversation(sessionId) {
    try {
      const response = await api.get(`/conversation/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  // Clear conversation
  async clearConversation(sessionId) {
    try {
      const response = await api.delete(`/conversation/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error clearing conversation:', error);
      throw error;
    }
  },

  // Retry with exponential backoff
  async retryRequest(requestFn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Request failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
};

// Utility functions for error handling
export const errorUtils = {
  isNetworkError(error) {
    return error.message.includes('Unable to connect') || 
           error.message.includes('Network Error');
  },

  isServerError(error) {
    return error.message.includes('Server error') || 
           error.message.includes('500');
  },

  isRateLimitError(error) {
    return error.message.includes('Too many requests') || 
           error.message.includes('429');
  },

  getErrorMessage(error) {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return error.message || 'An unexpected error occurred';
  }
};

// Export default
export default chatService; 