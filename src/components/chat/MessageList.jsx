// src/components/chat/MessageList.jsx
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import Loader from '../common/Loader';

const MessageList = ({ conversationId }) => {
  const messagesEndRef = useRef(null);
  const { messages, messagesLoading, typingUsers } = useSelector((state) => state.chat);
  const conversationMessages = messages[conversationId] || [];
  
  // Filter out invalid messages and deduplicate by _id to prevent crashes and key warnings
  const validMessages = conversationMessages
    .filter(msg => msg && msg._id)
    .filter((msg, index, self) => 
      index === self.findIndex((m) => m._id === msg._id)
    );

  const typingUsersInConversation = typingUsers[conversationId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [validMessages]);

  if (messagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Loader text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
      {validMessages.map((message) => (
        <MessageItem key={message._id} message={message} />
      ))}

      {typingUsersInConversation.length > 0 && (
        <TypingIndicator users={typingUsersInConversation} />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
