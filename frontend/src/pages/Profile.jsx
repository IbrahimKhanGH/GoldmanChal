import React from 'react';
import {
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

function Profile() {
  return (
    <div className="min-h-screen bg-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-dark-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <UserCircleIcon className="h-16 w-16 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">John Doe</h2>
              <p className="text-gray-400">john.doe@example.com</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Settings */}
          <div className="bg-dark-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-dark-300 rounded-xl hover:bg-dark-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <KeyIcon className="h-6 w-6 text-primary" />
                  <span className="text-gray-300">Password & Security</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-dark-300 rounded-xl hover:bg-dark-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <BellIcon className="h-6 w-6 text-primary" />
                  <span className="text-gray-300">Notifications</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-dark-300 rounded-xl hover:bg-dark-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-6 w-6 text-primary" />
                  <span className="text-gray-300">Privacy</span>
                </div>
              </button>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-dark-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Help & Support</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-dark-300 rounded-xl hover:bg-dark-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-6 w-6 text-primary" />
                  <span className="text-gray-300">Documentation</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-dark-300 rounded-xl hover:bg-dark-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <QuestionMarkCircleIcon className="h-6 w-6 text-primary" />
                  <span className="text-gray-300">FAQ</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile; 