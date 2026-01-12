// d:\Genxsys\realtime-chat-application\client\src\services\api\chatApi.js

import api from './axiosConfig';
import { API_ENDPOINTS } from '../../constants/apiEndPoints';

/**
 * Chat API Service
 * Handles all chat and messaging operations
 */
export const chatApi = {
  // ==========================================
  // CONVERSATION ENDPOINTS
  // ==========================================

  /**
   * Get all conversations for the current user
   * @returns {Promise} Array of conversations with participants and last message
   * @example
   * const conversations = await chatApi.getConversations();
   * // Returns: [{ _id, participants, lastMessage, unreadCount, updatedAt }]
   */
  getConversations: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_CONVERSATIONS);
      return response; // Already parsed by axios interceptor
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  /**
   * Create a new conversation or get existing one
   * @param {string} participantId - ID of the user to chat with
   * @returns {Promise} Conversation object
   * @example
   * const conversation = await chatApi.createConversation('user123');
   */
  createConversation: async (participantId) => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_CONVERSATION, {
        participantId,
      });
      return response;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  /**
   * Get conversation by ID
   * @param {string} conversationId - Conversation ID
   * @returns {Promise} Conversation details
   */
  getConversationById: async (conversationId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_CONVERSATIONS}/${conversationId}`);
      return response;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  /**
   * Delete a conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise} Success message
   */
  deleteConversation: async (conversationId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.GET_CONVERSATIONS}/${conversationId}`);
      return response;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  // ==========================================
  // MESSAGE ENDPOINTS
  // ==========================================

  /**
   * Get messages for a specific conversation
   * @param {string} conversationId - Conversation ID
   * @param {number} page - Page number for pagination (default: 1)
   * @param {number} limit - Number of messages per page (default: 50)
   * @returns {Promise} Object with messages array and pagination info
   * @example
   * const data = await chatApi.getMessages('conv123', 1, 50);
   * // Returns: { messages: [...], currentPage: 1, totalPages: 5 }
   */
  getMessages: async (conversationId, page = 1, limit = 50) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_MESSAGES(conversationId), {
        params: { page, limit },
      });
      return response;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  /**
   * Send a new message
   * @param {Object} messageData - Message data
   * @param {string} messageData.conversationId - Conversation ID (required if not roomId)
   * @param {string} messageData.roomId - Room ID (required if not conversationId)
   * @param {string} messageData.content - Message content
   * @param {string} messageData.type - Message type (text, image, file)
   * @param {string} messageData.replyTo - Message ID to reply to (optional)
   * @returns {Promise} Created message object
   * @example
   * const message = await chatApi.sendMessage({
   *   conversationId: 'conv123',
   *   content: 'Hello!',
   *   type: 'text'
   * });
   */
  sendMessage: async (messageData) => {
    try {
      const response = await api.post(API_ENDPOINTS.SEND_MESSAGE, messageData);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Edit an existing message
   * @param {string} messageId - Message ID
   * @param {string} content - New message content
   * @returns {Promise} Updated message object
   * @example
   * const updatedMessage = await chatApi.editMessage('msg123', 'Updated text');
   */
  editMessage: async (messageId, content) => {
    try {
      const response = await api.put(API_ENDPOINTS.EDIT_MESSAGE(messageId), {
        content,
      });
      return response;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  },

  /**
   * Delete a message
   * @param {string} messageId - Message ID
   * @returns {Promise} Success message
   * @example
   * await chatApi.deleteMessage('msg123');
   */
  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.DELETE_MESSAGE(messageId));
      return response;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  /**
   * Mark messages as read
   * @param {string} conversationId - Conversation ID
   * @param {Array<string>} messageIds - Array of message IDs (optional)
   * @returns {Promise} Success message
   * @example
   * await chatApi.markAsRead('conv123', ['msg1', 'msg2']);
   */
  markAsRead: async (conversationId, messageIds = []) => {
    try {
      const response = await api.patch(API_ENDPOINTS.MARK_AS_READ(conversationId), {
        messageIds,
      });
      return response;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  /**
   * React to a message (emoji reaction)
   * @param {string} messageId - Message ID
   * @param {string} emoji - Emoji to react with
   * @returns {Promise} Updated message with reactions
   * @example
   * await chatApi.reactToMessage('msg123', '👍');
   */
  reactToMessage: async (messageId, emoji) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.SEND_MESSAGE}/${messageId}/react`, {
        emoji,
      });
      return response;
    } catch (error) {
      console.error('Error reacting to message:', error);
      throw error;
    }
  },

  /**
   * Remove reaction from a message
   * @param {string} messageId - Message ID
   * @param {string} emoji - Emoji to remove
   * @returns {Promise} Updated message
   */
  removeReaction: async (messageId, emoji) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.SEND_MESSAGE}/${messageId}/react`, {
        data: { emoji },
      });
      return response;
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw error;
    }
  },

  // ==========================================
  // SEARCH ENDPOINTS
  // ==========================================

  /**
   * Search messages across all conversations or specific conversation
   * @param {string} query - Search query
   * @param {string} conversationId - Optional conversation ID to limit search
   * @returns {Promise} Array of matching messages
   * @example
   * const results = await chatApi.searchMessages('hello', 'conv123');
   */
  searchMessages: async (query, conversationId = null) => {
    try {
      const params = { query };
      if (conversationId) {
        params.conversationId = conversationId;
      }

      const response = await api.get(API_ENDPOINTS.SEARCH_MESSAGES, { params });
      return response;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  },

  // ==========================================
  // ADVANCED FEATURES
  // ==========================================

  /**
   * Get message by ID
   * @param {string} messageId - Message ID
   * @returns {Promise} Message object
   */
  getMessageById: async (messageId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.SEND_MESSAGE}/${messageId}`);
      return response;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  },

  /**
   * Forward a message to another conversation
   * @param {string} messageId - Message ID to forward
   * @param {string} targetConversationId - Target conversation ID
   * @returns {Promise} New message object
   */
  forwardMessage: async (messageId, targetConversationId) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.SEND_MESSAGE}/${messageId}/forward`, {
        conversationId: targetConversationId,
      });
      return response;
    } catch (error) {
      console.error('Error forwarding message:', error);
      throw error;
    }
  },

  /**
   * Pin a message in conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} messageId - Message ID
   * @returns {Promise} Updated conversation
   */
  pinMessage: async (conversationId, messageId) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.GET_CONVERSATIONS}/${conversationId}/pin`, {
        messageId,
      });
      return response;
    } catch (error) {
      console.error('Error pinning message:', error);
      throw error;
    }
  },

  /**
   * Archive a conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise} Success message
   */
  archiveConversation: async (conversationId) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.GET_CONVERSATIONS}/${conversationId}/archive`);
      return response;
    } catch (error) {
      console.error('Error archiving conversation:', error);
      throw error;
    }
  },

  /**
   * Mute a conversation
   * @param {string} conversationId - Conversation ID
   * @param {Date} mutedUntil - Date until conversation is muted
   * @returns {Promise} Updated conversation
   */
  muteConversation: async (conversationId, mutedUntil = null) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.GET_CONVERSATIONS}/${conversationId}/mute`, {
        mutedUntil,
      });
      return response;
    } catch (error) {
      console.error('Error muting conversation:', error);
      throw error;
    }
  },
};
