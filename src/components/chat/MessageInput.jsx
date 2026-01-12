// src/components/chat/MessageInput.jsx
import React, { useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage } from '../../store/slices/chatSlice';
import socketService from '../../services/socket/socketService';
import { Send, Smile, Paperclip, Image as ImageIcon } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { debounce } from '../../services/utils/debounce';

const MessageInput = ({ conversationId, isRoom }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);

  const stopTyping = useCallback(
    debounce(() => {
      socketService.stopTyping(conversationId);
      setIsTyping(false);
    }, 2000),
    [conversationId]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim() && !isTyping) {
      socketService.startTyping(conversationId);
      setIsTyping(true);
    }

    if (value.trim()) {
      stopTyping();
    } else if (isTyping) {
      socketService.stopTyping(conversationId);
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      const messageData = {
        content: message.trim(),
        type: 'text',
      };

      if (isRoom) {
        messageData.roomId = conversationId;
      } else {
        messageData.conversationId = conversationId;
      }

      dispatch(sendMessage(messageData));
      
      setMessage('');
      setShowEmojiPicker(false);
      
      if (isTyping) {
        socketService.stopTyping(conversationId);
        setIsTyping(false);
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-10">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      <div className="flex items-end space-x-2">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Smile className="w-5 h-5 text-gray-600" />
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ImageIcon className="w-5 h-5 text-gray-600" />
        </button>

        <textarea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
        />

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;