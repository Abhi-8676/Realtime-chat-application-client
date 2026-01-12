// src/store/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi } from '../../services/api/chatApi';
import toast from 'react-hot-toast';

// Async thunks
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApi.getConversations();
      return response.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ conversationId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await chatApi.getMessages(conversationId, page);
      return {
        conversationId,
        messages: response.data.messages,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await chatApi.sendMessage(messageData);
      return response.data.message;
    } catch (error) {
      toast.error('Failed to send message');
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (participantId, { rejectWithValue }) => {
    try {
      const response = await chatApi.createConversation(participantId);
      return response.data.conversation;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create conversation');
    }
  }
);

const initialState = {
  conversations: [],
  messages: {},
  activeConversation: null,
  typingUsers: {},
  onlineUsers: [],
  isLoading: false,
  messagesLoading: false,
  error: null,
  hasMore: {},
  currentPage: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },

    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);

      // Update last message in conversation
      const conversation = state.conversations.find(c => c._id === conversationId);
      if (conversation) {
        conversation.lastMessage = message;
        conversation.updatedAt = new Date().toISOString();
      }
    },

    updateMessage: (state, action) => {
      const { conversationId, messageId, updates } = action.payload;
      if (state.messages[conversationId]) {
        const messageIndex = state.messages[conversationId].findIndex(m => m._id === messageId);
        if (messageIndex !== -1) {
          state.messages[conversationId][messageIndex] = {
            ...state.messages[conversationId][messageIndex],
            ...updates
          };
        }
      }
    },

    deleteMessage: (state, action) => {
      const { conversationId, messageId } = action.payload;
      if (state.messages[conversationId]) {
        const messageIndex = state.messages[conversationId].findIndex(m => m._id === messageId);
        if (messageIndex !== -1) {
          state.messages[conversationId][messageIndex].isDeleted = true;
          state.messages[conversationId][messageIndex].content = 'This message was deleted';
        }
      }
    },

    setTypingUser: (state, action) => {
      const { conversationId, userId, username } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      const exists = state.typingUsers[conversationId].find(u => u.userId === userId);
      if (!exists) {
        state.typingUsers[conversationId].push({ userId, username });
      }
    },

    removeTypingUser: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(
          u => u.userId !== userId
        );
      }
    },

    updateOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      
      // Update in conversations
      state.conversations.forEach(conversation => {
        conversation.participants?.forEach(participant => {
          if (participant._id === userId) {
            participant.status = status;
          }
        });
      });

      // Update online users list
      if (status === 'online' && !state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      } else if (status === 'offline') {
        state.onlineUsers = state.onlineUsers.filter(id => id !== userId);
      }
    },

    markConversationAsRead: (state, action) => {
      const conversationId = action.payload;
      const conversation = state.conversations.find(c => c._id === conversationId);
      if (conversation && conversation.unreadCount) {
        conversation.unreadCount = 0;
      }
    },

    incrementUnreadCount: (state, action) => {
      const { conversationId, currentUserId } = action.payload;
      const conversation = state.conversations.find(c => c._id === conversationId);
      if (conversation) {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        const { conversationId, messages, currentPage, totalPages } = action.payload;
        
        if (currentPage === 1) {
          state.messages[conversationId] = messages;
        } else {
          state.messages[conversationId] = [
            ...messages,
            ...(state.messages[conversationId] || [])
          ];
        }
        
        state.currentPage[conversationId] = currentPage;
        state.hasMore[conversationId] = currentPage < totalPages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Message is added via socket event handler
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Create Conversation
      .addCase(createConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        const exists = state.conversations.find(c => c._id === action.payload._id);
        if (!exists) {
          state.conversations.unshift(action.payload);
        }
        state.activeConversation = action.payload._id;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setActiveConversation,
  addMessage,
  updateMessage,
  deleteMessage,
  setTypingUser,
  removeTypingUser,
  updateOnlineUsers,
  updateUserStatus,
  markConversationAsRead,
  incrementUnreadCount,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;