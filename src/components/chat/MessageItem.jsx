// src/components/chat/MessageItem.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import Avatar from '../common/Avatar';

const MessageItem = ({ message }) => {
  const { user } = useSelector((state) => state.auth);
  const isOwn = message.sender._id === user?._id || message.sender._id?.toString() === user?._id?.toString();
  const isRead = message.readBy?.length > 1; // More than just the sender

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`flex items-end space-x-2 max-w-[70%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {!isOwn && (
          <Avatar
            src={message.sender.avatar}
            alt={message.sender.username}
            size="sm"
          />
        )}

        <div>
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwn
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-white text-gray-900 rounded-bl-none shadow'
            }`}
          >
            {!isOwn && (
              <p className="text-xs font-semibold mb-1 opacity-70">
                {message.sender.username}
              </p>
            )}
            <p className="text-sm wrap-break">{message.content}</p>
            {message.isEdited && (
              <span className="text-xs opacity-70 italic"> (edited)</span>
            )}
          </div>

          <div
            className={`flex items-center mt-1 space-x-1 ${
              isOwn ? 'justify-end' : 'justify-start'
            }`}
          >
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(message.createdAt), {
                addSuffix: true,
              })}
            </span>
            {isOwn && (
              <span>
                {isRead ? (
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                ) : (
                  <Check className="w-3 h-3 text-gray-400" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;