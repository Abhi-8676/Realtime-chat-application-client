// src/components/chat/ChatWindow.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, addMessage } from '../../store/slices/chatSlice';
import socketService from '../../services/socket/socketService';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Loader from '../common/Loader';

const ChatWindow = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const { activeConversation, conversations } = useSelector((state) => state.chat);
  // Fallback to check rooms if not found in conversations (assuming room slice exists)
  const rooms = useSelector((state) => state.room?.rooms);
  const safeRooms = rooms || [];

  let conversation = conversations.find((c) => c._id === activeConversation);
  let isRoom = false;

  if (!conversation) {
    conversation = safeRooms.find((r) => r._id === activeConversation);
    if (conversation) isRoom = true;
  }

  useEffect(() => {
    if (activeConversation) {
      // Fetch messages
      dispatch(fetchMessages({ conversationId: activeConversation }));

      // Join via socket
      if (isRoom) {
        socketService.joinRoom(activeConversation);
      } else {
        socketService.joinConversation(activeConversation);
      }

      // Listen for incoming messages
      const handleNewMessage = (data) => {
        if (data.conversationId === activeConversation || data.roomId === activeConversation) {
          dispatch(addMessage(data.message));
        }
      };

      socketService.onNewMessage(handleNewMessage);
      socketService.onNewRoomMessage(handleNewMessage);

      return () => {
        isRoom ? socketService.leaveRoom(activeConversation) : socketService.leaveConversation(activeConversation);
        socketService.off('message:new', handleNewMessage);
        socketService.off('room:message-new', handleNewMessage);
      };
    }
  }, [activeConversation, dispatch, isRoom]);

  if (!conversation) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center">
        <Loader text="Loading chat..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader conversation={conversation} isRoom={isRoom} onToggleSidebar={onToggleSidebar} />
      <MessageList conversationId={activeConversation} />
      <MessageInput conversationId={activeConversation} isRoom={isRoom} />
    </div>
  );
};

export default ChatWindow;