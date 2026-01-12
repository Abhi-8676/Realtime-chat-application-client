// src/services/socket/socketService.js
import { io } from 'socket.io-client';
import { APP_CONFIG } from '../../constants/appConfig';
import { SOCKET_EVENTS } from '../../constants/socketEvents';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  // Connect to socket server
  connect(token) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(APP_CONFIG.SOCKET_URL, {
      auth: { token },
      reconnectionAttempts: APP_CONFIG.RECONNECTION_ATTEMPTS,
      reconnectionDelay: APP_CONFIG.RECONNECTION_DELAY,
    });

    this.setupEventListeners();
  }

  // Setup basic event listeners
  setupEventListeners() {
    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on(SOCKET_EVENTS.ERROR, (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
      console.log('Socket disconnected manually');
    }
  }

  // Emit event
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not initialized. Cannot emit:', event);
    }
  }

  // Listen to event
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  // Remove listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove from stored listeners
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    }
  }

  // Join conversation
  joinConversation(conversationId) {
    this.emit(SOCKET_EVENTS.CONVERSATION_JOIN, conversationId);
  }

  // Leave conversation
  leaveConversation(conversationId) {
    this.emit(SOCKET_EVENTS.CONVERSATION_LEAVE, conversationId);
  }

  // Send message
  sendMessage(messageData) {
    this.emit(SOCKET_EVENTS.MESSAGE_SEND, messageData);
  }

  // Start typing
  startTyping(conversationId) {
    this.emit(SOCKET_EVENTS.TYPING_START, { conversationId });
  }

  // Stop typing
  stopTyping(conversationId) {
    this.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
  }

  // Mark messages as read
  markMessagesRead(conversationId, messageIds) {
    this.emit(SOCKET_EVENTS.MESSAGES_READ, { conversationId, messageIds });
  }

  // Update user status
  updateUserStatus(status) {
    this.emit(SOCKET_EVENTS.USER_STATUS_UPDATE, { status });
  }

  // Join room
  joinRoom(roomId) {
    this.emit(SOCKET_EVENTS.ROOM_JOIN, roomId);
  }

  // Leave room
  leaveRoom(roomId) {
    this.emit(SOCKET_EVENTS.ROOM_LEAVE, roomId);
  }

  // Send room message
  sendRoomMessage(roomId, content, type = 'text') {
    this.emit(SOCKET_EVENTS.ROOM_MESSAGE, { roomId, content, type });
  }

  // Edit message
  editMessage(messageId, content, conversationId) {
    this.emit(SOCKET_EVENTS.MESSAGE_EDIT, { messageId, content, conversationId });
  }

  // Delete message
  deleteMessage(messageId, conversationId) {
    this.emit(SOCKET_EVENTS.MESSAGE_DELETE, { messageId, conversationId });
  }

  // React to message
  reactToMessage(messageId, emoji, conversationId) {
    this.emit(SOCKET_EVENTS.MESSAGE_REACT, { messageId, emoji, conversationId });
  }

  // Get online users
  getOnlineUsers() {
    this.emit(SOCKET_EVENTS.USER_GET_ONLINE);
  }

  // Listen for new messages
  onNewMessage(callback) {
    this.on('message:new', callback);
  }

  // Listen for new room messages
  onNewRoomMessage(callback) {
    this.on('room:message-new', callback);
  }

  // Listen for new conversation
  onNewConversation(callback) {
    this.on('conversation:new', callback);
  }

  // Listen for new room
  onNewRoom(callback) {
    this.on('room:new', callback);
  }

  // Listen for user joined room
  onRoomUserJoined(callback) {
    this.on('room:user-joined', callback);
  }

  // Listen for user left room
  onRoomUserLeft(callback) {
    this.on('room:user-left', callback);
  }

  // Check connection status
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  // Get socket ID
  getSocketId() {
    return this.socket?.id;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;