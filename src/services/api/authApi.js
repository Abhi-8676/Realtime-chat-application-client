
// src/services/api/authApi.js
import api from './axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const authApi = {
  // Register new user
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response;
  },

  // Logout user
  logout: async () => {
    const response = await api.post(API_ENDPOINTS.LOGOUT);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    return await api.get(API_ENDPOINTS.GET_ME);
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    return await api.post(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
  },

  // Forgot password
  forgotPassword: async (email) => {
    return await api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  // Reset password
  resetPassword: async (token, password) => {
    return await api.post(API_ENDPOINTS.RESET_PASSWORD.replace(':token', token), { password });
  },
};