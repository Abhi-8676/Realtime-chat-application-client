// src/constants/socketEvents.js
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Conversation
  CONVERSATION_JOIN: 'conversation:join',
  CONVERSATION_LEAVE: 'conversation:leave',
  CONVERSATION_JOINED: 'conversation:joined',

  // Messages
  MESSAGE_SEND: 'message:send',
  MESSAGE_NEW: 'message:new',
  MESSAGE_EDIT: 'message:edit',
  MESSAGE_EDITED: 'message:edited',
  MESSAGE_DELETE: 'message:delete',
  MESSAGE_DELETED: 'message:deleted',
  MESSAGE_REACT: 'message:react',
  MESSAGE_REACTED: 'message:reacted',

  // Typing
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  TYPING_USER: 'typing:user',
  TYPING_STOPPED: 'typing:stopped',

  // Read Receipts
  MESSAGES_READ: 'messages:read',

  // User Status
  USER_STATUS: 'user:status',
  USER_STATUS_UPDATE: 'user:status-update',
  USER_GET_ONLINE: 'user:get-online',
  USER_ONLINE_LIST: 'user:online-list',

  // Rooms
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_JOINED: 'room:joined',
  ROOM_MESSAGE: 'room:message',
  ROOM_MESSAGE_NEW: 'room:message-new',
  ROOM_USER_JOINED: 'room:user-joined',
  ROOM_USER_LEFT: 'room:user-left',
};