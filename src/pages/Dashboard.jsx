// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from '../store/slices/chatSlice';
import Sidebar from '../components/sidebar/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import EmptyState from '../components/chat/EmptyState';
import socketService from '../services/socket/socketService';
import { SOCKET_EVENTS } from '../constants/socketEvents';
import {
  addMessage,
  setTypingUser,
  removeTypingUser,
  updateUserStatus,
  updateOnlineUsers,
} from '../store/slices/chatSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { activeConversation } = useSelector((state) => state.chat);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchConversations());

    // Setup socket listeners
    const handleNewMessage = (data) => {
      dispatch(addMessage({
        conversationId: data.conversationId,
        message: data.message,
      }));
    };

    const handleTyping = (data) => {
      dispatch(setTypingUser(data));
    };

    const handleStopTyping = (data) => {
      dispatch(removeTypingUser(data));
    };

    const handleUserStatus = (data) => {
      dispatch(updateUserStatus(data));
    };

    const handleOnlineUsers = (data) => {
      dispatch(updateOnlineUsers(data.users));
    };

    // Register socket listeners
    socketService.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
    socketService.on(SOCKET_EVENTS.TYPING_USER, handleTyping);
    socketService.on(SOCKET_EVENTS.TYPING_STOPPED, handleStopTyping);
    socketService.on(SOCKET_EVENTS.USER_STATUS, handleUserStatus);
    socketService.on(SOCKET_EVENTS.USER_ONLINE_LIST, handleOnlineUsers);

    // Get online users
    socketService.getOnlineUsers();

    // Cleanup
    return () => {
      socketService.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
      socketService.off(SOCKET_EVENTS.TYPING_USER, handleTyping);
      socketService.off(SOCKET_EVENTS.TYPING_STOPPED, handleStopTyping);
      socketService.off(SOCKET_EVENTS.USER_STATUS, handleUserStatus);
      socketService.off(SOCKET_EVENTS.USER_ONLINE_LIST, handleOnlineUsers);
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          ${isSidebarOpen ? 'w-80' : 'w-0'}
          bg-white border-r border-gray-200 
          transition-all duration-300 ease-in-out
          overflow-hidden
          lg:w-80
        `}
      >
        <Sidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <ChatWindow
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        ) : (
          <EmptyState
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;