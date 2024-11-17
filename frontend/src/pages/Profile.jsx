import React, { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
              <h2 className="text-2xl font-bold text-white">
                {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
              </h2>
              <p className="text-gray-400">
                {user ? user.email : 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections - Added border-r */}
        <div className="space-y-8 max-w-md border-r border-dark-300 pr-8">
          {/* Account Settings */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 bg-dark-300 rounded-xl hover:bg-dark-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <KeyIcon className="h-5 w-5 text-primary" />
                  <span className="text-gray-300">Password & Security</span>
                </div>
              </button>
              <button className="w-full flex items-center p-3 bg-dark-300 rounded-xl hover:bg-dark-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <BellIcon className="h-5 w-5 text-primary" />
                  <span className="text-gray-300">Notifications</span>
                </div>
              </button>
              <button className="w-full flex items-center p-3 bg-dark-300 rounded-xl hover:bg-dark-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-5 w-5 text-primary" />
                  <span className="text-gray-300">Privacy</span>
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-dark-300" />

          {/* Help & Support */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Help & Support</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 bg-dark-300 rounded-xl hover:bg-dark-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-primary" />
                  <span className="text-gray-300">Documentation</span>
                </div>
              </button>
              <button className="w-full flex items-center p-3 bg-dark-300 rounded-xl hover:bg-dark-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-primary" />
                  <span className="text-gray-300">FAQ</span>
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-dark-300" />

          {/* Logout Button */}
          <div>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 