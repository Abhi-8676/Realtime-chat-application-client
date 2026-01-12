// src/components/sidebar/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { fetchConversations } from '../../store/slices/chatSlice';
import { fetchRooms } from '../../store/slices/roomSlice';
import socketService from '../../services/socket/socketService';
import { MoreVertical, Settings, LogOut, Plus } from 'lucide-react';
import Avatar from '../common/Avatar';
import SearchBar from './SearchBar';
import ChatList from './ChatList';
import RoomList from './RoomList';
import NewChatModal from './NewChatModal';
import CreateRoomModal from './CreateRoomModal';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('chats');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Listen for new conversations and rooms
  useEffect(() => {
    const handleNewConversation = () => {
      dispatch(fetchConversations());
    };

    const handleNewRoom = () => {
      dispatch(fetchRooms());
    };

    socketService.onNewConversation(handleNewConversation);
    socketService.onNewRoom(handleNewRoom);

    return () => {
      socketService.off('conversation:new', handleNewConversation);
      socketService.off('room:new', handleNewRoom);
    };
  }, [dispatch]);

  const handleNewClick = () => {
    if (activeTab === 'chats') {
      setShowNewChatModal(true);
    } else {
      setShowCreateRoomModal(true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* User Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar
              src={user?.avatar}
              alt={user?.username}
              status="online"
              size="md"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{user?.username}</h3>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-gray-700">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <SearchBar />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chats'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'rooms'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Rooms
        </button>
      </div>

      {/* Chat/Room List */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' ? <ChatList /> : <RoomList />}
      </div>

      {/* New Chat/Room Button */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleNewClick}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New {activeTab === 'chats' ? 'Chat' : 'Room'}</span>
        </button>
      </div>

      {showNewChatModal && <NewChatModal onClose={() => setShowNewChatModal(false)} />}
      {showCreateRoomModal && <CreateRoomModal onClose={() => setShowCreateRoomModal(false)} />}
    </div>
  );
};

export default Sidebar;