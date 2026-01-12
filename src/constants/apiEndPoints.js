// src/constants/apiEndpoints.js
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh-token',
  GET_ME: '/api/auth/me',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',

  // Users
  GET_PROFILE: '/api/users/profile',
  UPDATE_PROFILE: '/api/users/profile',
  UPLOAD_AVATAR: '/api/users/avatar',
  SEARCH_USERS: '/api/users/search',
  GET_CONTACTS: '/api/users/contacts',
  UPDATE_STATUS: '/api/users/status',

  // Chats
  GET_CONVERSATIONS: '/api/chats/conversations',
  CREATE_CONVERSATION: '/api/chats/conversations',
  GET_MESSAGES: (conversationId) => `/api/chats/conversations/${conversationId}/messages`,
  SEND_MESSAGE: '/api/chats/messages',
  DELETE_MESSAGE: (messageId) => `/api/chats/messages/${messageId}`,
  EDIT_MESSAGE: (messageId) => `/api/chats/messages/${messageId}`,
  MARK_AS_READ: (conversationId) => `/api/chats/conversations/${conversationId}/read`,
  SEARCH_MESSAGES: '/api/chats/search',

  // Rooms
  GET_ROOMS: '/api/rooms',
  CREATE_ROOM: '/api/rooms',
  GET_ROOM: (roomId) => `/api/rooms/${roomId}`,
  UPDATE_ROOM: (roomId) => `/api/rooms/${roomId}`,
  DELETE_ROOM: (roomId) => `/api/rooms/${roomId}`,
  JOIN_ROOM: (roomId) => `/api/rooms/${roomId}/join`,
  LEAVE_ROOM: (roomId) => `/api/rooms/${roomId}/leave`,
  GET_ROOM_MEMBERS: (roomId) => `/api/rooms/${roomId}/members`,
  INVITE_TO_ROOM: (roomId) => `/api/rooms/${roomId}/invite`,

  // Files
  UPLOAD_FILE: '/api/files/upload',
  GET_FILE: (fileId) => `/api/files/${fileId}`,
  DELETE_FILE: (fileId) => `/api/files/${fileId}`,

  // Notifications
  GET_NOTIFICATIONS: '/api/notifications',
  MARK_NOTIFICATION_READ: (notificationId) => `/api/notifications/${notificationId}/read`,
  CLEAR_NOTIFICATIONS: '/api/notifications/clear',
};