// src/pages/Settings.jsx
import React from 'react';
import { Bell, Lock, Palette, Globe } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

          <div className="space-y-6">
            <SettingItem
              icon={<Bell className="w-5 h-5" />}
              title="Notifications"
              description="Manage your notification preferences"
            />
            <SettingItem
              icon={<Lock className="w-5 h-5" />}
              title="Privacy & Security"
              description="Control your privacy settings"
            />
            <SettingItem
              icon={<Palette className="w-5 h-5" />}
              title="Appearance"
              description="Customize the app appearance"
            />
            <SettingItem
              icon={<Globe className="w-5 h-5" />}
              title="Language"
              description="Choose your language"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, title, description }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </div>
);

export default Settings;
