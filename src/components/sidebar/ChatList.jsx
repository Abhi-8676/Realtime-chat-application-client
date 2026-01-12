// src/components/sidebar/ChatList.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import ChatListItem from './ChatListItem';
import Loader from '../common/Loader';

const ChatList = () => {
  const { conversations, isLoading, activeConversation } = useSelector((state) => state.chat);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader text="Loading conversations..." />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="text-gray-500 mb-2">No conversations yet</p>
        <p className="text-sm text-gray-400">Start a new chat to get started</p>
      </div>
    );
  }

  return (
    <div>
      {conversations.map((conversation) => (
        <ChatListItem
          key={conversation._id}
          conversation={conversation}
          isActive={activeConversation === conversation._id}
        />
      ))}
    </div>
  );
};

export default ChatList;