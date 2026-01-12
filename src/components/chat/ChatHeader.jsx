// src/components/chat/ChatHeader.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Menu, Phone, Video, Search, MoreVertical } from 'lucide-react';
import Avatar from '../common/Avatar';

const ChatHeader = ({ conversation, isRoom, onToggleSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers } = useSelector((state) => state.chat);

  let name, avatar, status;

  if (isRoom) {
    name = conversation.name;
    avatar = conversation.avatar; // Assuming room has avatar or use default
    status = `${conversation.members?.length || 0} members`;
  } else {
    const otherParticipant = conversation.participants?.find((p) => p._id !== user._id);
    name = otherParticipant?.username;
    avatar = otherParticipant?.avatar;
    const isOnline = onlineUsers.includes(otherParticipant?._id);
    status = isOnline ? 'Online' : `Last seen ${otherParticipant?.lastSeen ? new Date(otherParticipant.lastSeen).toLocaleTimeString() : 'recently'}`;
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <Avatar
            src={avatar}
            alt={name}
            status={!isRoom && (status === 'Online' ? 'online' : 'offline')}
            size="md"
          />

          <div>
            <h3 className="font-semibold text-gray-900">
              {name}
            </h3>
            <p className="text-xs text-gray-500">
              {status}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;