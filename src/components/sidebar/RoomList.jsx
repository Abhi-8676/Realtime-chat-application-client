// src/components/sidebar/RoomList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms } from '../../store/slices/roomSlice';
import { setActiveConversation } from '../../store/slices/chatSlice';
import Avatar from '../common/Avatar';
import Loader from '../common/Loader';

const RoomList = () => {
  const dispatch = useDispatch();
  const roomState = useSelector((state) => state.room);
  const { rooms, isLoading } = roomState || { rooms: [], isLoading: false };
  const { activeConversation } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader text="Loading rooms..." />
      </div>
    );
  }

  return (
    <div>
      {rooms.map((room) => (
        <div
          key={room._id}
          onClick={() => dispatch(setActiveConversation(room._id))}
          className={`
            p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100
            ${activeConversation === room._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
          `}
        >
          <div className="flex items-center space-x-3">
            <Avatar src={room.avatar} alt={room.name} size="md" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900">{room.name}</h4>
              <p className="text-sm text-gray-600">{room.members?.length || 0} members • {room.category}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
