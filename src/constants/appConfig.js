// src/constants/appConfig.js
export const APP_CONFIG = {
  APP_NAME: 'Chat App',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  
  // Pagination
  MESSAGES_PER_PAGE: 50,
  CONVERSATIONS_PER_PAGE: 20,
  USERS_PER_PAGE: 20,

  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],

  // Message
  MAX_MESSAGE_LENGTH: 5000,
  TYPING_TIMEOUT: 3000, // 3 seconds

  // UI
  SIDEBAR_WIDTH: 320,
  MOBILE_BREAKPOINT: 768,
  TOAST_DURATION: 3000,

  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 seconds
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 2000, // 2 seconds
};