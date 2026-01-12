// d:\Genxsys\realtime-chat-application\client\src\services\api\userApi.js

import api from './axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndPoints';

/**
 * User API Service
 * Handles all user profile and management operations
 */
export const userApi = {
  // ==========================================
  // PROFILE ENDPOINTS
  // ==========================================

  /**
   * Get current user's profile
   * @returns {Promise} User profile object
   * @example
   * const profile = await userApi.getProfile();
   * // Returns: { _id, username, email, avatar, bio, status }
   */
  getProfile: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_PROFILE);
      return response;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise} User profile
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_PROFILE}/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  /**
   * Update current user's profile
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.username - New username
   * @param {string} profileData.email - New email
   * @param {string} profileData.bio - New bio
   * @returns {Promise} Updated user object
   * @example
   * const updated = await userApi.updateProfile({
   *   username: 'newname',
   *   bio: 'My new bio'
   * });
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put(API_ENDPOINTS.UPDATE_PROFILE, profileData);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Change password
   * @param {Object} passwordData
   * @param {string} passwordData.currentPassword
   * @param {string} passwordData.newPassword
   * @returns {Promise} Success message
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.UPDATE_PROFILE}/change-password`, passwordData);
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // ==========================================
  // AVATAR ENDPOINTS
  // ==========================================

  /**
   * Upload user avatar/profile picture
   * @param {File} file - Image file to upload
   * @param {Function} onUploadProgress - Progress callback
   * @returns {Promise} Updated user with new avatar URL
   * @example
   * const user = await userApi.uploadAvatar(file, (progress) => {
   *   console.log(`Upload ${progress}% complete`);
   * });
   */
  uploadAvatar: async (file, onUploadProgress) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post(API_ENDPOINTS.UPLOAD_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(percentCompleted);
          }
        },
      });

      return response;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  /**
   * Remove user avatar (set to default)
   * @returns {Promise} Updated user
   */
  removeAvatar: async () => {
    try {
      const response = await api.delete(API_ENDPOINTS.UPLOAD_AVATAR);
      return response;
    } catch (error) {
      console.error('Error removing avatar:', error);
      throw error;
    }
  },

  // ==========================================
  // USER SEARCH & DISCOVERY
  // ==========================================

  /**
   * Search for users
   * @param {string} query - Search query (username or email)
   * @param {number} limit - Max results (default: 20)
   * @returns {Promise} Array of matching users
   * @example
   * const users = await userApi.searchUsers('john', 10);
   */
  searchUsers: async (query, limit = 20) => {
    try {
      const response = await api.get(API_ENDPOINTS.SEARCH_USERS, {
        params: { query, limit },
      });
      return response;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  /**
   * Get all users (admin only)
   * @param {number} page - Page number
   * @param {number} limit - Users per page
   * @returns {Promise} Paginated users
   */
  getAllUsers: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_PROFILE}/all`, {
        params: { page, limit },
      });
      return response;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  // ==========================================
  // CONTACTS ENDPOINTS
  // ==========================================

  /**
   * Get user's contact list
   * @returns {Promise} Array of contacts
   * @example
   * const contacts = await userApi.getContacts();
   */
  getContacts: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_CONTACTS);
      return response;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  /**
   * Add user to contacts
   * @param {string} userId - User ID to add
   * @returns {Promise} Updated contacts list
   */
  addContact: async (userId) => {
    try {
      const response = await api.post(API_ENDPOINTS.GET_CONTACTS, { userId });
      return response;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  },

  /**
   * Remove user from contacts
   * @param {string} userId - User ID to remove
   * @returns {Promise} Success message
   */
  removeContact: async (userId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.GET_CONTACTS}/${userId}`);
      return response;
    } catch (error) {
      console.error('Error removing contact:', error);
      throw error;
    }
  },

  // ==========================================
  // STATUS & PRESENCE
  // ==========================================

  /**
   * Update user status (online, offline, away)
   * @param {string} status - New status ('online', 'offline', 'away')
   * @returns {Promise} Updated user
   * @example
   * await userApi.updateStatus('away');
   */
  updateStatus: async (status) => {
    try {
      const response = await api.patch(API_ENDPOINTS.UPDATE_STATUS, { status });
      return response;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },

  /**
   * Update custom status message
   * @param {string} statusMessage - Custom status text
   * @param {string} emoji - Status emoji
   * @returns {Promise} Updated user
   */
  updateCustomStatus: async (statusMessage, emoji = null) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.UPDATE_STATUS}/custom`, {
        statusMessage,
        emoji,
      });
      return response;
    } catch (error) {
      console.error('Error updating custom status:', error);
      throw error;
    }
  },

  /**
   * Get online users
   * @returns {Promise} Array of online users
   */
  getOnlineUsers: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_PROFILE}/online`);
      return response;
    } catch (error) {
      console.error('Error fetching online users:', error);
      throw error;
    }
  },

  // ==========================================
  // BLOCKING & PRIVACY
  // ==========================================

  /**
   * Block a user
   * @param {string} userId - User ID to block
   * @returns {Promise} Success message
   */
  blockUser: async (userId) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.GET_PROFILE}/block`, { userId });
      return response;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  },

  /**
   * Unblock a user
   * @param {string} userId - User ID to unblock
   * @returns {Promise} Success message
   */
  unblockUser: async (userId) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.GET_PROFILE}/unblock`, { userId });
      return response;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  },

  /**
   * Get blocked users list
   * @returns {Promise} Array of blocked users
   */
  getBlockedUsers: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_PROFILE}/blocked`);
      return response;
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      throw error;
    }
  },

  // ==========================================
  // PREFERENCES & SETTINGS
  // ==========================================

  /**
   * Update user preferences
   * @param {Object} preferences - User preferences
   * @returns {Promise} Updated preferences
   */
  updatePreferences: async (preferences) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.GET_PROFILE}/preferences`, preferences);
      return response;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  },

  /**
   * Get user preferences
   * @returns {Promise} User preferences object
   */
  getPreferences: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_PROFILE}/preferences`);
      return response;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  },

  // ==========================================
  // ACCOUNT MANAGEMENT
  // ==========================================

  /**
   * Delete user account
   * @param {string} password - Current password for confirmation
   * @returns {Promise} Success message
   */
  deleteAccount: async (password) => {
    try {
      const response = await api.delete(API_ENDPOINTS.GET_PROFILE, {
        data: { password },
      });
      return response;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  /**
   * Export user data
   * @returns {Promise} User data export
   */
  exportUserData: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_PROFILE}/export`);
      return response;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  },
};
