// src/components/sidebar/ChatListItem.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveConversation } from '../../store/slices/chatSlice';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../common/Avatar';

const ChatListItem = ({ conversation, isActive }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers } = useSelector((state) => state.chat);

  // Get the other participant
  const otherParticipant = conversation.participants.find(
    (p) => p._id !== user._id
  );

  const isOnline = onlineUsers.includes(otherParticipant?._id);
  const unreadCount = conversation.unreadCount || 0;

  const handleClick = () => {
    dispatch(setActiveConversation(conversation._id));
  };

  return (
    <div
      onClick={handleClick}
      className={`
        p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100
        ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
      `}
    >
      <div className="flex items-center space-x-3">
        <Avatar
          src={otherParticipant?.avatar}
          alt={otherParticipant?.username}
          status={isOnline ? 'online' : 'offline'}
          size="lg"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 truncate">
              {otherParticipant?.username}
            </h4>
            {conversation.lastMessage && (
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(conversation.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-600 truncate">
              {conversation.lastMessage?.content || 'No messages yet'}
            </p>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;