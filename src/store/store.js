// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import userReducer from './slices/userSlice';
import notificationReducer from './slices/notificationSlice';
import roomReducer from './slices/roomSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    user: userReducer,
    notification: notificationReducer,
    room: roomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['socket/connected', 'socket/message'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.socket', 'meta.arg'],
        // Ignore these paths in the state
        ignoredPaths: ['socket.instance'],
      },
    }),
});