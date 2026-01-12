// src/components/chat/EmptyState.jsx
import React from 'react';
import { Users, MessageCircle, Zap, Shield } from 'lucide-react';
import { Menu } from 'lucide-react';

const EmptyState = ({ onToggleSidebar }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden mb-6 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="inline-block p-6 bg-blue-100 rounded-full mb-6">
          <Users className="w-16 h-16 text-blue-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Chat App
        </h2>
        <p className="text-gray-600 mb-8">
          Select a conversation or start a new chat to begin messaging
        </p>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <FeatureCard
            icon={<MessageCircle className="w-6 h-6 text-green-600" />}
            title="Real-time"
            description="Instant messaging"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-yellow-600" />}
            title="Fast"
            description="Lightning speed"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-blue-600" />}
            title="Secure"
            description="End-to-end encryption"
          />
          <FeatureCard
            icon={<Users className="w-6 h-6 text-purple-600" />}
            title="Groups"
            description="Chat rooms"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  </div>
);

export default EmptyState;