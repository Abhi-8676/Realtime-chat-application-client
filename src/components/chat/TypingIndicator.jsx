// src/components/chat/TypingIndicator.jsx
import React from 'react';

const TypingIndicator = ({ users }) => {
  const usernames = users.map((u) => u.username).join(', ');

  return (
    <div className="flex justify-start">
      <div className="bg-white rounded-2xl rounded-bl-none shadow px-4 py-3 max-w-xs">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
          <span className="text-xs text-gray-500">{usernames} typing...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
