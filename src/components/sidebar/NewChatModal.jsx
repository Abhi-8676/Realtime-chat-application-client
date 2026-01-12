import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveConversation, fetchConversations } from '../../store/slices/chatSlice';
import { X, Search, User } from 'lucide-react';
import Avatar from '../common/Avatar';
import { debounce } from '../../services/utils/debounce';
import api from '../../services/api/axiosConfig';

const NewChatModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (data.status === 'success') {
        setUsers(data.data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(searchUsers, 500);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const startConversation = async (userId) => {
    try {
      const response = await api.post('/api/chats/conversations', { participantId: userId });
      if (response.data?.status === 'success' || response.status === 200 || response.status === 201) {
        dispatch(fetchConversations());
        dispatch(setActiveConversation(response.data.conversation._id));
        onClose();
      }
    } catch (err) {
      console.error('Failed to start conversation', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-lg">New Chat</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={query}
              onChange={handleSearchChange}
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Searching...</div>
            ) : users.length > 0 ? (
              <div className="space-y-2">
                {users.map(user => (
                  <button
                    key={user._id}
                    onClick={() => startConversation(user._id)}
                    className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Avatar src={user.avatar} alt={user.username} size="sm" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-4 text-gray-500">No users found</div>
            ) : (
              <div className="text-center py-4 text-gray-500">Type to search for users</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;